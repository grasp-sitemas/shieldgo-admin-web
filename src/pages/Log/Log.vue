<template>
    <div>
        <h1 class="page-header">
            {{ $t('str.form.title.logs') }}
        </h1>

        <panel :title="$t('str.table.list.logs')" bodyClass="p-0">
            <div class="row">
                <div class="col-md-3 mb-3 p-3">
                    <div id="accordion" class="accordion rounded overflow-hidden">
                        <b-card class="bg-gray-800 text-white border-0 rounded-0" no-body>
                            <b-card-header header-tag="header" class="card-header bg-gray-900 text-white pointer-cursor px-3 py-10px d-flex align-items-center" v-b-toggle.companies>
                                {{ $t('str.filter.by.companies') }}
                            </b-card-header>
                            <b-collapse id="companies" visible accordion="companySession">
                                <b-card-body>
                                    <div v-if="isSuperAdminMaster" class="row mb-3">
                                        <label class="form-label" for="accountField">{{ $t('str.register.user.account.field') }}</label>
                                        <select v-model="filters.account" @change="changeAccount" class="form-select" id="accountField">
                                            <option value="">{{ $t('str.register.select.placeholder') }}</option>
                                            <option v-for="account in accounts" :value="account._id" :key="account._id">
                                                {{ account.name }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="row mb-3">
                                        <label class="form-label" for="clientField">{{ $t('str.register.user.client.field') }}</label>
                                        <select v-model="filters.client" @change="changeClient" class="form-select" id="clientField">
                                            <option value="">{{ $t('str.register.select.placeholder') }}</option>
                                            <option v-for="client in clients" :value="client._id" :key="client._id">
                                                {{ client.name }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="row mb-3">
                                        <label class="form-label" for="siteField">{{ $t('str.register.user.site.field') }}</label>
                                        <select v-model="filters.site" @change="filter" class="form-select" id="siteField">
                                            <option value="">{{ $t('str.register.select.placeholder') }}</option>
                                            <option v-for="site in sites" :value="site._id" :key="site._id">
                                                {{ site.name }}
                                            </option>
                                        </select>
                                    </div>
                                </b-card-body>
                            </b-collapse>
                        </b-card>
                        <b-card class="bg-gray-800 text-white border-0 rounded-0" no-body>
                            <b-card-header header-tag="header" class="card-header bg-gray-900 text-white pointer-cursor px-3 py-10px d-flex align-items-center" v-b-toggle.domains>
                                {{ $t('str.filter.by.domains') }}
                            </b-card-header>
                            <b-collapse id="domains" visible accordion="domainsSessions">
                                <b-card-body>
                                    <div class="form-check form-switch mb-2" v-bind:key="item.id" v-for="item in this.domains">
                                        <input
                                            v-model="filters.domains"
                                            @change="handleDomains(item.value)"
                                            :id="item.value"
                                            :value="item.value"
                                            :true-value="item.value"
                                            class="form-check-input"
                                            type="checkbox"
                                        />
                                        <label class="form-check-label" :for="item.value">{{ $t(item.label) }}</label>
                                    </div>
                                </b-card-body>
                            </b-collapse>
                        </b-card>
                    </div>
                </div>
                <div class="col-md-9">
                    <vue-good-table
                        :columns="columns"
                        :rows="items"
                        :lineNumbers="true"
                        :totalRows="items?.length"
                        :search-options="{ enabled: true, placeholder: $t('str.table.search.in.this.table') }"
                        :pagination-options="paginationOptions"
                    >
                        <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                            <i v-if="isLoading" class="fas fa-spinner fa-spin" />
                            <span v-if="!isLoading && items?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
                        </div>

                        <template slot="table-row" slot-scope="props">
                            <span v-if="props.column.field === 'systemUser'"> {{ props.formattedRow[props.column.field]?.firstName }} {{ props.formattedRow[props.column.field]?.lastName }} </span>
                            <span v-else-if="props.column.field === 'domain' || props.column.field === 'operation'">
                                {{ $t(props.formattedRow[props.column.field]) }}
                            </span>
                            <span v-else-if="props.column.field === 'account' || props.column.field === 'client' || props.column.field === 'site'">
                                {{ props.formattedRow[props.column.field]?.name }}
                            </span>
                            <span v-else-if="props.column.field === 'createDate'">
                                {{ formatDate(props.formattedRow[props.column.field]) }}
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
            </div>
        </panel>
    </div>
</template>

<script>
import Controller from './CrtLog.vue'
import { DOMAINS } from '../../utils/domains'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {},
    data() {
        return {
            isLoading: false,
            valuekey: 0,
            domains: DOMAINS,
            errors: [],
            accounts: [],
            clients: [],
            sites: [],
            items: [],
            filters: {
                domains: [],
                status: 'ACTIVE',
                account: '',
                client: '',
                site: '',
            },
            isSuperAdminMaster: false,
            columns: [],
            paginationOptions: {
                perPage: 15,
            },
        }
    },
    mounted() {
        Controller.init(this)
    },
    created() {
        const state = this
        state.$registerEvent.$on('refreshList', function () {
            state.filter()
        })
        state.$registerEvent.$on('changeLanguage', function () {
            state.initTable()
        })
    },
    methods: Controller.methods,
}
</script>
