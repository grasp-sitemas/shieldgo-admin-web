<template>
    <b-modal no-close-on-backdrop id="createClientModal" @hide="closeModal" :hide-footer="true" size="lg" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.breadcrumb.clients') }}</h4>
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
            <div v-if="isSuperAdminMaster" class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="accountField">{{ $t('str.register.client.account.field') }}</label>
                    <select v-model="data.account" class="form-select" v-bind:class="checkRequiredField('account') ? 'is-invalid' : ''" @focus="removeRequiredField('account')" id="accountField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="account in accounts" :value="account._id" :key="account._id">
                            {{ account.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.client.account.required') }}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="nameField">{{ $t('str.register.client.name.field') }}</label>
                    <input
                        v-model="data.name"
                        class="form-control"
                        v-bind:class="checkRequiredField('name') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('name')"
                        type="text"
                        key="nameField"
                        :placeholder="$t('str.register.client.name.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.client.name.required') }}</div>
                </div>

                <div class="col-md-4 mb-3">
                    <label class="form-label">{{ $t('str.register.client.email.field') }}</label>
                    <input class="form-control" v-model="data.email" type="text" :placeholder="$t('str.register.client.email.placeholder')" />
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="primaryPhoneField">{{ $t('str.register.client.phone.field') }}</label>
                    <input
                        key="primaryPhoneField"
                        type="tel"
                        v-mask="['(##) ####-####', '(##) #####-####']"
                        v-model="data.primaryPhone"
                        class="form-control"
                        :placeholder="$t('str.register.client.phone.placeholder')"
                    />
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label">{{ $t('str.register.client.owner.field') }}</label>
                    <input class="form-control" v-model="data.owner" type="text" :placeholder="$t('str.register.client.owner.placeholder')" />
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
import Controller from './CrtClient.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()
import { client } from '../../../types/client'
import { STATES } from '../../../utils/states.js'
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
            if (!this.data?.account || this.data?.account === '') {
                this.data.account = await Common.getAccountId(this)
            }

            this.errors = []
        },
    },
    data() {
        return {
            states: STATES,
            file: null,
            isLoading: false,
            errors: [],
            accounts: [],
            valuekey: 0,
            isSuperAdminMaster: false,
            data: JSON.parse(JSON.stringify(client)),
            clientObj: JSON.parse(JSON.stringify(client)),
        }
    },
    mounted() {
        Controller.init(this)
    },

    methods: Controller.methods,
}
</script>
