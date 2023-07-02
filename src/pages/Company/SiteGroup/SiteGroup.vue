<template>
    <b-modal no-close-on-backdrop id="createSiteGroupModal" @hide="closeModal" :hide-footer="true" size="lg" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.breadcrumb.site.groups') }}</h4>
            <a class="btn-close cursor_pointer" @click="closeModal"></a>
        </template>

        <div>
            <div v-if="data._id" class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                    <select v-model="data.status" class="form-select" id="statusField">
                        <option value="ACTIVE">{{ $t('str.register.status.active') }}</option>
                        <option value="ARCHIVED">{{ $t('str.register.status.archived') }}</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="nameField">{{ $t('str.register.site.groups.name.field') }}</label>
                    <input
                        v-model="data.name"
                        class="form-control"
                        v-bind:class="checkRequiredField('name') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('name')"
                        type="text"
                        key="nameField"
                        :placeholder="$t('str.register.site.groups.name.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.site.groups.name.required') }}</div>
                </div>
                <div v-if="isSuperAdminMaster" class="col-md-4 mb-3">
                    <label class="form-label" for="accountField">{{ $t('str.register.site.groups.account.field') }}</label>
                    <select
                        v-model="data.account"
                        @change="changeAccount"
                        class="form-select"
                        v-bind:class="checkRequiredField('account') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('account')"
                        id="accountField"
                    >
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="account in accounts" :value="account._id" :key="account._id">
                            {{ account.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.site.groups.account.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="clientField">{{ $t('str.register.site.groups.client.field') }}</label>
                    <select
                        v-model="data.client"
                        @change="changeClient"
                        class="form-select"
                        v-bind:class="checkRequiredField('client') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('client')"
                        id="clientField"
                    >
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="client in clients" :value="client._id" :key="client._id">
                            {{ client.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.site.groups.client.required') }}</div>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-md-8 mb-3">
                    <label class="form-label" for="sitesField">{{ $t('str.register.site.groups.sites.field') }}</label>
                    <span v-show="data.client" @click="removeAllSites()" disabled class="badge bg-dark rounded-5 cursor_pointer f-right badge-ml-5">{{
                        $t('str.register.site.group.remove.all.sites.label')
                    }}</span>
                    <span v-show="data.client" @click="selectAllSites()" disabled class="badge bg-dark rounded-5 cursor_pointer f-right">{{ $t('str.register.site.group.select.all.sites.label') }}</span>
                    <v-select
                        taggable
                        multiple
                        label="name"
                        key="sitesField"
                        v-model="selectedSites"
                        :options="sites"
                        :create-option="site => ({ _id: '' })"
                        :placeholder="$t('str.register.select.placeholder')"
                    />
                </div>
                <div class="col-md-4 mt-4">
                    <button @click="addSiteGroup()" class="btn btn-warning w-50" type="button" :disabled="selectedSites?.length > 0 ? false : true">
                        {{ $t('str.register.site.groups.add.button') }}
                    </button>
                </div>
            </div>

            <div class="row mt-2">
                <h6 class="" for="sitesField">{{ $t('str.register.site.groups.sites.table.title') }}</h6>
                <div class="col-md-12 mb-3">
                    <table class="table table-bordered">
                        <thead class="thead-dark dark">
                            <tr>
                                <th class="upperCase">{{ $t('str.register.site.groups.sites.table.name') }}</th>
                                <th class="upperCase">{{ $t('str.register.site.groups.sites.table.client') }}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody v-if="data?.sites">
                            <tr v-for="site in data.sites" :key="site._id">
                                <td>{{ site.name }}</td>
                                <td>{{ site.client?.name }}</td>
                                <td>
                                    <span @click="removeSite(site)" disabled class="badge bg-dark rounded-5 cursor_pointer">{{ $t('str.register.site.group.remove.site.label') }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="btn-center mt-4 mb-2">
                <button @click="checkForm" type="submit" class="btn btn-primary is-loading w-25 m-2">
                    <i v-if="isLoading === true" class="fas fa-spinner fa-pulse"></i>
                    {{ $t('str.btn.save') }}
                </button>
                <button v-if="data._id && data.status === 'ACTIVE'" v-on:click="confirmArchive" type="submit" class="btn btn-warning w-25 m-2">
                    {{ $t('str.btn.archive') }}
                </button>
                <button @click="closeModal" type="submit" class="btn btn-default w-25 m-2">{{ $t('str.btn.close') }}</button>
            </div>
        </div>

        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </b-modal>
</template>

<script>
import Controller from './CrtSiteGroup.vue'
import Vue from 'vue'
import { siteGroup } from '../../../types/siteGroup'
Vue.prototype.$registerEvent = new Vue()
import Services from '../../../common/Services.vue'
import Common from '../../../common/Common.vue'

export default {
    props: {
        selectedData: {
            type: Object,
            default: () => {},
        },
    },
    watch: {
        selectedData: async function () {
            this.data = this?.selectedData

            if (!this.data?.account) {
                this.data.account = await Common.getAccountId(this)
            }

            this.clients = await Services.getClientsByAccount(this, this.data?.account)
            this.sites = await Services.getSitesByClient(this, this.data?.client)

            this.errors = []
        },
    },
    data() {
        return {
            isLoading: false,
            errors: [],
            accounts: [],
            clients: [],
            sites: [],
            selectedSites: [],
            role: '',
            valuekey: 0,
            isSuperAdminMaster: false,
            data: JSON.parse(JSON.stringify(siteGroup)),
            siteGroupObj: JSON.parse(JSON.stringify(siteGroup)),
        }
    },
    mounted() {
        Controller.init(this)
    },
    methods: Controller.methods,
}
</script>
<style lang="scss" scoped>
.dark-shadow {
    background-color: inset 0 0 0 9999px var(--bs-table-accent-bg) !important;
}
table {
    border: outset !important;

    th {
        border: outset !important;
        font-size: 11px;
    }
    td {
        border: outset !important;
        font-size: 11px;
        font-weight: 400;
        line-height: 1.2;
    }

    thead {
        background-color: var(--bs-table-accent-bg) !important;
    }
}
</style>
