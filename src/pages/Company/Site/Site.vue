<template>
    <b-modal no-close-on-backdrop id="createSiteModal" @hide="closeModal" :hide-footer="true" size="lg" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.breadcrumb.sites') }}</h4>
            <a class="btn-close cursor_pointer" @click="$bvModal.hide('createSiteModal')"></a>
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
                    <label class="form-label" for="accountField">{{ $t('str.register.site.account.field') }}</label>
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
                    <div class="invalid-feedback">{{ $t('str.register.site.account.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="clientField">{{ $t('str.register.site.client.field') }}</label>
                    <select v-model="data.client" class="form-select" v-bind:class="checkRequiredField('client') ? 'is-invalid' : ''" @focus="removeRequiredField('client')" id="clientField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="client in clients" :value="client._id" :key="client._id">
                            {{ client.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.site.client.required') }}</div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="nameField">{{ $t('str.register.site.name.field') }}</label>
                    <input
                        v-model="data.name"
                        class="form-control"
                        v-bind:class="checkRequiredField('name') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('name')"
                        type="text"
                        key="nameField"
                        :placeholder="$t('str.register.site.name.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.site.name.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="primaryPhoneField">{{ $t('str.register.company.primaryPhone.field') }}</label>
                    <input
                        key="primaryPhoneField"
                        type="tel"
                        v-mask="['(##) ####-####', '(##) #####-####']"
                        v-model="data.primaryPhone"
                        class="form-control"
                        :placeholder="$t('str.register.company.primaryPhone.placeholder')"
                    />
                </div>
            </div>

            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="cepField">{{ $t('str.register.site.cep.field') }}</label>
                    <input
                        type="tel"
                        v-mask="'#####-###'"
                        key="cepField"
                        @keyup.delete="handleCEPDelete"
                        @input="inputCep()"
                        @focus="removeRequiredField('allAddress')"
                        v-bind:class="checkRequiredField('cep') ? 'is-invalid' : ''"
                        v-model="data.address.cep"
                        class="form-control"
                        :placeholder="$t('str.register.site.cep.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.site.cep.required') }}</div>
                </div>
                <div v-if="data?.address?.cep?.length === 9" class="col-md-4 mb-3">
                    <label class="form-label" for="addressField">{{ $t('str.register.site.address.field') }}</label>
                    <input
                        v-model="data.address.address"
                        v-bind:class="checkRequiredField('address') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('address')"
                        class="form-control"
                        type="text"
                        key="addressField"
                        :placeholder="$t('str.register.site.address.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.site.address.required') }}</div>
                </div>
                <div v-if="data?.address?.cep?.length === 9" class="col-md-4 mb-3">
                    <label class="form-label" for="numberField">{{ $t('str.register.site.number.field') }}</label>
                    <input
                        v-model="data.address.number"
                        v-bind:class="checkRequiredField('number') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('number')"
                        class="form-control"
                        type="number"
                        key="numberField"
                        ref="numberField"
                        :placeholder="$t('str.register.site.number.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.site.number.required') }}</div>
                </div>
            </div>
            <div class="row" v-if="data?.address?.cep?.length === 9">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="complementField">{{ $t('str.register.site.complement.field') }}</label>
                    <input v-model="data.address.complement" class="form-control" type="text" id="complementField" :placeholder="$t('str.register.site.complement.placeholder')" />
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="districtField">{{ $t('str.register.site.district.field') }}</label>
                    <input
                        v-model="data.address.neighborhood"
                        v-bind:class="checkRequiredField('neighborhood') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('neighborhood')"
                        class="form-control"
                        type="text"
                        key="districtField"
                        :placeholder="$t('str.register.site.district.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.site.neighborhood.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="cityField">{{ $t('str.register.site.city.field') }}</label>
                    <input
                        v-model="data.address.city"
                        v-bind:class="checkRequiredField('city') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('city')"
                        class="form-control"
                        type="text"
                        key="cityField"
                        :placeholder="$t('str.register.site.city.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.site.city.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="stateField">{{ $t('str.register.site.state.field') }}</label>
                    <select v-model="data.address.state" class="form-select" v-bind:class="checkRequiredField('state') ? 'is-invalid' : ''" @focus="removeRequiredField('state')" id="stateField">
                        <option v-for="state in states" :value="state.value" :key="state.value">
                            {{ state.label }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.site.cep.required') }}</div>
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
import Controller from './CrtSite.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()
import { site } from '../../../types/site'
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
            states: STATES,
            isLoading: false,
            errors: [],
            valuekey: 0,
            isSuperAdminMaster: false,
            accounts: [],
            clients: [],
            data: JSON.parse(JSON.stringify(site)),
            siteObj: JSON.parse(JSON.stringify(site)),
        }
    },
    mounted() {
        Controller.init(this)
    },
    methods: Controller.methods,
}
</script>
