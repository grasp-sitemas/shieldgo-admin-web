<template>
    <div>
        <ol class="breadcrumb float-xl-end">
            <li class="breadcrumb-item">{{ $t('str.breadcrumb.timeline') }}</li>
        </ol>
        <h1 class="page-header">{{ $t('str.form.title.timeline') }}</h1>
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
            <div class="col-md-4 mb-3">
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
                    @update="updateValues"
                    :linkedCalendars="dateRange.linkedCalendars"
                    :date-range="dateRange"
                >
                    <template v-slot:input="filters">
                        <i class="fa fa-calendar fa-fw text-white text-opacity-50 ms-n1"></i>
                        {{ new Date(filters.startDate).toLocaleDateString('pt-br') }} - {{ new Date(filters.endDate).toLocaleDateString('pt-br') }}
                        <b class="caret ms-1 opacity-5"></b>
                    </template>
                </date-range-picker>
            </div>

            <!-- <div class="col-md-4 mb-3">
                <label class="form-label" for="startDateField">{{ $t('str.register.timeline.starts.in.field') }}</label>
                <input v-model="filters.startDate" type="date" class="form-control" id="startDateField" :placeholder="$t('str.register.timeline.starts.in.placeholder')" />
            </div>

            <div class="col-md-4 mb-3">
                <label class="form-label" for="endDateField">{{ $t('str.register.timeline.ends.in.field') }}</label>
                <input v-model="filters.endDate" type="date" class="form-control" id="endDateField" :placeholder="$t('str.register.timeline.ends.in.placeholder')" />
            </div> -->
            <div class="col-md-4 mb-3">
                <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                <select v-model="filters.status" @change="filter" class="form-select" id="statusField">
                    <option value="ACTIVE">{{ $t('str.select') }}</option>
                    <option value="DONE">{{ $t('str.status.done') }}</option>
                    <option value="PENDING">{{ $t('str.status.pending') }}</option>
                    <option value="EXPIRED">{{ $t('str.status.expired') }}</option>
                </select>
            </div>
        </div>
        <div>
            <vue-good-table
                :columns="columns"
                :rows="items"
                :lineNumbers="true"
                :totalRows="items?.length"
                :search-options="{ enabled: true, placeholder: $t('str.table.search.in.this.table') }"
                :pagination-options="paginationOptions"
            >
                <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                    <div v-if="isLoading" class="text-center"><orbit-spinner :animation-duration="1000" :size="30" class="primary-color text-center" /></div>
                    <span v-if="!isLoading">{{ $t('str.table.subtitle.no.data') }}</span>
                </div>

                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field === 'vigilant'"> {{ props.formattedRow[props.column.field]?.firstName }} {{ props.formattedRow[props.column.field]?.lastName }} </span>
                    <span v-else-if="props.column.field === 'patrolPoints'">
                        <p class="m-0" v-for="patrolPoint in props.formattedRow[props.column.field]" :key="patrolPoint._id">- {{ patrolPoint?.name }}</p>
                    </span>
                    <span v-else-if="props.column.field === 'account' || props.column.field === 'client' || props.column.field === 'site'">
                        {{ props.formattedRow[props.column.field]?.name }}
                    </span>
                    <span v-else-if="props.column.field === 'status'">
                        <span class="badge" v-bind:class="props.formattedRow[props.column.field] === 'ACTIVE' ? 'bg-success' : 'bg-danger'"> {{ $t(props.formattedRow[props.column.field]) }} </span>
                    </span>

                    <span v-else>
                        {{ props.formattedRow[props.column.field] }}
                    </span>
                </template>
            </vue-good-table>
        </div>

        <!-- <CreateScheduleModal :selectedAppointment="selectedAppointment" :selectedDate="selectedDate" :accounts="accounts" :clients="clients" :isSuperAdminMaster="isSuperAdminMaster" /> -->
    </div>
</template>

<script>
import Controller from './CrtTimeline.vue'
// import CreateScheduleModal from './CreateScheduleModal/CreateScheduleModal.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        // CreateScheduleModal,
    },
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
            filters: {
                account: '',
                client: '',
                site: '',
                status: 'ACTIVE',
                startDate: new Date(),
                endDate: null,
                isSortByStartDate: true,
            },
            isSuperAdminMaster: false,
        }
    },
    methods: Controller.methods,
    mounted() {},
    created() {
        const state = this
        this.initRangeDate()

        Controller.init(state)
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
}

.vue-daterange-picker.btn .form-control {
    text-align: start !important;
}

.caret {
    display: none !important;
}
</style>
