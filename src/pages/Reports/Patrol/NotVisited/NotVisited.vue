<template>
    <div>
        <h1 class="page-header">{{ $t('str.sidebar.menu.reports.patrols.not-visited.description') }}</h1>
        <hr />

        <div v-if="!isLoading">
            <div class="row">
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

                <div class="col-md-4 mt-3 mb-2 text-center">
                    <button @click="filter" type="submit" class="btn btn-primary w-200px me-10px is-loading mb-1">
                        <i v-if="isSearchLoading" class="fas fa-spinner fa-pulse"></i>
                        {{ $t('str.generate.report') }}
                    </button>
                    <button @click="clearFilters" type="submit" class="btn btn-default w-200px me-10px mb-1">
                        {{ $t('str.clear.fields') }}
                    </button>
                </div>
            </div>

            <!-- aling buttons in same line -->
            <div class="row">
                <div class="col-md-12 mb-3">
                    <CsvDownload class="me-2" v-show="items?.length > 0" :jsonFields="jsonFields" :jsonData="items" :jsonMeta="jsonMeta" :filename="filename" :jsonTitle="jsonTitle" />
                    <XlsDownload class="me-2" v-show="items?.length > 0" :jsonFields="jsonFields" :jsonData="items" :jsonMeta="jsonMeta" :filename="filename" :jsonTitle="jsonTitle" />
                    <PdfDownload v-show="items?.length > 0" :pdfHeader="pdfHeader" :jsonData="items" :filename="filename" :jsonTitle="jsonTitle" />
                </div>
            </div>

            <vue-good-table
                :columns="columns"
                :rows="items"
                :totalRows="items?.length"
                :search-options="{ enabled: false, placeholder: $t('str.table.search.in.this.table') }"
                :pagination-options="paginationOptions"
                @on-row-click="selectItem"
            >
                <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                    <i v-if="isLoading" class="fas fa-spinner fa-spin" />
                    <span v-if="!isLoading && items?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
                </div>
                <template slot="table-row" slot-scope="props">
                    <span>
                        {{ props.formattedRow[props.column.field] }}
                    </span>
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
import Controller from './CrtNotVisited.vue'
import { DATE_RANGE_CONFIG } from '../../../../utils/date'
import CsvDownload from '../../Components/CsvDownload.vue'
import XlsDownload from '../../Components/XlsDownload.vue'
import PdfDownload from '../../Components/PdfDownload.vue'
import Vue from 'vue'
import { JSON_FIELDS_CSV } from './Utils/jsonFieldsCsv'
import { PDF_HEADER } from './Utils/jsonFieldsPdf'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        CsvDownload,
        XlsDownload,
        PdfDownload,
    },
    data() {
        return {
            accounts: [],
            clients: [],
            sites: [],
            vigilants: [],
            errors: [],
            items: [],
            paginationOptions: {},
            fields: [],
            isLoading: true,
            isSearchLoading: false,
            dateRange: DATE_RANGE_CONFIG,
            role: '',
            filters: {
                account: '',
                client: '',
                site: '',
                vigilant: '',
                startDate: moment().utc(true),
                endDate: moment().utc(true),
                report: 'PATROL_POINTS_NOT_VISITED',
            },
            selectedItem: null,
            isSuperAdminMaster: false,
            JSON_FIELDS_CSV: JSON_FIELDS_CSV,
            PDF_HEADER: PDF_HEADER,
            jsonFields: JSON_FIELDS_CSV.notCompletedPatrolPoints.pt.json_fields,
            jsonData: [JSON_FIELDS_CSV.notCompletedPatrolPoints.pt.json_data],
            jsonMeta: [JSON_FIELDS_CSV.notCompletedPatrolPoints.pt.json_meta],
            filename: JSON_FIELDS_CSV.notCompletedPatrolPoints.pt.filename,
            jsonTitle: JSON_FIELDS_CSV.notCompletedPatrolPoints.pt.title,
            pdfHeader: PDF_HEADER.pt,
        }
    },
    methods: Controller.methods,
    async mounted() {
        await Controller.init(this)
    },
    async created() {
        const state = this
        state.$registerEvent.$on('changeLanguage', function () {
            state.initTable()
            state.initRangeDate()
            state.jsonFields = JSON_FIELDS_CSV.notCompletedPatrolPoints[state.$i18n.locale].json_fields
            state.jsonData = [JSON_FIELDS_CSV.notCompletedPatrolPoints[state.$i18n.locale].json_data]
            state.jsonMeta = [JSON_FIELDS_CSV.notCompletedPatrolPoints[state.$i18n.locale].json_meta]
            state.filename = JSON_FIELDS_CSV.notCompletedPatrolPoints[state.$i18n.locale].filename
            state.jsonTitle = JSON_FIELDS_CSV.notCompletedPatrolPoints[state.$i18n.locale].title
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
