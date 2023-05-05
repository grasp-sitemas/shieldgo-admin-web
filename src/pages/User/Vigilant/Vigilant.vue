<template>
    <b-modal no-close-on-backdrop id="createGuardModal" @hide="closeModal" :hide-footer="true" size="lg" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.breadcrumb.vigilants') }}</h4>
            <a class="btn-close cursor_pointer" @click="$bvModal.hide('createGuardModal')"></a>
        </template>

        <div>
            <div v-if="data?._id" class="row">
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
                    <label class="form-label" for="accountField">{{ $t('str.register.vigilant.account.field') }}</label>
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
                    <div class="invalid-feedback">{{ $t('str.register.vigilant.account.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="clientField">{{ $t('str.register.vigilant.client.field') }}</label>
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
                    <div class="invalid-feedback">{{ $t('str.register.vigilant.client.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="siteField">{{ $t('str.register.vigilant.site.field') }}</label>
                    <select v-model="data.site" class="form-select" v-bind:class="checkRequiredField('site') ? 'is-invalid' : ''" @focus="removeRequiredField('site')" id="siteField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="site in sites" :value="site._id" :key="site._id">
                            {{ site.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.vigilant.site.required') }}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="firstNameField">{{ $t('str.register.vigilant.first.name.field') }}</label>
                    <input
                        v-model="data.firstName"
                        class="form-control"
                        v-bind:class="checkRequiredField('firstName') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('firstName')"
                        type="text"
                        key="firstNameField"
                        :placeholder="$t('str.register.vigilant.first.name.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.vigilant.first.name.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="lastNameField">{{ $t('str.register.vigilant.last.name.field') }}</label>
                    <input
                        v-model="data.lastName"
                        class="form-control"
                        v-bind:class="checkRequiredField('lastName') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('lastName')"
                        type="text"
                        key="lastNameField"
                        :placeholder="$t('str.register.vigilant.last.name.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.vigilant.last.name.required') }}</div>
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
                    <label class="form-label">{{ $t('str.register.vigilant.username.field') }}</label>
                    <input
                        class="form-control"
                        v-bind:class="checkRequiredField('username') || checkRequiredField('usernameAlreadyExists') ? 'is-invalid' : ''"
                        v-on:input="removeRequiredField('username')"
                        v-model="data.username"
                        @focus="removeRequiredField('username')"
                        type="text"
                        :placeholder="$t('str.register.vigilant.username.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.vigilant.username.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">{{ $t('str.register.vigilant.email.field') }}</label>
                    <input
                        :autocomplete="'username'"
                        class="form-control"
                        v-bind:class="checkRequiredField('email') || checkRequiredField('emailAlreadyExists') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('email')"
                        v-model="data.email"
                        type="text"
                        :placeholder="$t('str.register.vigilant.email.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.vigilant.email.required') }}</div>
                </div>

                <div class="col-md-4 mb-3">
                    <label class="form-label">{{ $t('str.register.vigilant.password.field') }}</label>
                    <div class="input-group">
                        <input
                            :autocomplete="'new-password'"
                            class="form-control"
                            v-bind:class="checkRequiredField('password') ? 'is-invalid' : ''"
                            @focus="removeRequiredField('password')"
                            v-model="data.password"
                            v-bind:type="showPassword ? 'text' : 'password'"
                            :placeholder="$t('str.register.vigilant.password.placeholder')"
                        />
                        <span class="input-group-text" v-on:click="showPassword = !showPassword">
                            <i v-bind:class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                        </span>
                        <div class="invalid-feedback">{{ $t('str.register.vigilant.password.required') }}</div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="cepField">{{ $t('str.register.vigilant.cep.field') }}</label>
                    <input
                        type="tel"
                        v-mask="'#####-###'"
                        key="cepField"
                        @input="inputCep()"
                        @keyup.delete="handleCEPDelete"
                        v-model="data.address.cep"
                        class="form-control"
                        :placeholder="$t('str.register.vigilant.cep.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.vigilant.cep.required') }}</div>
                </div>
                <div v-if="data?.address?.cep?.length === 9" class="col-md-4 mb-3">
                    <label class="form-label" for="addressField">{{ $t('str.register.vigilant.address.field') }}</label>
                    <input v-model="data.address.address" class="form-control" type="text" key="addressField" :placeholder="$t('str.register.vigilant.address.placeholder')" />
                </div>
                <div v-if="data?.address?.cep?.length === 9" class="col-md-4 mb-3">
                    <label class="form-label" for="numberField">{{ $t('str.register.vigilant.number.field') }}</label>
                    <input v-model="data.address.number" class="form-control" type="number" ref="numberField" key="numberField" :placeholder="$t('str.register.vigilant.number.placeholder')" />
                </div>
            </div>
            <div class="row" v-if="data?.address?.cep?.length === 9">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="complementField">{{ $t('str.register.vigilant.complement.field') }}</label>
                    <input v-model="data.address.complement" class="form-control" type="text" id="complementField" :placeholder="$t('str.register.vigilant.complement.placeholder')" />
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="districtField">{{ $t('str.register.vigilant.district.field') }}</label>
                    <input v-model="data.address.neighborhood" class="form-control" type="text" key="districtField" :placeholder="$t('str.register.vigilant.district.placeholder')" />
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="cityField">{{ $t('str.register.vigilant.city.field') }}</label>
                    <input v-model="data.address.city" class="form-control" type="text" key="cityField" :placeholder="$t('str.register.vigilant.city.placeholder')" />
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="stateField">{{ $t('str.register.vigilant.state.field') }}</label>
                    <select v-model="data.address.state" class="form-select" v-bind:class="checkRequiredField('state') ? 'is-invalid' : ''" @focus="removeRequiredField('state')" id="stateField">
                        <option v-for="state in states" :value="state.value" :key="state.value">
                            {{ state.label }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="row">
                <div class="d-flex">
                    <div class="col-md-4 mb-3">
                        <label class="form-label" for="numberField">{{ $t('str.register.vigilant.perfil.photo.field') }}</label>

                        <div v-if="data?.photoURL && data.photoURL !== 'https://'" class="d-flex">
                            <a class="w-lg-250px w-250px">
                                <img crossorigin="anonymous" v-bind:src="`${domain}${data.photoURL}`" class="mw-100 rounded" />
                            </a>
                        </div>

                        <input type="file" accept="image/*" id="file" ref="file" v-on:change="handleFileUpload()" class="form-control" />
                    </div>
                </div>
            </div>
            <div class="btn-center mt-4 mb-2">
                <button @click="checkForm" type="submit" class="btn btn-primary w-200px me-10px is-loading">
                    <i v-if="isLoading === true" class="fas fa-spinner fa-pulse"></i>
                    {{ $t('str.btn.save') }}
                </button>
                <button @click="clearForm" type="submit" class="btn btn-default w-200px">{{ $t('str.btn.new.form') }}</button>
                <button v-if="data?._id && data?.status === 'ACTIVE'" v-on:click="confirmArchive" type="submit" class="ms-10px btn btn-warning w-200px">
                    {{ $t('str.btn.archive') }}
                </button>
            </div>
        </div>

        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </b-modal>
</template>
<script>
import Controller from './CrtVigilant.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

import { STATES } from '../../../utils/states.js'
import { ROLES } from '../../../utils/roles.js'
import { vigilant } from '../../../types/vigilant'
import Services from '../../../common/Services.vue'
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

            if (!this.data?._id) {
                this.data = this.vigilantObj
            }

            this.clients = await Services.getClientsByAccount(this, this.data?.account)
            this.sites = await Services.getSitesByClient(this, this.data?.client)

            this.data.oldEmail = this.data?.email
            this.data.oldUsername = this.data?.username

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
            valuekey: 0,
            showPassword: false,
            isSuperAdminMaster: false,
            data: vigilant,
            vigilantObj: vigilant,
        }
    },
    mounted() {
        Controller.init(this)
    },
    methods: Controller.methods,
}
</script>
