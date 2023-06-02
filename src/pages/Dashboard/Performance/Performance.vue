<template>
    <div>
        <h1 class="page-header">{{ $t('str.msg.dashboard.performance.title') }}</h1>
        <hr />

        <div class="row mb-4">
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
                    :max-date="dateRange.maxDate"
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
            <div v-if="isSuperAdminMaster" class="col-md-3">
                <label class="form-label" for="accountField">{{ $t('str.register.incident.account.field') }}</label>
                <select v-model="filters.account" @change="changeAccount" class="form-select" id="accountField">
                    <option value="">{{ $t('str.register.select.placeholder') }}</option>
                    <option v-for="account in accounts" :value="account._id" :key="account._id">
                        {{ account.name }}
                    </option>
                </select>
            </div>
            <div class="col-md-3">
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
                <select v-model="filters.site" class="form-select" id="siteField">
                    <option value="">{{ $t('str.register.select.placeholder') }}</option>
                    <option v-for="site in sites" :value="site._id" :key="site._id">
                        {{ site.name }}
                    </option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
                <LocalsPerformance :title="$t('str.chart.locals.performance.title')" :data="localsPerformance" :locale="userLocale" />
            </div>
            <div class="col-md-6">
                <GuardsPerformance :title="$t('str.chart.guards.performance.title')" :data="guardsPerformance" :locale="userLocale" />
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import Controller from './CrtPerformance.vue'
import Vue from 'vue'
import GuardsPerformance from './Components/GuardsPerformance.vue'
import LocalsPerformance from './Components/LocalsPerformance.vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        GuardsPerformance,
        LocalsPerformance,
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
            accounts: [],
            clients: [],
            sites: [],
            isSuperAdminMaster: false,
            localsPerformance: [],
            guardsPerformance: [],
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
</style>
