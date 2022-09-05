<template>
    <div :key="valuekey">
        <ol class="breadcrumb float-xl-end">
            <li class="breadcrumb-item">
                <a href="javascript:;">{{ $t('str.breadcrumb.companies') }}</a>
            </li>
        </ol>

        <h1 class="page-header">
            {{ $t('str.form.title.companies') }}
        </h1>

        <panel :title="$t('str.register.form.title')">
            <form>
                <fieldset>
                    <div v-if="data._id" class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="idField">{{ $t('str.register.id.field') }}</label>
                            <input v-model="data._id" disabled class="form-control" type="text" id="idField" />
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                            <select disabled v-model="data.status" class="form-control" id="statusField">
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
                                id="nameField"
                                :placeholder="$t('str.register.company.name.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.company.name.required') }}</div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="typePersonField">{{ $t('str.register.company.person.type.field') }}</label>
                            <select class="form-select" @change="onChangeDocument" v-model="data.documentType">
                                <option value="" selected>{{ $t('str.register.select.placeholder') }}</option>
                                <option value="CPF">{{ $t('str.person.type.individual') }}</option>
                                <option value="CNPJ">{{ $t('str.person.type.legal') }}</option>
                            </select>
                        </div>
                        <!-- {{ data.documentType + ' ' + data.document }} -->
                        <div v-if="data.documentType === 'CPF'" class="col-md-4 mb-3">
                            <label class="form-label" for="cpfField">{{ $t('str.document.type.cpf') }}</label>
                            <input v-model="data.document" class="form-control" type="text" id="cpfField" :placeholder="$t('str.register.company.document.placeholder')" />
                        </div>

                        <div v-if="data.documentType === 'CNPJ'" class="col-md-4 mb-3">
                            <label class="form-label" for="cnpjField">{{ $t('str.document.type.cnpj') }}</label>
                            <masked-input
                                v-model="data.document"
                                pattern="11\.111\.111\/1111\-11"
                                class="form-control"
                                type="text"
                                id="cnpjField"
                                :placeholder="$t('str.register.company.document.placeholder')"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="emailField">{{ $t('str.register.company.email.field') }}</label>
                            <input class="form-control" v-model="data.email" type="text" id="emailField" :placeholder="$t('str.register.company.email.placeholder')" />
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="primaryPhoneField">{{ $t('str.register.company.primaryPhone.field') }}</label>
                            <masked-input
                                v-model="data.primaryPhone"
                                pattern="\(11\) 11111\-1111"
                                class="form-control"
                                type="text"
                                id="primaryPhoneField"
                                :placeholder="$t('str.register.company.primaryPhone.placeholder')"
                            />
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="secondaryPhoneField">{{ $t('str.register.company.secondaryPhone.field') }}</label>
                            <masked-input
                                v-model="data.secondaryPhone"
                                pattern="\(11\) 11111\-1111"
                                class="form-control"
                                type="text"
                                id="secondaryPhoneField"
                                :placeholder="$t('str.register.company.secondaryPhone.placeholder')"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="cepField">{{ $t('str.register.company.cep.field') }}</label>
                            <masked-input
                                @input="inputCep()"
                                v-model="data.address.cep"
                                v-bind:class="checkRequiredField('cep') ? 'is-invalid' : ''"
                                pattern="11111-111"
                                class="form-control"
                                type="text"
                                id="cepField"
                                :placeholder="$t('str.register.company.cep.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.company.cep.required') }}</div>
                        </div>
                        <div v-if="data.address.cep.length === 9 && !hasUnderline()" class="col-md-4 mb-3">
                            <label class="form-label" for="streetField">{{ $t('str.register.company.street.field') }}</label>
                            <input
                                v-model="data.address.address"
                                v-bind:class="checkRequiredField('address') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('address')"
                                class="form-control"
                                type="text"
                                id="streetField"
                                :placeholder="$t('str.register.company.street.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.company.cep.required') }}</div>
                        </div>
                        <div v-if="data.address.cep.length === 9 && !hasUnderline()" class="col-md-4 mb-3">
                            <label class="form-label" for="numberField">{{ $t('str.register.company.number.field') }}</label>
                            <input
                                v-model="data.address.number"
                                v-bind:class="checkRequiredField('number') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('number')"
                                class="form-control"
                                type="number"
                                id="numberField"
                                :placeholder="$t('str.register.company.number.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.company.cep.required') }}</div>
                        </div>
                    </div>
                    <div class="row" v-if="data.address.cep.length === 9 && !hasUnderline()">
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
                                id="districtField"
                                :placeholder="$t('str.register.company.district.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.company.cep.required') }}</div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="cityField">{{ $t('str.register.company.city.field') }}</label>
                            <input
                                v-model="data.address.city"
                                v-bind:class="checkRequiredField('city') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('city')"
                                class="form-control"
                                type="text"
                                id="cityField"
                                :placeholder="$t('str.register.company.city.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.company.cep.required') }}</div>
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
                        <div class="d-flex">
                            <div class="col-md-4 mb-3">
                                <label class="form-label" for="numberField">{{ $t('str.register.company.logo.field') }}</label>
                                <a v-if="data?.logoURL" class="w-lg-250px w-100px" href="javascript:;">
                                    <img v-bind:src="`${domain}${data.logoURL}`" alt="" class="mw-100 rounded" />
                                    <!-- <img src="../../../assets/images/logo-defender.png" alt="" class="mw-100 rounded" /> -->
                                </a>
                                <!-- <img style="object-fit: contain" v-bind:src="`${domain}${data.logoURL}`" alt="image" height="200" width="400" /> -->
                                <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" class="form-control" />
                            </div>
                        </div>
                    </div>
                    <div class="btn-center mt-4 mb-2">
                        <button @click="checkForm" type="submit" class="btn btn-primary w-200px me-10px">{{ $t('str.btn.save') }}</button>
                        <button @click="clearForm" type="submit" class="btn btn-default w-200px">{{ $t('str.btn.clear.fields') }}</button>
                        <button v-if="data._id && data.status === 'ACTIVE'" v-on:click="confirmArchive" type="submit" class="ms-10px btn btn-warning w-200px">
                            {{ $t('str.btn.archive') }}
                        </button>
                    </div>
                </fieldset>
            </form>
        </panel>
        <!-- <notifications group="bottom-left" position="bottom left" :speed="500" /> -->
        <listCompany v-on:load-item="selectItem" />
    </div>
</template>

<script>
import ListCompany from './ListCompany.vue'
import Controller from './CrtCompany.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

import { STATES } from '../../../utils/states.js'

export default {
    components: {
        ListCompany,
    },
    data() {
        return {
            states: STATES,
            domain: null,
            file: null,
            valuekey: 0,
            errors: [],
            data: {
                name: '',
                fantasyName: '',
                DocumentType: '',
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
    mounted() {
        Controller.init(this)
    },
    computed: {},
    methods: Controller.methods,
}
</script>
