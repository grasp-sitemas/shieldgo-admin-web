<template>
    <div>
        <ol class="breadcrumb float-xl-end">
            <li class="breadcrumb-item">
                <a href="#/register-data">{{ $t('str.breadcrumb.register.data') }}</a>
            </li>
        </ol>

        <h1 class="page-header">
            {{ $t('str.form.title.register.data') }}
        </h1>

        <panel :title="$t('str.form.title')">
            <form>
                <fieldset>
                    <div v-if="data._id" class="row">
                        <!-- <div class="col-md-4 mb-3">
                            <label class="form-label" for="idField">{{ $t('str.register.id.field') }}</label>
                            <input v-model="data._id" disabled class="form-control" type="text" id="idField" />
                        </div> -->
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                            <select disabled v-model="data.status" class="form-select" id="statusField">
                                <option value="ACTIVE">{{ $t('str.register.status.active') }}</option>
                                <option value="ARCHIVED">{{ $t('str.register.status.archived') }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="nameField">{{ $t('str.register.company.name.field') }}</label>
                            <input
                                v-model="data.name"
                                class="form-control"
                                v-bind:class="checkRequiredField('name') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('name')"
                                type="text"
                                key="nameField"
                                :placeholder="$t('str.register.company.name.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.company.name.required') }}</div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="typePersonField">{{ $t('str.register.company.person.type.field') }}</label>
                            <select class="form-select" v-model="data.personType">
                                <option value="" selected>{{ $t('str.register.select.placeholder') }}</option>
                                <option value="PHYSICAL">{{ $t('str.person.type.individual') }}</option>
                                <option value="LEGAL">{{ $t('str.person.type.legal') }}</option>
                            </select>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="docField">{{ $t('str.register.company.document.field') }}</label>
                            <input
                                key="docField"
                                type="tel"
                                v-mask="['###.###.###-##', '##.###.###/####-##']"
                                v-model="data.document"
                                class="form-control"
                                :placeholder="$t('str.register.company.document.placeholder')"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label">{{ $t('str.register.company.email.field') }}</label>
                            <input class="form-control" v-model="data.email" type="text" :placeholder="$t('str.register.company.email.placeholder')" />
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
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="secondaryPhoneField">{{ $t('str.register.company.secondaryPhone.field') }}</label>
                            <input
                                key="secondaryPhoneField"
                                type="tel"
                                v-mask="['(##) ####-####', '(##) #####-####']"
                                v-model="data.secondaryPhone"
                                class="form-control"
                                :placeholder="$t('str.register.company.secondaryPhone.placeholder')"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="cepField">{{ $t('str.register.company.cep.field') }}</label>
                            <input
                                type="tel"
                                v-mask="'#####-###'"
                                key="cepField"
                                @input="inputCep()"
                                @focus="removeRequiredField('allAddress')"
                                v-bind:class="checkRequiredField('cep') ? 'is-invalid' : ''"
                                v-model="data.address.cep"
                                class="form-control"
                                :placeholder="$t('str.register.company.cep.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.company.cep.required') }}</div>
                        </div>
                        <div v-if="data?.address?.cep?.length === 9" class="col-md-4 mb-3">
                            <label class="form-label" for="addressField">{{ $t('str.register.company.address.field') }}</label>
                            <input
                                v-model="data.address.address"
                                v-bind:class="checkRequiredField('address') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('address')"
                                class="form-control"
                                type="text"
                                key="addressField"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.company.address.required') }}</div>
                        </div>
                        <div v-if="data?.address?.cep?.length === 9" class="col-md-4 mb-3">
                            <label class="form-label" for="numberField">{{ $t('str.register.company.number.field') }}</label>
                            <input
                                v-model="data.address.number"
                                v-bind:class="checkRequiredField('number') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('number')"
                                class="form-control"
                                type="number"
                                key="numberField"
                                :placeholder="$t('str.register.company.number.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.company.number.required') }}</div>
                        </div>
                    </div>
                    <div class="row" v-if="data?.address?.cep?.length === 9">
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="complementField">{{ $t('str.register.company.complement.field') }}</label>
                            <input v-model="data.address.complement" class="form-control" type="text" id="complementField" :placeholder="$t('str.register.company.complement.placeholder')" />
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="districtField">{{ $t('str.register.company.district.field') }}</label>
                            <input
                                v-model="data.address.neighborhood"
                                v-bind:class="checkRequiredField('neighborhood') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('neighborhood')"
                                class="form-control"
                                type="text"
                                key="districtField"
                                :placeholder="$t('str.register.company.district.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.company.neighborhood.required') }}</div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="cityField">{{ $t('str.register.company.city.field') }}</label>
                            <input
                                v-model="data.address.city"
                                v-bind:class="checkRequiredField('city') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('city')"
                                class="form-control"
                                type="text"
                                key="cityField"
                                :placeholder="$t('str.register.company.city.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.company.city.required') }}</div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="stateField">{{ $t('str.register.company.state.field') }}</label>
                            <select v-model="data.address.state" class="form-select" v-bind:class="checkRequiredField('state') ? 'is-invalid' : ''" @focus="removeRequiredField('state')" id="stateField">
                                <option v-for="state in states" :value="state.value" :key="state.value">
                                    {{ state.label }}
                                </option>
                            </select>
                            <div class="invalid-feedback">{{ $t('str.register.company.cep.required') }}</div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="numberField">{{ $t('str.register.company.logo.field') }}</label>
                            <div v-if="data?.logoURL && data.logoURL !== 'https://'" class="d-flex">
                                <a class="w-lg-250px w-250px">
                                    <img crossorigin="anonymous" v-bind:src="`${domain}${data.logoURL}`" class="mw-100 rounded" />
                                </a>
                            </div>
                            <input type="file" accept="image/*" id="file" ref="file" v-on:change="handleFileUpload()" class="form-control" />
                        </div>
                    </div>

                    <div class="btn-center mt-4 mb-2">
                        <button v-on:click="checkForm" type="submit" class="btn btn-primary w-200px me-10px is-loading">
                            <i v-if="isLoading === true" class="fas fa-spinner fa-pulse"></i>
                            {{ $t('str.btn.save') }}
                        </button>
                    </div>
                </fieldset>
            </form>
        </panel>
        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </div>
</template>

<script>
import Controller from './CrtRegisterData.vue'
import { STATES } from '../../../utils/states.js'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    data() {
        return {
            states: STATES,
            domain: null,
            file: null,
            isLoading: false,
            errors: [],
            data: {
                name: '',
                fantasyName: '',
                personType: '',
                document: '',
                email: '',
                primaryPhone: '',
                secondaryPhone: '',
                logoURL: '',
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
                type: 'ACCOUNT',
                status: 'ACTIVE',
            },
        }
    },
    methods: Controller.methods,
    created() {},
    mounted() {
        Controller.init(this)
    },
}
</script>
