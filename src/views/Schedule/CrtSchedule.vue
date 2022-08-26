<script>
import Endpoints from '../../components/common/Endpoints'

export default {
    init: async payload => {
        payload.domain = Endpoints.domain
        const el = document.body
        el.removeAttribute('class')
        $('.modal').modal('hide')

        payload.handleWeekendsToggle()
    },
    methods: {
        isAdminMaster: function () {
            let user = this.$session.get('user')
            if (user) {
                return user.companyUser && user.companyUser.subtype == 'ADMIN_MASTER'
            }
            return false
        },
        handleWeekendsToggle() {
            this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
        },
        handleDateSelect(selectInfo) {
            let title = prompt('Please enter a new title for your event')
            let calendarApi = selectInfo.view.calendar
            calendarApi.unselect() // clear date selection
            if (title) {
                calendarApi.addEvent({
                    id: createEventId(),
                    title,
                    start: selectInfo.startStr,
                    end: selectInfo.endStr,
                    allDay: selectInfo.allDay,
                })
            }
        },
        handleEventClick(clickInfo) {
            if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
                clickInfo.event.remove()
            }
        },
        handleEvents(events) {
            this.currentEvents = events
        },
    },
}
</script>
