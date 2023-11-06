<template>
    <div>
        <h1 class="page-header">{{ $t('str.sidebar.menu.integration.reports.analysis.patrols') }}</h1>
        <hr />

        <div v-if="!isLoading">
            <div class="row">
                <div v-if="isSuperAdminMaster" class="col-md-4 mb-3">
                    <label class="form-label" for="accountField">{{ $t('str.register.user.account.field') }}</label>
                    <select v-model="selectedCompany._id" @change="changeCompany" class="form-select" id="accountField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="company in companies" :value="company?._id" :key="company?._id">
                            {{ company.deptName }}
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
                <div class="col-md-4 mt-4">
                    <button @click="filter" type="submit" class="btn btn-primary me-10px is-loading mb-1">
                        <i v-if="isSearchLoading" class="fas fa-spinner fa-pulse" />
                        {{ $t('str.generate.report') }}
                    </button>
                    <button @click="clearFilters" type="submit" class="btn btn-default me-10px mb-1">
                        {{ $t('str.clear.fields') }}
                    </button>
                </div>
            </div>

            <div v-if="(items || dailyItems) && !isSearchLoading">
                <PdfDownload :items="items" :dailyItems="dailyItems" />
            </div>
            <div v-else-if="isLoading || isSearchLoading" class="center-spinner">
                <i class="fas fa-spinner fa-spin" />
            </div>
        </div>
        <div v-else class="center-spinner">
            <i class="fas fa-spinner fa-spin" />
        </div>
        <notifications group="top-right" position="top right" :speed="1000" />
    </div>
</template>

<script>
import moment from 'moment'
import Controller from './CrtPerformancePatrol.vue'
import { DATE_RANGE_CONFIG } from '../../../../utils/date'
import PdfDownload from './Components/PdfDownload.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        PdfDownload,
    },
    data() {
        return {
            companies: [],
            errors: [],
            items: null,
            dailyItems: null,
            reportItems: [],
            csvItems: [],
            paginationOptions: {},
            fields: [],
            selectedItem: {},
            isLoading: true,
            isSearchLoading: false,
            dateRange: DATE_RANGE_CONFIG,
            role: '',
            selectedCompany: {
                _id: '',
            },
            filters: {
                report: 'EXTERNAL_PERFORMANCE_PATROLS',
                startDate: moment().utc(true),
                endDate: moment().utc(true),
                sqlLegacyBase: '',
                companyLegacyId: '',
                searchAllPatrolPerform: true,
            },
            isSuperAdminMaster: false,
        }
    },
    methods: Controller.methods,
    mounted() {
        Controller.init(this)
    },
    async created() {
        const state = this
        state.$registerEvent.$on('changeLanguage', function () {
            state.initTable()
            state.initRangeDate()
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
