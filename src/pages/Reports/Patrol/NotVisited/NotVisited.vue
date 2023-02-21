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

                <div class="col-md-4 mt-3">
                    <button @click="filter" type="submit" class="btn btn-primary w-200px me-10px is-loading">
                        <i v-if="isSearchLoading" class="fas fa-spinner fa-pulse"></i>
                        {{ $t('str.generate.report') }}
                    </button>
                    <button @click="clearFilters" type="submit" class="btn btn-default w-200px me-10px">
                        {{ $t('str.clear.fields') }}
                    </button>
                </div>

                <!-- <div class="col-md-4 mb-3">
                <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                <select v-model="filters.status" @change="filter" class="form-select" id="statusField">
                    <option value="IN_PROGRESS">{{ $t('str.status.in.progress') }}</option>
                    <option value="ACTIVE">{{ $t('str.status.pending') }}</option>
                    <option value="FINISHED">{{ $t('str.status.done') }}</option>
                    <option value="EXPIRED">{{ $t('str.status.expired') }}</option>
                </select>
            </div> -->
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
                    <span v-if="props.column.field === 'vigilant'"> {{ props.formattedRow[props.column.field]?.firstName }} {{ props.formattedRow[props.column.field]?.lastName }} </span>
                    <span v-else-if="props.column.field === 'account' || props.column.field === 'client' || props.column.field === 'site'">
                        {{ props.formattedRow[props.column.field]?.name }}
                    </span>
                    <span v-else-if="props.column.field === 'startDate' || props.column.field === 'endDate'">
                        {{ formatDate(props.formattedRow[props.column.field]) }}
                    </span>
                    <!-- <span v-else-if="props.column.field === 'status'">
                        <span
                            class="badge"
                            v-bind:class="
                                props.formattedRow[props.column.field] === 'ACTIVE'
                                    ? 'bg-blue'
                                    : props.formattedRow[props.column.field] === 'IN_PROGRESS'
                                    ? 'bg-success'
                                    : props.formattedRow[props.column.field] === 'FINISHED'
                                    ? 'bg-info'
                                    : props.formattedRow[props.column.field] === 'EXPIRED'
                                    ? 'bg-danger'
                                    : 'bg-danger'
                            "
                        >
                            {{ $t(getStatusName(props.formattedRow[props.column.field])) }}
                        </span>
                    </span> -->

                    <span v-else>
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
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()
export default {
    components: {},
    data() {
        return {
            accounts: [],
            clients: [],
            sites: [],
            vigilants: [],
            errors: [],
            items: [],
            paginationOptions: {},
            columns: [],
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
                isDescSortByStartDate: false,
                isSortByStartDate: true,
            },
            selectedItem: null,
            isSuperAdminMaster: false,
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
