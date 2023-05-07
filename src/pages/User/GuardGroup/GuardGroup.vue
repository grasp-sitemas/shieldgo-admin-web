<template>
    <b-modal no-close-on-backdrop id="createGuardGroupModal" @hide="closeModal" :hide-footer="true" size="lg" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.breadcrumb.guard.groups') }}</h4>
            <a class="btn-close cursor_pointer" @click="$bvModal.hide('createGuardGroupModal')"></a>
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
                <div v-if="isSuperAdminMaster" class="col-md-4 mb-3">
                    <label class="form-label" for="accountField">{{ $t('str.register.guard.groups.account.field') }}</label>
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
                    <div class="invalid-feedback">{{ $t('str.register.guard.groups.account.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="clientField">{{ $t('str.register.guard.groups.client.field') }}</label>
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
                    <div class="invalid-feedback">{{ $t('str.register.guard.groups.client.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="siteField">{{ $t('str.register.guard.groups.site.field') }}</label>
                    <select v-model="data.site" @change="changeSite" class="form-select" v-bind:class="checkRequiredField('site') ? 'is-invalid' : ''" @focus="removeRequiredField('site')" id="siteField">
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
                    <label class="form-label" for="nameField">{{ $t('str.register.guard.groups.name.field') }}</label>
                    <input
                        v-model="data.name"
                        class="form-control"
                        v-bind:class="checkRequiredField('name') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('name')"
                        type="text"
                        key="nameField"
                        :placeholder="$t('str.register.guard.groups.name.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.guard.groups.name.required') }}</div>
                </div>
                <div class="col-md-8 mb-3">
                    <label class="form-label" for="vigilantsField">{{ $t('str.register.guard.groups.vigilants.field') }}</label>
                    <span v-show="data.site" @click="removeAllVigilants()" disabled class="badge bg-dark rounded-5 cursor_pointer f-right badge-ml-5">{{
                        $t('str.register.guard.group.remove.all.vigilants.label')
                    }}</span>
                    <span v-show="data.site" @click="selectAllVigilants()" disabled class="badge bg-dark rounded-5 cursor_pointer f-right">{{ $t('str.register.guard.group.select.all.vigilants.label') }}</span>
                    <v-select
                        taggable
                        multiple
                        label="fullName"
                        key="vigilantsField"
                        v-model="data.vigilants"
                        :options="vigilants"
                        :create-option="vigilant => ({ _id: '' })"
                        :placeholder="$t('str.register.select.placeholder')"
                    />
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
import Controller from './CrtGuardGroup.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()
import { guardGroup } from '../../../types/guardGroup'
import { STATES } from '../../../utils/states'
import { ROLES } from '../../../utils/roles'
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

            if (this.data.account) {
                this.clients = await Services.getClientsByAccount(this, this.data.account)
            }

            if (this.data.client) {
                this.sites = await Services.getSitesByClient(this, this.data.client)
            }

            if (this.data.site) {
                this.vigilants = await Services.getVigilantsBySite(this, this.data.site)

                const mappedVigilants = this.data.vigilants.map(vigilant => {
                    return {
                        _id: vigilant._id,
                        firstName: vigilant.firstName,
                        lastName: vigilant.lastName,
                        fullName: `${vigilant.firstName} ${vigilant.lastName}`,
                    }
                })

                this.data.vigilants = mappedVigilants ? mappedVigilants : []
            }

            this.errors = []
        },
    },
    data() {
        return {
            states: STATES,
            roles: ROLES,
            domain: null,
            file: null,
            isLoading: false,
            errors: [],
            accounts: [],
            clients: [],
            sites: [],
            vigilants: [],
            valuekey: 0,
            isSuperAdminMaster: false,
            data: JSON.parse(JSON.stringify(guardGroup)),
            guardGroupObj: JSON.parse(JSON.stringify(guardGroup)),
        }
    },
    mounted() {
        Controller.init(this)
    },
    methods: Controller.methods,
}
</script>
<style lang="scss"></style>
