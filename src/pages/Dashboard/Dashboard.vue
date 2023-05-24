<template>
    <div>
        <h1 class="page-header">{{ $t('str.form.title.dashboard') }}</h1>
        <hr />

        <div class="row mt-4">
            <div class="col-md-4">
                <date-range-picker
                    ref="picker"
                    class="form-select btn btn-dark me-2"
                    :opens="dateRange.opens"
                    :locale-data="dateRange.sampleLocaleData"
                    :singleDatePicker="dateRange.singleDatePicker"
                    :timePicker="dateRange.timePicker"
                    :timePicker24Hour="dateRange.timePicker24Hour"
                    :showWeekNumbers="dateRange.showWeekNumbers"
                    :showDropdowns="dateRange.showDropdowns"
                    :autoApply="dateRange.autoApply"
                    v-model="dateRange.range"
                    @update="updateValues"
                    :linkedCalendars="dateRange.linkedCalendars"
                    :date-range="dateRange"
                    :locale="dateRange.locale"
                >
                    <template v-slot:input="filters">
                        <i class="fa fa-calendar fa-fw text-white text-opacity-50 ms-n1"></i>
                        {{ formatDate(filters.startDate) }} - {{ formatDate(filters.endDate) }}
                        <b class="caret ms-1 opacity-5"></b>
                    </template>
                </date-range-picker>
            </div>
        </div>

        <div class="row mt-4">
            <Card :title="$t('str.dashboard.patrol.total').toUpperCase()" :value="patrolsChart?.totalPatrol || 0" subtitle="" background="#338fe2" icon="fa fa-person-military-pointing" />
            <Card :title="$t('str.dashboard.finish.patrol.percent').toUpperCase()" :value="patrolsChart?.totalFinishedPatrol || 0" subtitle="" background="#49b6d5" icon="fa fa-check-circle" />
            <Card :title="$t('str.dashboard.attendence.patrol').toUpperCase()" :value="patrolsChart?.attendencePatrol || 0" subtitle="" background="#f49c1b" icon="fa fa-headset" />
            <Card :title="$t('str.dashboard.average.patrol.time').toUpperCase()" :value="patrolsChart?.averagePatrol || '00:00:00'" subtitle="" background="#fe5b57" icon="fa fa-clock" />
        </div>

        <div class="row">
            <ChartTable :title="tableTitle" :total="eventsByType?.totalCount || 0" :items="eventsByType?.countByType || []" :headers="tableHeaders" />
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import Controller from './CrtDashboard.vue'
import Vue from 'vue'
import Card from './Components/Card.vue'
import ChartTable from './Components/ChartTable.vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        Card,
        ChartTable,
    },
    data() {
        return {
            isLoading: false,
            dateRange: {},
            filters: {
                account: '',
                client: '',
                site: '',
                startDate: moment().utc(true),
                endDate: moment().utc(true),
            },
            patrolsChart: {},
            eventsByType: {},
            isSuperAdminMaster: false,
            tableTitle: this.$t('str.dashboard.events.by.type'),
            tableHeaders: [this.$t('str.column.type'), this.$t('str.column.total')],
        }
    },
    methods: Controller.methods,
    mounted() {},
    created() {
        Controller.init(this)

        const state = this
        state.$registerEvent.$on('changeLanguage', function () {
            state.initRangeDate()
        })
    },
    computed: {},
}
</script>
<style lang="scss" scoped>
.vue-daterange-picker.btn {
    padding: 2px !important;
    display: flex !important;
    background-color: var(--app-component-bg) !important;
    text-align-last: start !important;
}
.caret {
    display: none !important;
}
</style>
