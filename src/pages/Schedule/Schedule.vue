<template>
    <div>
        <ol class="breadcrumb float-xl-end">
            <li class="breadcrumb-item">{{ $t('str.breadcrumb.schedules') }}</li>
        </ol>
        <h1 class="page-header">{{ $t('str.form.title.schedules') }}</h1>
        <hr />
        <CreateScheduleModal :selectedDate="selectedDate" :accounts="accounts" :clients="clients" :isSuperAdminMaster="isSuperAdminMaster" />
        <FullCalendar :events="appointments" :options="calendarOptions"></FullCalendar>
    </div>
</template>

<script>
import Controller from './CrtSchedule.vue'
import FullCalendar from '@fullcalendar/vue'
import CreateScheduleModal from './CreateScheduleModal/CreateScheduleModal.vue'
export default {
    components: {
        FullCalendar,
        CreateScheduleModal,
    },
    data() {
        return {
            calendarOptions: {},
            appointments: [],
            accounts: [],
            clients: [],
            isSuperAdminMaster: false,
            selectedDate: '',
        }
    },
    methods: Controller.methods,
    mounted() {},
    created() {
        Controller.init(this)
        const state = this
        state.$registerEvent.$on('changeLanguage', function () {
            state.changeLanguage()
        })
        state.$registerEvent.$on('refreshSchedule', function () {
            state.getAppointments()
        })
    },
}
</script>