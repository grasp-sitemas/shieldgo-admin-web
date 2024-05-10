<template>
    <div>
        <h1 class="page-header">{{ $t('str.form.title.timeline.free.patrols') }}</h1>
        <hr />
        <div class="row">
            <div v-if="isSuperAdminMaster" class="col-md-4 mb-3">
                <label class="form-label" for="accountField">{{ $t('str.register.guard.groups.account.field') }}</label>
                <select v-model="filters.account" @change="changeAccount" class="form-select" id="accountField">
                    <option value="">{{ $t('str.register.select.placeholder') }}</option>
                    <option v-for="account in accounts" :value="account._id" :key="account._id">
                        {{ account.name }}
                    </option>
                </select>
                <div class="invalid-feedback">{{ $t('str.register.guard.groups.account.required') }}</div>
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
                <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                <select v-model="filters.status" @change="filter" class="form-select" id="statusField">
                    <option value="">{{ $t('str.register.select.all.placeholder') }}</option>
                    <option value="IN_PROGRESS">{{ $t('str.status.in.progress') }}</option>
                    <option value="FINISHED">{{ $t('str.status.finished.patrol') }}</option>
                    <option value="CANCELLED">{{ $t('str.status.cancelled') }}</option>
                </select>
            </div>
        </div>
        <div>
            <vue-good-table
                :columns="columns"
                :rows="items"
                :totalRows="items?.length"
                :search-options="{ enabled: true, placeholder: $t('str.table.search.in.this.table') }"
                :pagination-options="paginationOptions"
                @on-row-click="selectItem"
            >
                <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                    <i v-if="isLoading" class="fas fa-spinner fa-spin" />
                    <span v-if="!isLoading && items?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
                </div>

                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field === 'vigilant'"> {{ props.formattedRow[props.column.field]?.firstName }} {{ props.formattedRow[props.column.field]?.lastName }} </span>

                    <span v-else-if="props.column.field === 'startDate' || props.column.field === 'endDate'">
                        {{ formatDate(props.formattedRow[props.column.field]) }}
                    </span>
                    <span v-else-if="props.column.field === 'status'">
                        <span
                            class="badge"
                            v-bind:class="
                                props.formattedRow[props.column.field] === 'ACTIVE'
                                    ? 'bg-blue'
                                    : props.formattedRow[props.column.field] === 'IN_PROGRESS'
                                    ? 'bg-success'
                                    : props.formattedRow[props.column.field] === 'FINISHED'
                                    ? 'bg-green'
                                    : props.formattedRow[props.column.field] === 'CANCELLED'
                                    ? 'bg-indigo'
                                    : 'bg-dark'
                            "
                        >
                            {{ $t(getStatusName(props.formattedRow[props.column.field])) }}
                        </span>
                    </span>

                    <span v-else>
                        {{ props.formattedRow[props.column.field] }}
                    </span>
                </template>
            </vue-good-table>
        </div>

        <InfoItemModal :selectedItem="selectedItem" :isSuperAdminMaster="isSuperAdminMaster" />
    </div>
</template>

<script>
import moment from 'moment'
import Controller from './CrtTimelineFreePatrol.vue'
import InfoItemModal from './InfoItemModal/InfoItemModal.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()
export default {
    components: {
        InfoItemModal,
    },
    props: ['filterParams'],
    data() {
        return {
            accounts: [],
            clients: [],
            sites: [],
            errors: [],
            items: [],
            paginationOptions: {},
            columns: [],
            isLoading: false,
            dateRange: {},
            role: '',
            filters: {
                account: '',
                client: '',
                site: '',
                status: '',
                startDate: moment().utc(true),
                endDate: moment().utc(true),
            },
            selectedItem: null,
            isSuperAdminMaster: false,
        }
    },
    mounted() {
        const routeParams = this.filterParams ? JSON.parse(this.filterParams) : null
        if (routeParams) {
            const filters = routeParams
            filters.isDescSortByStartDate = false
            filters.isSortByStartDate = true
            filters.startDate = moment(filters.startDate).utc(false)
            filters.endDate = moment(filters.endDate).utc(false)
            filters.account = filters.account ? filters.account : ''
            filters.client = filters.client ? filters.client : ''
            filters.site = filters.site ? filters.site : ''

            this.updateRangeDate(filters.startDate, filters.endDate)
            const startDate = moment(filters.startDate).utc(false).isBefore(moment(filters.endDate).utc(false)) ? moment(filters.startDate).utc(false).add(1, 'days') : moment(filters.startDate).utc(false)
            const endDate = moment(filters.endDate).utc(false)

            moment(filters.startDate).utc(false).add(1, 'days')
            this.dateRange.range = {
                startDate: startDate,
                endDate: endDate,
            }

            this.filters = filters
        }
    },
    methods: Controller.methods,
    created() {
        Controller.init(this)

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
