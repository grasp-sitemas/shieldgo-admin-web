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
                <label class="form-label" for="startDateField">{{ $t('str.register.timeline.starts.in.field') }}</label>
                <input v-model="filters.startDate" type="date" class="form-control" id="startDateField" :placeholder="$t('str.register.timeline.starts.in.placeholder')" />
            </div>

            <div class="col-md-4 mb-3">
                <label class="form-label" for="endDateField">{{ $t('str.register.timeline.ends.in.field') }}</label>
                <input v-model="filters.endDate" type="date" class="form-control" id="endDateField" :placeholder="$t('str.register.timeline.ends.in.placeholder')" />
            </div>
            <div class="col-md-4 mb-3">
                <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                <select v-model="filters.status" @change="filter" class="form-control" id="statusField">
                    <option value="">{{ $t('str.selected') }}</option>
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
                <div slot="emptystate" class="vgt-center-align vgt-text-disabled">{{ $t('str.table.subtitle.no.data') }}</div>
                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field === 'systemUser'"> {{ props.formattedRow[props.column.field]?.firstName }} {{ props.formattedRow[props.column.field]?.lastName }} </span>
                    <span v-else-if="props.column.field === 'domain' || props.column.field === 'operation'">
                        {{ $t(props.formattedRow[props.column.field]) }}
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
            filters: {
                account: '',
                client: '',
                site: '',
                status: 'DONE',
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
        Controller.init(this)
        const state = this
        state.$registerEvent.$on('changeLanguage', function () {
            state.initTable()
        })
    },
}
</script>