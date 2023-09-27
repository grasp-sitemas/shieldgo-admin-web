<template>
    <div>
        <panel :title="$t('str.table.list.incidents')" bodyClass="p-0">
            <div class="row ms-2 mb-1 mt-3 me-1">
                <div v-if="isSuperAdminMaster" class="col-md-4 mb-3">
                    <label class="form-label" for="accountField">{{ $t('str.register.guard.groups.account.field') }}</label>
                    <select v-model="filters.account" @change="changeAccount" class="form-select" id="accountField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="(account, index) in accounts" :value="account._id" :key="index">
                            {{ account.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.guard.groups.account.required') }}</div>
                </div>
                <div v-if="role === 'SUPER_ADMIN_MASTER' || role === 'ADMIN' || role === 'MANAGER'" class="col-md-4 mb-3">
                    <label class="form-label" for="clientField">{{ $t('str.register.guard.groups.client.field') }}</label>
                    <select v-model="filters.client" @change="changeClient" class="form-select" id="clientField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="(client, index) in clients" :value="client._id" :key="index">
                            {{ client.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.guard.groups.client.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="siteField">{{ $t('str.register.guard.groups.site.field') }}</label>
                    <select v-model="filters.site" @change="changeSite" class="form-select" id="siteField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="(site, index) in sites" :value="site._id" :key="index">
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
                <div v-if="role !== 'AUDITOR'" class="col-md-3" :class="{ 'mt-4': isSuperAdminMaster }">
                    <button @click="selectItem()" type="submit" class="btn btn-default w-50">{{ $t('str.btn.new.form') }}</button>
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
                    <span v-if="props.column.field === 'address' && props.formattedRow[props.column.field].address">
                        {{
                            props.formattedRow[props.column.field].address +
                            ' ' +
                            props.formattedRow[props.column.field].number +
                            ', ' +
                            props.formattedRow[props.column.field].neighborhood +
                            ', ' +
                            props.formattedRow[props.column.field].city +
                            '- ' +
                            props.formattedRow[props.column.field].state
                        }}
                    </span>
                    <span v-else-if="props.column.field === 'createDate'">
                        {{ formatDate(props.formattedRow[props.column.field], true) }}
                    </span>
                    <span v-else-if="props.column.field === 'priority'">
                        <span v-if="props.formattedRow[props.column.field] === 3">
                            {{ $t('str.incident.level.high') }}
                        </span>
                        <span v-else-if="props.formattedRow[props.column.field] === 2">
                            {{ $t('str.incident.level.medium') }}
                        </span>
                        <span v-else-if="props.formattedRow[props.column.field] === 1">
                            {{ $t('str.incident.level.low') }}
                        </span>
                    </span>
                    <span v-else-if="props.column.field === 'account'">
                        {{ props.formattedRow[props.column.field]?.name }}
                    </span>
                    <span v-else-if="props.column.field === 'client'">
                        {{ props.formattedRow[props.column.field]?.name }}
                    </span>
                    <span v-else-if="props.column.field === 'site'">
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
        </panel>
        <IncidentModal :selectedData="data" />
        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </div>
</template>

<script>
import Controller from './CrtListIncident.vue'
import IncidentModal from './Incident.vue'
import { incident } from '../../../types/incident'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        IncidentModal,
    },
    data() {
        return {
            items: [],
            accounts: [],
            clients: [],
            sites: [],
            isLoading: false,
            data: {},
            isSuperAdminMaster: false,
            incidentObj: JSON.parse(JSON.stringify(incident)),
            filters: {
                account: '',
                client: '',
                site: '',
                status: 'ACTIVE',
                name: '',
            },
            columns: [],
            role: '',
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
