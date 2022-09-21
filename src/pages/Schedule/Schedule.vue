<template>
    <div>
        <ol class="breadcrumb float-xl-end">
            <li class="breadcrumb-item">{{ $t('str.breadcrumb.schedules') }}</li>
        </ol>
        <h1 class="page-header">{{ $t('str.form.title.schedules') }}</h1>
        <hr />
        <!-- {{ calendarOptions.events }} -->
        <FullCalendar :events="appointments" :options="calendarOptions"></FullCalendar>
    </div>
</template>

<script>
import Controller from './CrtSchedule.vue'
import FullCalendar from '@fullcalendar/vue'

export default {
    components: {
        FullCalendar,
    },
    data() {
        return {
            calendarOptions: {},
            appointments: [],
        }
    },
    methods: Controller.methods,
    mounted() {},
    created() {
        Controller.init(this)
        const state = this
        this.$registerEvent.$on('changeLanguage', function () {
            state.changeLanguage()
        })
    },
}
</script>