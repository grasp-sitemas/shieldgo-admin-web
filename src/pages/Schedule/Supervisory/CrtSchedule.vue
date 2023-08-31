<script>
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'
import '@fullcalendar/core/vdom' // solves problem with Vite
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import enGbLocale from '@fullcalendar/core/locales/en-gb'
import moment from 'moment'

export default {
    init: async payload => {
        payload.initCalendar()

        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
        const role = await Common.getSubtype(payload)
        payload.role = role

        if (role === 'SUPER_ADMIN_MASTER') {
            payload.accounts = await Services.getAccounts(payload)
        } else {
            payload.clients = await Services.getClients(payload)
            payload.filters.account = await Common.getAccountId(payload)

            if (role === 'MANAGER' || role === 'AUDITOR') {
                const client = await Common.getClientId(payload)
                payload.filters.client = client
                payload.sites = await Services.getSites(payload)
            }
        }

        payload.getAppointments()
    },

    methods: {
        async getAppointments() {
            const appointments = await Services.getAppointmentsByDate(this, this.filters)
            this.originalAppointments = appointments
            const formattedAppointments = await this.formatAppointments(appointments)
            this.appointments = formattedAppointments ? formattedAppointments : []
            this.calendarOptions.events = this.appointments
        },
        formatAppointments: function (appointments) {
            const formattedAppointments = []
            appointments.forEach(appointment => {
                formattedAppointments.push({
                    id: appointment._id,
                    title: appointment.name,
                    start: appointment.startDate,
                })
            })
            return formattedAppointments
        },
        initCalendar: function () {
            const language = this.$session.get('user')?.language
            const locale = language === 'pt' ? 'pt-br' : 'en-gb'

            this.calendarOptions = {
                timeZone: 'America/Sao_Paulo',
                plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, bootstrapPlugin],
                locales: [ptBrLocale, enGbLocale],
                locale: locale,
                headerToolbar: {
                    left: 'dayGridMonth,timeGridWeek,timeGridDay',
                    center: 'title',
                    right: 'prev,next today',
                },
                buttonText: {
                    today: this.$t('str.today'),
                    month: this.$t('str.month'),
                    week: this.$t('str.week'),
                    day: this.$t('str.day'),
                },
                dateClick: this.handleDateClick,
                eventClick: this.handleEventClick,
                datesSet: ({ startStr, endStr }) => {
                    const currentMonth = moment(startStr).month()
                    if (this.lastFetchedMonth !== currentMonth) {
                        this.filters.startDate = moment(startStr).utc(true).format()
                        this.filters.endDate = moment(endStr).utc(true).format()
                        this.getAppointments()
                        this.lastFetchedMonth = currentMonth
                    }
                },
                initialView: 'dayGridMonth',
                droppable: false,
                editable: false,
                selectable: true,
                selectMirror: true,
                dayMaxEvents: true,
                themeSystem: 'bootstrap',
                events: this.schedules ? this.schedules : [],
                views: {
                    timeGrid: {
                        eventLimit: 6, // adjust to 6 only for timeGridWeek/timeGridDay
                    },
                },
            }
        },
        changeLanguage: function () {
            const language = this.$session.get('user')?.language
            const locale = language === 'pt' ? 'pt-br' : 'en-gb'

            this.calendarOptions.locale = locale
        },
        handleDateClick: function (arg) {
            if (this.role === 'AUDITOR') return
            this.selectedDate = moment(arg.dateStr).utc(false).format('YYYY-MM-DD')
            this.$bvModal.show('createScheduleModal')
        },
        getAppintmentById: function (id) {
            return this.originalAppointments.find(appointment => appointment._id === id)
        },
        handleEventClick: async function (arg) {
            const appointment = this.getAppintmentById(arg.event.id)

            const filters = {
                account: appointment?.account?._id,
                client: appointment?.client?._id,
                site: appointment?.site?._id,
                schedule: appointment?.schedule,
            }

            const selectedAppointment = await Services.getScheduleById(this, filters)
            selectedAppointment.appointment = appointment
            this.selectedAppointment = selectedAppointment
            console.log(this.selectedAppointment)

            this.$bvModal.show('createScheduleModal')
        },
        changeAccount: async function () {
            const account = this.filters.account

            if (account === '') {
                this.filters.client = ''
                this.filters.site = ''
            }
            this.getAppointments()
            this.clients = await Services.getClientsByAccount(this, account)
        },
        changeClient: async function () {
            const client = this.filters.client

            if (client === '') {
                this.filters.site = ''
            }

            this.getAppointments()
            this.sites = await Services.getSitesByClient(this, client)
        },
        changeSite: async function () {
            this.getAppointments()
        },
    },
}
</script>
