<template>
    <div>
        <h1 class="page-header">{{ $t('str.form.title.integration.logs.list') }}</h1>
        <hr />

        <div class="row">
            <div class="col-md-4 mb-3">
                <label class="form-label mt-2" for="statusField">{{ $t('str.register.status.field') }}</label>
                <select v-model="filters.substatus" @change="filter" class="form-select" id="statusField">
                    <option value="">{{ $t('str.register.select.placeholder') }}</option>
                    <option value="SUCCESS">{{ $t('str.register.status.success') }}</option>
                    <option value="ERROR">{{ $t('str.register.status.error') }}</option>
                </select>
            </div>
            <div class="col-md-4 mt-2 mb-3">
                <label class="form-label" for="dateRangePicker">{{ $t('str.range.date.field') }}</label>
                <date-range-picker
                    ref="picker"
                    id="dateRangePicker"
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
        </div>

        <div class="row">
            <div class="col-md-12">
                <vue-good-table
                    :columns="columns"
                    :rows="items"
                    :lineNumbers="false"
                    :totalRows="totalItems"
                    :search-options="{ enabled: true, placeholder: $t('str.table.search.in.this.table') }"
                    :pagination-options="paginationOptions"
                    :current-page="currentPage"
                    :total-pages="totalPages"
                    @on-page-change="onPageChange"
                >
                    <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                        <i v-if="isLoading" class="fas fa-spinner fa-spin" />
                        <span v-if="!isLoading && items?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
                    </div>
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field === 'domain' || props.column.field === 'operation'">
                            {{ $t(props.formattedRow[props.column.field]) }}
                        </span>
                        <span v-else-if="props.column.field === 'createDate'">
                            {{ moment(props.formattedRow[props.column.field]).utc(true).format('DD/MM/YYYY HH:mm:ss') }}
                        </span>
                        <span v-else-if="props.column.field === 'substatus'">
                            <span class="badge" v-bind:class="props.formattedRow[props.column.field] === 'SUCCESS' ? 'bg-success' : 'bg-danger'"> {{ $t(props.formattedRow[props.column.field]) }} </span>
                        </span>
                        <span v-else>
                            {{ props.formattedRow[props.column.field] }}
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import Controller from './CrtLog.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()
import moment from 'moment'
export default {
    components: {},
    data() {
        return {
            isLoading: false,
            valuekey: 0,
            errors: [],
            items: [],
            currentPage: 0, // Current page number
            totalPages: 1, // Total number of pages
            totalItems: 0, // Total number of items
            dateRange: {},
            filters: {
                status: 'ACTIVE',
                skip: 0,
                limit: 25,
                substatus: '',
                startDate: moment().utc(true),
                endDate: moment().utc(true),
            },
            isSuperAdminMaster: false,
            columns: [],
            paginationOptions: {
                perPage: 25,
            },
            moment: moment,
        }
    },
    created() {
        Controller.init(this)

        const state = this

        state.$registerEvent.$on('changeLanguage', function () {
            state.initTable()
            state.initRangeDate()
        })
    },
    methods: Controller.methods,
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
