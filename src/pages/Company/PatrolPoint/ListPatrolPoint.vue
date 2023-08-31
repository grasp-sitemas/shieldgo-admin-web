<template>
    <div>
        <panel :title="$t('str.table.list.patrol.points')" bodyClass="p-0">
            <div class="row ms-2 mb-1 mt-3 me-1">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="typeField">{{ $t('str.register.type.field') }}</label>
                    <select v-model="filters.type"  @change="filter" class="form-select" id="typeField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option value="QRCODE">{{ $t('str.qrcode.option') }}</option>
                        <option value="SUPERVISION">{{ $t('str.supervision.option') }}</option>
                    </select>
                </div>
                <div v-if="isSuperAdminMaster" class="col-md-4 mb-3">
                    <label class="form-label" for="accountField">{{ $t('str.register.guard.groups.account.field') }}</label>
                    <select v-model="filters.account" @change="changeAccount" class="form-select" id="accountField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="(account, index) in listAccounts" :value="account._id" :key="index">
                            {{ account.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.guard.groups.account.required') }}</div>
                </div>
                <div v-if="role === 'SUPER_ADMIN_MASTER' || role === 'ADMIN' || role === 'MANAGER'" class="col-md-4 mb-3">
                    <label class="form-label" for="clientField">{{ $t('str.register.guard.groups.client.field') }}</label>
                    <select v-model="filters.client" @change="changeClient" class="form-select" id="clientField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="(client, index) in listClients" :value="client._id" :key="index">
                            {{ client.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.guard.groups.client.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="siteField">{{ $t('str.register.guard.groups.site.field') }}</label>
                    <select v-model="filters.site" @change="changeSite" class="form-select" id="siteField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="(site, index) in listSites" :value="site._id" :key="index">
                            {{ site.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.guard.groups.site.required') }}</div>
                </div>
                <div class="col-md-4">
                    <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                    <select v-model="filters.status" @change="filter" class="form-select" id="statusField">
                        <option value="ACTIVE">{{ $t('str.register.status.active') }}</option>
                        <option value="ARCHIVED">{{ $t('str.register.status.archived') }}</option>
                    </select>
                </div>
                <div v-if="role !== 'AUDITOR'" class="col-md-3" :class="{ 'mt-4': isSuperAdminMaster, 'mt-3': !isSuperAdminMaster }">
                    <button v-b-modal.checkPointModal v-on:click="openCheckPointModal" type="submit" class="btn btn-default w-50">{{ $t('str.btn.new.form') }}</button>
                </div>
            </div>

            <vue-good-table
                :columns="columns"
                :rows="items"
                :lineNumbers="true"
                @on-row-click="selectItem"
                :search-options="{ enabled: true, placeholder: $t('str.table.search.in.this.table') }"
                :pagination-options="paginationOptions"
                tableLayout="fixed"
            >
                <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                    <i v-if="isLoading" class="fas fa-spinner fa-spin" />
                    <span v-if="!isLoading && items?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
                </div>
                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field === 'type'">
                        {{ $t(props.formattedRow[props.column.field]) }}
                    </span>
                    <span v-else-if="props.column.field === 'note'">
                        {{ props.formattedRow[props.column.field] }}
                    </span>
                    <span v-else-if="props.column.field === 'account' || props.column.field === 'client' || props.column.field === 'site'">
                        {{ props.formattedRow[props.column.field]?.name }}
                    </span>
                    <!-- <span v-else-if="props.column.field === 'geolocation'">
                        <span v-if="props.formattedRow[props.column.field]?.latitude && props.formattedRow[props.column.field]?.longitude">
                            {{ 'Lat: ' + props.formattedRow[props.column.field]?.latitude + ' Lng: ' + props.formattedRow[props.column.field]?.longitude }}
                        </span>
                    </span> -->
                    <span v-else-if="props.column.field === 'createDate'">
                        {{ formatDate(props.formattedRow[props.column.field], true) }}
                    </span>
                    <span v-else-if="props.column.field === 'status'">
                        <span class="badge" v-bind:class="props.formattedRow[props.column.field] === 'ACTIVE' ? 'bg-success' : 'bg-danger'"> {{ $t(props.formattedRow[props.column.field]) }} </span>
                    </span>
                    <span v-else>
                        {{ props.formattedRow[props.column.field] }}
                    </span>
                </template>
            </vue-good-table>
        </panel>
        <Map :data="patrolPointItem" />
        <CheckPointModal :isSuperAdminMaster="isSuperAdminMaster" :accounts="accounts" :clients="clients" :sites="listSites" :role="role" />
    </div>
</template>

<script>
import Controller from './CrtListPatrolPoint.vue'
import CheckPointModal from './CheckPointModal/CheckPointModal.vue'
import Services from '../../../common/Services.vue'
import { patrolPoint } from '../../../types/patrolPoint'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        CheckPointModal,
    },
    props: {
        isSuperAdminMaster: {
            type: Boolean,
            default: false,
        },
        accounts: {
            type: Array,
            default: () => [],
        },
        clients: {
            type: Array,
            default: () => [],
        },
        role: {
            type: String,
            default: '',
        },
    },
    watch: {
        accounts: function () {
            this.listAccounts = this.accounts
        },
        clients: function () {
            this.listClients = this.clients
        },
        role: async function () {
            if (this.role === 'OPERATOR' || this.role === 'AUDITOR') {
                this.listSites = await Services.getSites(this)
            }
        },
    },
    data() {
        return {
            items: [],
            isLoading: false,
            subTypeUser: '',
            filters: {
                account: '',
                client: '',
                site: '',
                status: 'ACTIVE',
                type: '',
                name: '',
            },
            patrolPointItem: {},
            listAccounts: [],
            listClients: [],
            listSites: [],
            columns: [],
            patrolPointObj: JSON.parse(JSON.stringify(patrolPoint)),
            paginationOptions: {},
        }
    },
    mounted() {
        Controller.init(this)
    },
    created() {
        let state = this
        this.$registerEvent.$on('refreshList', function () {
            state.filter()
        })
        this.$registerEvent.$on('changeLanguage', function () {
            state.initTable()
        })
    },
    methods: Controller.methods,
}
</script>
<style scoped>
.no-select-item {
    pointer-events: none; /* Impede que o elemento receba eventos de clique */
}
</style>