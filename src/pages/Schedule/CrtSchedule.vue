<script>
import Common from '../../common/Common.vue'
import Services from '../../common/Services.vue'
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
        if (payload.isSuperAdminMaster) {
            payload.accounts = await Services.getAccounts(payload)
        } else {
            payload.clients = await Services.getClients(payload)
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
                timeZone: 'UTC',
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

            console.log('calendarOptions', this.calendarOptions.locale)
        },

        changeLanguage: function () {
            const language = this.$session.get('user')?.language
            const locale = language === 'pt' ? 'pt-br' : 'en-gb'

            this.calendarOptions.locale = locale
        },
        handleDateClick: function (arg) {
            this.selectedDate = new Date(arg.dateStr).toLocaleDateString()
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
                status: 'ACTIVE',
            }

            const selectedAppointment = await Services.getScheduleById(this, filters)
            selectedAppointment.beginDate = moment(selectedAppointment?.beginDate).format('YYYY-MM-DD')
            selectedAppointment.endDate = moment(selectedAppointment?.endDate).format('YYYY-MM-DD')
            selectedAppointment.appointment = appointment
            this.selectedAppointment = selectedAppointment

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
