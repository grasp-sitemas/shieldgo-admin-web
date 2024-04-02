<template>
    <div>
        <panel :title="$t('str.table.list.colaborators')" bodyClass="p-0" class="mb-3">
            <div class="row ms-2 mb-1 mt-3 me-1">
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

                <div class="col-md-4">
                    <label class="form-label" for="statusField">{{ $t('str.register.type.field') }}</label>
                    <select v-model="filters.type" @change="filter" class="form-select" id="statusField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option value="DEVICE-PHONE">{{ $t('str.register.type.device.phone') }}</option>
                        <option value="DEVICE-READER">{{ $t('str.register.type.device.reader') }}</option>
                    </select>
                </div>

                <div class="col-md-4">
                    <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                    <select v-model="filters.status" @change="filter" class="form-select" id="statusField">
                        <option value="ACTIVE">{{ $t('str.register.status.active') }}</option>
                        <option value="ARCHIVED">{{ $t('str.register.status.archived') }}</option>
                    </select>
                </div>

                <div v-if="role !== 'AUDITOR'" class="col-md-3 mt-3" :class="{ 'mt-4': isSuperAdminMaster }">
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
                :sort-options="{
                    enabled: true,
                    multipleColumns: true,
                    initialSortBy: [{ field: 'code', type: 'asc' }],
                }"
                tableLayout="fixed"
            >
                <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                    <i v-if="isLoading" class="fas fa-spinner fa-spin" />
                    <span v-if="!isLoading && items?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
                </div>
                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field === 'status'">
                        <span class="badge" v-bind:class="props.formattedRow[props.column.field] === 'ACTIVE' ? 'bg-success' : 'bg-danger'"> {{ $t(props.formattedRow[props.column.field]) }} </span>
                    </span>
                    <span v-else-if="props.column.field === 'type'">
                        <span> {{ $t(props.formattedRow[props.column.field]) }} </span>
                    </span>
                    <span v-else>
                        {{ props.formattedRow[props.column.field] }}
                    </span>
                </template>
            </vue-good-table>
        </panel>
        <RegisterModal :selectedData="data" :accountList="accounts" :clientList="clients" :siteList="sites" />
        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </div>
</template>

<script>
import Controller from './CrtListEquipment.vue'
import RegisterModal from './Equipment.vue'
import { equipment } from '../../../types/equipment'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        RegisterModal,
    },
    data() {
        return {
            items: [],
            isLoading: false,
            data: {},
            isSuperAdminMaster: false,
            filters: {
                account: '',
                client: '',
                site: '',
                name: '',
                status: 'ACTIVE',
                type: '',
                brand: '',
            },
            equipmentObj: JSON.parse(JSON.stringify(equipment)),
            columns: [],
            accounts: [],
            clients: [],
            sites: [],
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
