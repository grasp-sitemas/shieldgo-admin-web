<template>
    <div>
        <h1 class="page-header">{{ $t('str.msg.dashboard.analysis.title') }}</h1>
        <hr />
        <div class="row">
            <div class="col-md-3">
                <label class="form-label" for="accountField">{{ $t('str.register.period') }}</label>
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
                    :max-date="dateRange.maxDate"
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
            <div v-if="isSuperAdminMaster" class="col-md-3">
                <label class="form-label" for="accountField">{{ $t('str.register.incident.account.field') }}</label>
                <select v-model="filters.account" @change="changeAccount" class="form-select" id="accountField">
                    <option value="">{{ $t('str.register.select.placeholder') }}</option>
                    <option v-for="account in accounts" :value="account._id" :key="account._id">
                        {{ account.name }}
                    </option>
                </select>
            </div>
            <div v-if="role === 'SUPER_ADMIN_MASTER' || role === 'ADMIN' || role === 'MANAGER'" class="col-md-3">
                <label class="form-label" for="clientField">{{ $t('str.register.incident.client.field') }}</label>
                <select v-model="filters.client" @change="changeClient" class="form-select" id="clientField">
                    <option value="">{{ $t('str.register.select.placeholder') }}</option>
                    <option v-for="client in clients" :value="client._id" :key="client._id">
                        {{ client.name }}
                    </option>
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label" for="siteField">{{ $t('str.register.incident.site.field') }}</label>
                <select v-model="filters.site" @change="changeSite" class="form-select" id="siteField">
                    <option value="">{{ $t('str.register.select.placeholder') }}</option>
                    <option v-for="site in sites" :value="site._id" :key="site._id">
                        {{ site.name }}
                    </option>
                </select>
            </div>
        </div>

        <div class="row mt-4">
            <Card
                :title="$t('str.dashboard.patrol.total').toUpperCase()"
                :value="patrolsChart?.total || 0"
                :subtitle="$t('str.dashboard.view.details')"
                background="#338fe2"
                :redirect="{
                    name: '/timeline/schedule-patrols/',
                    params: {
                        startDate: filters.startDate,
                        endDate: filters.endDate,
                        account: filters.account,
                        client: filters.client,
                        site: filters.site,
                        status: '',
                    },
                }"
                icon="fa fa-person-military-pointing"
            />
            <Card
                :title="$t('str.dashboard.finish.patrol.percent').toUpperCase()"
                :value="patrolsChart?.totalFinished || 0"
                :subtitle="$t('str.dashboard.view.details')"
                background="#49b6d5"
                :redirect="{
                    name: '/timeline/schedule-patrols/',
                    params: {
                        startDate: filters.startDate,
                        endDate: filters.endDate,
                        account: filters.account,
                        client: filters.client,
                        site: filters.site,
                        status: 'FINISHED',
                    },
                }"
                icon="fa fa-check-circle"
            />
            <Card :title="$t('str.dashboard.average.patrol.time').toUpperCase()" :value="patrolsChart?.averagePatrol || '00:00:00'" subtitle="" background="#fe5b57" icon="fa fa-clock" />
            <Card :title="$t('str.dashboard.attendence.patrol').toUpperCase()" :value="patrolsChart?.attendencePatrol || 0" subtitle="" background="#f49c1b" icon="fa fa-headset" />
        </div>

        <div class="row">
            <div class="col-md-8">
                <EventsPerformanceSubstatus
                    :data="eventsPerformanceSubstatus"
                    :locale="userLocale"
                    :redirect="{
                        params: {
                            startDate: filters.startDate,
                            endDate: filters.endDate,
                            account: filters.account,
                            client: filters.client,
                            site: filters.site,
                        },
                    }"
                />
            </div>

            <div class="col-md-4">
                <AverageTimeAttendanceEvent :data="avaregeAttendanceEvent" :title="$t('str.chart.average.time.attendance.events.title')" />
                <AttendanceEvents :data="eventsAttendance" :title="$t('str.chart.attendance.events.title')" />
            </div>
        </div>

        <div class="row">
            <div class="col-md-8">
                <EventsPerformance
                    :data="eventsPerformance"
                    :locale="userLocale"
                    :redirect="{
                        params: {
                            startDate: filters.startDate,
                            endDate: filters.endDate,
                            account: filters.account,
                            client: filters.client,
                            site: filters.site,
                        },
                    }"
                />
            </div>
            <div class="col-md-4">
                <ChartTable :title="tableTitle" :total="eventsByType?.totalCount || 0" :items="eventsByType?.countByType || []" :headers="tableHeaders" />
            </div>
        </div>

        <div v-if="isLoading" class="spinner-overlay">
            <b-spinner label="Carregando..." style="width: 2rem; height: 2rem" type="border" variant="primary" />
        </div>

        <notifications group="top-right" position="top right" :speed="1000" />
    </div>
</template>

<script>
import moment from 'moment'
import Controller from './CrtAnalysis.vue'
import Vue from 'vue'
import Card from './Components/Card.vue'
import ChartTable from './Components/ChartTable.vue'
import EventsPerformance from './Components/PerformanceEvent.vue'
import AverageTimeAttendanceEvent from './Components/AverageTimeAttendanceEvent.vue'
import AttendanceEvents from './Components/AttendanceEvents.vue'
import EventsPerformanceSubstatus from './Components/PerformanceEventSubstatus.vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        Card,
        ChartTable,
        EventsPerformance,
        EventsPerformanceSubstatus,
        AverageTimeAttendanceEvent,
        AttendanceEvents,
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
            userLocale: 'pt-br',
            maxDate: moment().utc(true).format(),
            accounts: [],
            clients: [],
            sites: [],
            role: '',
            patrolsChart: {},
            eventsByType: {},
            eventsPerformance: {},
            avaregeAttendanceEvent: {},
            eventsPerformanceSubstatus: {},
            eventsAttendance: {},
            isSuperAdminMaster: false,
            tableTitle: this.$t('str.dashboard.events.by.type'),
            tableHeaders: [this.$t('str.column.type'), this.$t('str.column.total')],
        }
    },
    methods: Controller.methods,
    created() {
        Controller.init(this)

        const state = this
        state.$registerEvent.$on('changeLanguage', function () {
            state.initRangeDate()
            state.userLocale = state.$i18n.locale === 'pt' ? 'pt-br' : 'en'
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

.row {
    display: flex;
    flex-wrap: wrap;
}
.col-md-8,
.col-md-4 {
    display: flex;
    flex-direction: column;
}
.spinner-overlay {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
