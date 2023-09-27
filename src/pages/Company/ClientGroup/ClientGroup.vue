<template>
    <b-modal no-close-on-backdrop id="createClientGroupModal" @hide="closeModal" :hide-footer="true" size="lg" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.breadcrumb.client.groups') }}</h4>
            <a class="btn-close cursor_pointer" @click="closeModal"></a>
        </template>

        <div>
            <div v-if="data._id" class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                    <select v-model="data.status" class="form-select" id="statusField">
                        <option value="ACTIVE">{{ $t('str.register.status.active') }}</option>
                        <option value="ARCHIVED">{{ $t('str.register.status.archived') }}</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div v-if="isSuperAdminMaster" class="col-md-6 mb-3">
                    <label class="form-label" for="accountField">{{ $t('str.register.client.groups.account.field') }}</label>
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
                    <div class="invalid-feedback">{{ $t('str.register.client.groups.account.required') }}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label" for="nameField">{{ $t('str.register.client.groups.name.field') }}</label>
                    <input
                        v-model="data.name"
                        class="form-control"
                        v-bind:class="checkRequiredField('name') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('name')"
                        type="text"
                        key="nameField"
                        :placeholder="$t('str.register.client.groups.name.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.client.groups.name.required') }}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 mb-3">
                    <label class="form-label" for="clientsField">{{ $t('str.register.client.groups.clients.field') }}</label>
                    <span v-show="data.account" @click="removeAllClients()" disabled class="badge bg-dark rounded-5 cursor_pointer f-right badge-ml-5">{{
                        $t('str.register.client.group.remove.all.clients.label')
                    }}</span>
                    <span v-show="data.account" @click="selectAllClients()" disabled class="badge bg-dark rounded-5 cursor_pointer f-right">{{ $t('str.register.client.group.select.all.clients.label') }}</span>
                    <v-select
                        v-bind:class="checkRequiredField('clients') ? 'is-invalid' : ''"
                        @open="removeRequiredField('clients')"
                        taggable
                        multiple
                        label="name"
                        key="clientsField"
                        v-model="data.clients"
                        :options="clients"
                        :create-option="client => ({ _id: '' })"
                        :placeholder="$t('str.register.select.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.client.groups.account.required') }}</div>
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
import Controller from './CrtClientGroup.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()
import { clientGroup } from '../../../types/clientGroup'
import { STATES } from '../../../utils/states.js'
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
            this.data = this.selectedData

            if (!this.data?.account) {
                this.data.account = await Common.getAccountId(this)
            }

            this.clients = await Services.getClientsByAccount(this, this.data?.account)

            this.errors = []
        },
    },
    data() {
        return {
            states: STATES,
            isLoading: false,
            errors: [],
            accounts: [],
            clients: [],
            valuekey: 0,
            isSuperAdminMaster: false,
            role: '',
            data: JSON.parse(JSON.stringify(clientGroup)),
            clientGroupObj: JSON.parse(JSON.stringify(clientGroup)),
        }
    },
    mounted() {
        Controller.init(this)
    },
    methods: Controller.methods,
}
</script>
