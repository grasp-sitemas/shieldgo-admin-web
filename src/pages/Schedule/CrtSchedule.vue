<script>
// import Common from '../../common/Common.vue'
import Services from '../../common/Services.vue'
import '@fullcalendar/core/vdom' // solves problem with Vite
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import enGbLocale from '@fullcalendar/core/locales/en-gb'

export default {
    init: async payload => {
        payload.initCalendar()

        payload.getAppointments()
    },
    methods: {
        async getAppointments() {
            const appointments = await Services.getAppointmentsByDate(this, new Date())
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
                dateClick: this.handleDateSelect,
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
        },
        changeLanguage: function () {
            const language = this.$session.get('user')?.language
            const locale = language === 'pt' ? 'pt-br' : 'en-gb'

            this.calendarOptions.locale = locale
        },
        handleDateClick: function (arg) {
            alert('date click! ' + arg.dateStr)
        },
        handleEventClick: function (arg) {
            alert('event click! ' + arg.event.title + '\n' + arg.event.startStr + '\n' + arg.event.endStr)
        },
    },
}
</script>
