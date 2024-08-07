<template>
    <div>
        <h1 class="page-header">{{ $t('str.sidebar.menu.reports.supervision.patrol') }}</h1>
        <hr />

        <div v-if="!isLoading">
            <div class="row">
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
                <div v-if="isSuperAdminMaster" class="col-md-4 mb-3">
                    <label class="form-label" for="accountField">{{ $t('str.register.user.account.field') }}</label>
                    <select v-model="filters.account" @change="changeAccount" class="form-select" id="accountField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="account in accounts" :value="account._id" :key="account._id">
                            {{ account.name }}
                        </option>
                    </select>
                </div>
                <div v-if="role === 'SUPER_ADMIN_MASTER' || role === 'ADMIN' || role === 'MANAGER'" class="col-md-4 mb-3">
                    <label class="form-label" for="clientField">{{ $t('str.supervision.area') }}</label>
                    <select v-model="filters.client" @change="changeClient" class="form-select" id="clientField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="client in clients" :value="client._id" :key="client._id">
                            {{ client.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.guard.groups.client.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="vigilantField">{{ $t('str.supervisor') }}</label>
                    <select v-model="filters.vigilant" class="form-select" id="vigilantField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="vigilant in vigilants" :value="vigilant._id" :key="vigilant._id">
                            {{ vigilant.fullName }}
                        </option>
                    </select>
                </div>

                <div :class="!isSuperAdminMaster ? 'col-md-12 mt-2 text-center' : 'col-md-6 mt-3 text-center'">
                    <button @click="filter" type="submit" class="btn btn-primary w-200px me-10px is-loading mb-1">
                        <i v-if="isSearchLoading" class="fas fa-spinner fa-pulse"></i>
                        {{ $t('str.generate.report') }}
                    </button>
                    <button @click="clearFilters" type="submit" class="btn btn-default w-200px me-10px mb-1">
                        {{ $t('str.clear.fields') }}
                    </button>
                </div>
            </div>

            <div class="row">
                <div class="col-md-12 mb-3 d-inline-flex">
                    <CsvDownload
                        class="me-2"
                        v-show="items?.length > 0"
                        :jsonFields="jsonFields"
                        :jsonData="items"
                        :jsonMeta="jsonMeta"
                        :filename="filename"
                        :jsonTitle="jsonTitle"
                        :period-end="moment(filters.endDate).format('DD/MM/YYYY')"
                        :period-start="moment(filters.startDate).format('DD/MM/YYYY')"
                        :supervisor="jsonInfo?.vigilant"
                        :totalVisits="totalVisits"
                        :jsonInfo="jsonInfo"
                    />
                    <XlsDownload
                        class="me-2"
                        v-show="items?.length > 0"
                        :jsonFields="jsonFields"
                        :jsonData="items"
                        :jsonMeta="jsonMeta"
                        :period-end="moment(filters.endDate).format('DD/MM/YYYY')"
                        :period-start="moment(filters.startDate).format('DD/MM/YYYY')"
                        :filename="filename"
                        :jsonTitle="jsonTitle"
                        :supervisor="jsonInfo?.vigilant"
                        :totalVisits="totalVisits"
                        :jsonInfo="jsonInfo"
                    />
                    <PdfDownload
                        v-show="items?.length > 0"
                        :pdfHeader="pdfHeader"
                        :period-end="moment(filters.endDate).format('DD/MM/YYYY')"
                        :period-start="moment(filters.startDate).format('DD/MM/YYYY')"
                        :jsonData="items"
                        :supervisor="jsonInfo?.vigilant"
                        :totalVisits="totalVisits"
                        :filename="filename"
                        :jsonInfo="jsonInfo"
                        :jsonTitle="jsonTitle"
                        :logoURL="logoURL"
                    />
                </div>
            </div>

            <vue-good-table
                :columns="columns"
                :rows="items"
                :totalRows="items?.length"
                :search-options="{ enabled: false, placeholder: $t('str.table.search.in.this.table') }"
                :pagination-options="paginationOptions"
                @on-row-click="selectItem"
                @on-sort-change="onSortChange"
                :sort-options="{
                    enabled: true,
                    initialSortBy: { field: 'read', type: 'desc' },
                }"
            >
                <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                    <i v-if="isLoading" class="fas fa-spinner fa-spin" />
                    <span v-if="!isLoading && items?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
                </div>
                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field === 'read'">
                        <span v-if="props.formattedRow[props.column.field] === true"> <i class="fas fa-check-circle text-success" /> {{ $t('str.visited') }} </span>
                        <span v-else> <i class="fas fa-times-circle text-danger" /> {{ $t('str.not.visited') }} </span>
                    </span>
                    <span v-else> {{ props.formattedRow[props.column.field] }} </span>
                </template>
            </vue-good-table>
        </div>
        <div v-else class="center-spinner">
            <i class="fas fa-spinner fa-spin" />
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import Controller from './CrtSupervision.vue'
import { DATE_RANGE_CONFIG } from '../../../../utils/date'
import CsvDownload from './Components/CsvDownload.vue'
import XlsDownload from './Components/XlsDownload.vue'
import PdfDownload from './Components/PdfDownload.vue'
import Vue from 'vue'
import { JSON_FIELDS_CSV } from './Utils/jsonFieldsCsv'
import { PDF_HEADER } from './Utils/jsonFieldsPdf'
import Services from '../../../../common/Services.vue'
import Endpoints from '../../../../common/Endpoints.vue'

Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        CsvDownload,
        XlsDownload,
        PdfDownload,
    },
    props: ['filterParams'],
    data() {
        return {
            accounts: [],
            clients: [],
            sites: [],
            vigilants: [],
            domain: Endpoints.domain,
            logoURL: '',
            errors: [],
            items: [],
            paginationOptions: {},
            totalVisits: 0,
            fields: [],
            isLoading: true,
            isSearchLoading: false,
            dateRange: DATE_RANGE_CONFIG,
            role: '',
            moment: moment,
            filters: {
                account: '',
                client: '',
                site: '',
                vigilant: '',
                startDate: moment().utc(true),
                endDate: moment().utc(true),
                report: 'SUPERVISION_PATROL',
            },
            selectedItem: null,
            isSuperAdminMaster: false,
            JSON_FIELDS_CSV: JSON_FIELDS_CSV,
            PDF_HEADER: PDF_HEADER,
            jsonFields: JSON_FIELDS_CSV.supervisionPatrol.pt.json_fields,
            jsonData: [JSON_FIELDS_CSV.supervisionPatrol.pt.json_data],
            jsonMeta: [JSON_FIELDS_CSV.supervisionPatrol.pt.json_meta],
            jsonInfo: {},
            filename: JSON_FIELDS_CSV.supervisionPatrol.pt.filename,
            jsonTitle: JSON_FIELDS_CSV.supervisionPatrol.pt.title,
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
                    report: 'SUPERVISION_PATROL',
                }
            }, 300)
        }
    },
    async created() {
        await Controller.init(this)

        const state = this
        state.$registerEvent.$on('changeLanguage', function () {
            state.initTable()
            state.initRangeDate()
            state.jsonFields = JSON_FIELDS_CSV.supervisionPatrol[state.$i18n.locale].json_fields
            state.jsonData = [JSON_FIELDS_CSV.supervisionPatrol[state.$i18n.locale].json_data]
            state.jsonMeta = [JSON_FIELDS_CSV.supervisionPatrol[state.$i18n.locale].json_meta]
            state.filename = JSON_FIELDS_CSV.supervisionPatrol[state.$i18n.locale].filename
            state.jsonTitle = JSON_FIELDS_CSV.supervisionPatrol[state.$i18n.locale].title
            state.pdfHeader = PDF_HEADER[state.$i18n.locale]
        })
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
