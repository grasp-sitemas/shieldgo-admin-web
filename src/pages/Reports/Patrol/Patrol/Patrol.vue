<template>
    <div>
        <h1 class="page-header">{{ $t('str.sidebar.menu.reports.patrols.description') }}</h1>
        <hr />
        <div>
            <div class="row">
                <div v-if="isSuperAdminMaster" class="col-md-4 mb-3">
                    <label class="form-label" for="accountField">{{ $t('str.register.user.account.field') }}</label>
                    <select
                        v-model="filters.account"
                        @change="changeAccount"
                        class="form-select"
                        v-bind:class="checkRequiredField('account') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('account')"
                        id="accountField"
                    >
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="account in accounts" :value="account._id" :key="account._id">
                            {{ account.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.site.account.required') }}</div>
                </div>

                <div v-if="role === 'SUPER_ADMIN_MASTER' || role === 'ADMIN' || role === 'MANAGER'" class="col-md-4 mb-3">
                    <label class="form-label" for="clientField">{{ $t('str.register.guard.groups.client.field') }}</label>
                    <select v-model="filters.client" @change="changeClient" class="form-select" id="clientField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="client in clients" :value="client._id" :key="client._id">
                            {{ client.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.guard.groups.client.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="siteField">{{ $t('str.register.guard.groups.site.field') }}</label>
                    <select v-model="filters.site" @change="changeSite" class="form-select" id="siteField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="site in sites" :value="site._id" :key="site._id">
                            {{ site.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.guard.groups.site.required') }}</div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="vigilantField">{{ $t('str.reports.vigilant.field') }}</label>
                    <select v-model="filters.vigilant" class="form-select" id="vigilantField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="vigilant in vigilants" :value="vigilant._id" :key="vigilant._id">
                            {{ vigilant.fullName }}
                        </option>
                    </select>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="statusField">{{ $t('str.range.date.field') }}</label>
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
                            {{ new Date(filters.startDate).toLocaleDateString('pt-br') }} - {{ new Date(filters.endDate).toLocaleDateString('pt-br') }}
                            <b class="caret ms-1 opacity-5"></b>
                        </template>
                    </date-range-picker>
                </div>

                <div class="col-md-4 mb-3">
                    <label class="form-label" for="reportTypeField">{{ $t('str.reports.type.field') }}</label>
                    <select
                        v-model="filters.report"
                        @change="changeReportType"
                        class="form-select"
                        v-bind:class="checkRequiredField('report') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('report')"
                        id="reportTypeField"
                    >
                        <option value="">{{ $t('str.select') }}</option>
                        <option v-for="reportType in reports" :value="reportType._id" :key="reportType._id">
                            {{ $t(reportType.name) }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.select.report.required') }}</div>
                </div>
            </div>

            <div class="row" v-if="filters.report?.length > 0">
                <div class="col-md-12 mt-3 mb-2 text-center">
                    <button @click="checkFilters" type="submit" class="btn btn-primary w-200px me-10px is-loading mb-1">
                        <i v-if="isSearchLoading" class="fas fa-spinner fa-pulse"></i>
                        {{ $t('str.generate.report') }}
                    </button>
                    <button @click="clearFilters" type="submit" class="btn btn-default w-200px me-10px mb-1">
                        {{ $t('str.clear.fields') }}
                    </button>
                </div>
            </div>

            <div class="row">
                <Completed
                    v-if="filters.report === patrolReportTypes.PATROL_POINTS_COMPLETED"
                    @clearFilters="clearFilters"
                    :filterParams="filters"
                    :isSuperAdminMaster="isSuperAdminMaster"
                    :role="role"
                    :items="items"
                    :reportItems="reportItems"
                />
                <Incompleted
                    v-else-if="filters.report === patrolReportTypes.PATROL_POINTS_INCOMPLETED"
                    @clearFilters="clearFilters"
                    :filterParams="filters"
                    :isSuperAdminMaster="isSuperAdminMaster"
                    :role="role"
                    :items="items"
                    :reportItems="reportItems"
                />
                <NotVisited
                    v-else-if="filters.report === patrolReportTypes.PATROL_POINTS_NOT_VISITED"
                    @clearFilters="clearFilters"
                    :filterParams="filters"
                    :isSuperAdminMaster="isSuperAdminMaster"
                    :role="role"
                    :items="items"
                    :reportItems="reportItems"
                />
                <AllPatrol
                    v-else-if="filters.report === patrolReportTypes.ALL_PATROLS"
                    @clearFilters="clearFilters"
                    :filterParams="filters"
                    :isSuperAdminMaster="isSuperAdminMaster"
                    :role="role"
                    :items="items"
                    :reportItems="reportItems"
                />
                <AlonePatrol
                    v-else-if="filters.report === patrolReportTypes.ALONE_PATROLS"
                    @clearFilters="clearFilters"
                    :filterParams="filters"
                    :isSuperAdminMaster="isSuperAdminMaster"
                    :role="role"
                    :items="items"
                    :reportItems="reportItems"
                />
            </div>
        </div>
        <notifications group="top-right" position="top right" :speed="1000" />
    </div>
</template>

<script>
import moment from 'moment'
import Controller from './CrtPatrol.vue'
import { DATE_RANGE_CONFIG } from '../../../../utils/date'
import Vue from 'vue'
import { JSON_FIELDS_CSV } from './Utils/jsonFieldsCsv'
import { PDF_HEADER } from './Utils/jsonFieldsPdf'
import { REPORT_PATROL_TYPES } from '../../../../utils/constants'
import Services from '../../../../common/Services'
import { REPORT_PATROL_TYPE_LIST } from '../../../../utils/constants'
Vue.prototype.$registerEvent = new Vue()

export default {
    props: ['filterParams'],
    components: {
        Completed: () => import('../Completed/Completed.vue'),
        Incompleted: () => import('../Incompleted/Incompleted.vue'),
        NotVisited: () => import('../NotVisited/NotVisited.vue'),
        AllPatrol: () => import('../AllPatrol/AllPatrol.vue'),
        AlonePatrol: () => import('../AlonePatrol/AlonePatrol.vue'),
    },
    data() {
        return {
            accounts: [],
            clients: [],
            sites: [],
            vigilants: [],
            errors: [],
            items: [],
            reportItems: [],
            paginationOptions: {},
            fields: [],
            isSearchLoading: false,
            dateRange: DATE_RANGE_CONFIG,
            role: '',
            reports: REPORT_PATROL_TYPES,
            patrolReportTypes: REPORT_PATROL_TYPE_LIST,
            filters: {
                account: '',
                client: '',
                site: '',
                vigilant: '',
                startDate: moment().utc(true).format('YYYY-MM-DD'),
                endDate: moment().utc(true).format('YYYY-MM-DD'),
                report: 'ALL_PATROLS',
            },
            isSuperAdminMaster: false,
            JSON_FIELDS_CSV: JSON_FIELDS_CSV,
            PDF_HEADER: PDF_HEADER,
            jsonFields: JSON_FIELDS_CSV.completedPatrolPoints.pt.json_fields,
            jsonData: [JSON_FIELDS_CSV.completedPatrolPoints.pt.json_data],
            jsonMeta: [JSON_FIELDS_CSV.completedPatrolPoints.pt.json_meta],
            filename: JSON_FIELDS_CSV.completedPatrolPoints.pt.filename,
            jsonTitle: JSON_FIELDS_CSV.completedPatrolPoints.pt.title,
            pdfHeader: PDF_HEADER.pt,
        }
    },
    methods: Controller.methods,
    async mounted() {
        const routeParams = this.filterParams ? JSON.parse(this.filterParams) : null
        if (routeParams) {
            const filters = routeParams

            setTimeout(async () => {
                filters.startDate = moment(filters.startDate).utc(false)
                filters.endDate = moment(filters.endDate).utc(false)
                filters.account = filters.account ? filters.account : ''
                filters.client = filters.client ? filters.client : ''
                filters.site = filters.site ? filters.site : ''
                filters.report = filters.report ? filters.report : ''

                if (filters.account && filters.account.length > 0) {
                    this.clients = await Services.getClientsByAccount(this, filters.account)
                }

                if (filters.client && filters.client.length > 0) {
                    this.sites = await Services.getSitesByClient(this, filters.client)
                }

                this.updateRangeDate(filters.startDate, filters.endDate)
                const startDate = moment(filters.startDate).utc(false).isBefore(moment(filters.endDate).utc(false)) ? moment(filters.startDate).utc(false).add(1, 'days') : moment(filters.startDate).utc(false)
                const endDate = moment(filters.endDate).utc(false)

                moment(filters.startDate).utc(false).add(1, 'days')

                this.dateRange.range = {
                    startDate: startDate,
                    endDate: endDate,
                }

                this.filters = {
                    ...filters,
                    vigilant: '',
                }
            }, 300)
        }
    },
    async created() {
        await Controller.init(this)
    },
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
