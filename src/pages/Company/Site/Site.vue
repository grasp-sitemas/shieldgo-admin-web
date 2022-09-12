<template>
    <div :key="valuekey">
        <ol class="breadcrumb float-xl-end">
            <li class="breadcrumb-item">
                <a href="#/sites">{{ $t('str.breadcrumb.sites') }}</a>
            </li>
        </ol>

        <h1 class="page-header">
            {{ $t('str.form.title.sites') }}
        </h1>

        <panel :title="$t('str.register.form.title')">
            <form>
                <fieldset>
                    <div v-if="data._id" class="row">
                        <!-- <div class="col-md-4 mb-3">
                            <label class="form-label" for="idField">{{ $t('str.register.id.field') }}</label>
                            <input v-model="data._id" disabled class="form-control" type="text" id="idField" />
                        </div> -->
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                            <select v-model="data.status" class="form-control" id="statusField">
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
                    </div>

                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="cepField">{{ $t('str.register.site.cep.field') }}</label>
                            <input
                                type="tel"
                                v-mask="'#####-###'"
                                key="cepField"
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
                        <button @click="checkForm" type="submit" class="btn btn-primary w-200px me-10px is-loading">
                            <i v-if="isLoading === true" class="fas fa-spinner fa-pulse"></i>
                            {{ $t('str.btn.save') }}
                        </button>
                        <button @click="clearForm" type="submit" class="btn btn-default w-200px">{{ $t('str.btn.new.form') }}</button>
                        <button v-if="data._id && data.status === 'ACTIVE'" v-on:click="confirmArchive" type="submit" class="ms-10px btn btn-warning w-200px">
                            {{ $t('str.btn.archive') }}
                        </button>
                    </div>
                </fieldset>
            </form>
        </panel>
        <notifications group="bottom-right" position="bottom right" :speed="500" />
        <ListSite v-on:load-item="selectItem" :accounts="accounts" :clients="clients" />
    </div>
</template>

<script>
import ListSite from './ListSite.vue'
import Controller from './CrtSite.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

import { STATES } from '../../../utils/states.js'

export default {
    components: {
        ListSite,
    },
    data() {
        return {
            states: STATES,
            domain: null,
            file: null,
            isLoading: false,
            errors: [],
            accounts: [],
            clients: [],
            valuekey: 0,
            isSuperAdminMaster: false,
            data: {
                name: '',
                logoURL: '',
                client: '',
                account: '',
                address: {
                    cep: '',
                    address: '',
                    number: '',
                    complement: '',
                    neighborhood: '',
                    city: '',
                    state: '',
                    ibge: '',
                    gia: '',
                },
                type: 'SITE',
                status: 'ACTIVE',
            },
        }
    },
    mounted() {
        Controller.init(this)
    },
    methods: Controller.methods,
}
</script>
