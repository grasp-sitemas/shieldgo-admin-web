<template>
    <div>
        <h1 class="page-header">{{ $t('str.sidebar.menu.reports.missed.call.description') }}</h1>
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

            <div class="row">
                <div class="col-md-12 mb-3 d-inline-flex">
                    <CsvDownload class="me-2" v-show="csvItems?.length > 0" :jsonFields="jsonFields" :jsonData="csvItems" :jsonMeta="jsonMeta" :filename="filename" :jsonTitle="jsonTitle" />
                    <XlsDownload class="me-2" v-show="csvItems?.length > 0" :jsonFields="jsonFields" :jsonData="csvItems" :jsonMeta="jsonMeta" :filename="filename" :jsonTitle="jsonTitle" />
                    <PdfDownload v-show="items?.length > 0" :pdfHeader="pdfHeader" :jsonData="reportItems" :filename="filename" :jsonTitle="pdfTitle" />
                </div>
            </div>
            <vue-good-table
                :columns="columns"
                :rows="items"
                :totalRows="items?.length"
                :search-options="{ enabled: false, placeholder: $t('str.table.search.in.this.table') }"
                :pagination-options="paginationOptions"
            >
                <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                    <i v-if="isLoading" class="fas fa-spinner fa-spin" />
                    <span v-if="!isLoading && items?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
                </div>
                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field === 'geolocation'" class="d-flex justify-content-center">
                        <span
                            v-if="
                                props.formattedRow[props.column.field]?.latitude &&
                                props.formattedRow[props.column.field]?.longitude &&
                                props.formattedRow[props.column.field]?.latitude?.length > 0 &&
                                props.formattedRow[props.column.field]?.longitude?.length > 0
                            "
                        >
                            <i v-on:click="showMap(props.formattedRow[props.column.field])" class="fas fa-map-marker-alt cursor_pointer" />
                        </span>
                        <span v-else>
                            <i class="fas fa-ban"></i>
                        </span>
                    </span>

                    <span v-else-if="props.column.field === 'event'">
                        {{ props.formattedRow[props.column.field].name }}
                    </span>

                    <span v-else-if="props.column.field === 'attendance'">
                        <span v-if="props.formattedRow[props.column.field].isAttendance">
                            <span v-if="props.formattedRow[props.column.field].status === 'IN_PROGRESS'">
                                <i class="fas fa-warning text-warning"></i>
                            </span>
                            <span v-else-if="props.formattedRow[props.column.field].status === 'CLOSED'">
                                <i class="fas fa-check-circle text-success"></i>
                            </span>
                            <span v-if="props.formattedRow[props.column.field].operator">
                                {{ props.formattedRow[props.column.field].operator }}
                            </span>
                            <p v-if="props.formattedRow[props.column.field].openedDate" class="m-0">
                                {{ $t('str.attendance.opened.at') + ': ' + formatDate(props.formattedRow[props.column.field].openedDate) }}
                            </p>
                            <p v-if="props.formattedRow[props.column.field].closedDate" class="m-0">
                                {{ $t('str.attendance.closed.at') + ': ' + formatDate(props.formattedRow[props.column.field].closedDate) }}
                            </p>
                        </span>
                        <span v-else>
                            <i class="fas fa-times-circle text-danger"></i>
                        </span>
                    </span>

                    <span v-else>
                        {{ props.formattedRow[props.column.field] }}
                    </span>
                </template>
            </vue-good-table>
        </div>
        <div v-else class="center-spinner">
            <i class="fas fa-spinner fa-spin" />
        </div>
        <Map :data="selectedItem" />
        <notifications group="top-right" position="top right" :speed="1000" />
    </div>
</template>

<script>
import moment from 'moment'
import Controller from './CrtMissedCall.vue'
import { DATE_RANGE_CONFIG } from '../../../../utils/date'
import CsvDownload from './Components/CsvDownload.vue'
import XlsDownload from './Components/XlsDownload.vue'
import PdfDownload from './Components/PdfDownload.vue'
import Map from '../../Components/Map.vue'
import Vue from 'vue'
import { JSON_FIELDS_CSV } from './Utils/jsonFieldsCsv'
import { PDF_HEADER } from './Utils/jsonFieldsPdf'

Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        CsvDownload,
        XlsDownload,
        PdfDownload,
        Map,
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
            csvItems: [],
            selectedItem: {},
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
                report: 'MISSED_EVENT',
            },
            isSuperAdminMaster: false,
            JSON_FIELDS_CSV: JSON_FIELDS_CSV,
            PDF_HEADER: PDF_HEADER,
            jsonFields: JSON_FIELDS_CSV.missedEvents.pt.json_fields,
            jsonData: [JSON_FIELDS_CSV.missedEvents.pt.json_data],
            jsonMeta: [JSON_FIELDS_CSV.missedEvents.pt.json_meta],
            filename: JSON_FIELDS_CSV.missedEvents.pt.filename,
            jsonTitle: JSON_FIELDS_CSV.missedEvents.pt.title,
            pdfTitle: JSON_FIELDS_CSV.missedEvents.pt.pdfTitle,
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
            state.jsonFields = JSON_FIELDS_CSV.missedEvents[state.$i18n.locale].json_fields
            state.jsonData = [JSON_FIELDS_CSV.missedEvents[state.$i18n.locale].json_data]
            state.jsonMeta = [JSON_FIELDS_CSV.missedEvents[state.$i18n.locale].json_meta]
            state.filename = JSON_FIELDS_CSV.missedEvents[state.$i18n.locale].filename
            state.jsonTitle = JSON_FIELDS_CSV.missedEvents[state.$i18n.locale].title
            state.pdfTitle = JSON_FIELDS_CSV.missedEvents.pt.pdfTitle
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
