<template>
    <div v-if="!isLoading">
        <ol class="breadcrumb float-xl-end">
            <li class="breadcrumb-item">
                <a href="#/profile">{{ $t('str.breadcrumb.profile') }}</a>
            </li>
        </ol>
        <h1 class="page-header">
            {{ $t('str.user.profile.title') }}
        </h1>

        <panel :title="$t('str.form.title')">
            <form>
                <fieldset>
                    <div v-if="data._id" class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                            <select disabled v-model="data.status" class="form-select" id="statusField">
                                <option value="ACTIVE">{{ $t('str.register.status.active') }}</option>
                                <option value="ARCHIVED">{{ $t('str.register.status.archived') }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="firstNameField">{{ $t('str.register.user.first.name.field') }}</label>
                            <input
                                v-model="data.firstName"
                                class="form-control"
                                v-bind:class="checkRequiredField('firstName') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('firstName')"
                                type="text"
                                key="firstNameField"
                                :placeholder="$t('str.register.user.first.name.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.user.first.name.required') }}</div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="lastNameField">{{ $t('str.register.user.last.name.field') }}</label>
                            <input
                                v-model="data.lastName"
                                class="form-control"
                                v-bind:class="checkRequiredField('lastName') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('lastName')"
                                type="text"
                                key="lastNameField"
                                :placeholder="$t('str.register.user.last.name.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.user.last.name.required') }}</div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">{{ $t('str.register.user.email.field') }}</label>
                            <input
                                class="form-control"
                                v-bind:class="checkRequiredField('email') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('email')"
                                v-model="data.email"
                                type="text"
                                :placeholder="$t('str.register.user.email.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.user.email.required') }}</div>
                        </div>
                        <div class="col-md-6 mb-3">
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
                            <label class="form-label" for="cepField">{{ $t('str.register.user.cep.field') }}</label>
                            <input
                                type="tel"
                                v-mask="'#####-###'"
                                key="cepField"
                                @input="inputCep()"
                                @keyup.delete="handleCEPDelete"
                                v-model="data.address.cep"
                                class="form-control"
                                :placeholder="$t('str.register.user.cep.placeholder')"
                            />
                        </div>
                        <div v-if="data?.address?.cep?.length === 9" class="col-md-4 mb-3">
                            <label class="form-label" for="addressField">{{ $t('str.register.user.address.field') }}</label>
                            <input v-model="data.address.address" class="form-control" type="text" key="addressField" :placeholder="$t('str.register.user.address.placeholder')" />
                        </div>
                        <div v-if="data?.address?.cep?.length === 9" class="col-md-4 mb-3">
                            <label class="form-label" for="numberField">{{ $t('str.register.user.number.field') }}</label>
                            <input v-model="data.address.number" class="form-control" type="number" key="numberField" ref="numberField" :placeholder="$t('str.register.user.number.placeholder')" />
                        </div>
                    </div>
                    <div class="row" v-if="data?.address?.cep?.length === 9">
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="complementField">{{ $t('str.register.user.complement.field') }}</label>
                            <input v-model="data.address.complement" class="form-control" type="text" id="complementField" :placeholder="$t('str.register.user.complement.placeholder')" />
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="districtField">{{ $t('str.register.user.district.field') }}</label>
                            <input v-model="data.address.neighborhood" class="form-control" type="text" key="districtField" :placeholder="$t('str.register.user.district.placeholder')" />
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="cityField">{{ $t('str.register.user.city.field') }}</label>
                            <input v-model="data.address.city" class="form-control" type="text" key="cityField" :placeholder="$t('str.register.user.city.placeholder')" />
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="stateField">{{ $t('str.register.user.state.field') }}</label>
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
                                <label class="form-label" for="numberField">{{ $t('str.register.user.perfil.photo.field') }}</label>

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
                        <button v-on:click="checkForm" type="submit" class="btn btn-primary w-200px me-10px is-loading">
                            <i v-if="isProcessing === true" class="fas fa-spinner fa-pulse"></i>
                            {{ $t('str.btn.save') }}
                        </button>
                    </div>

                    <Spinner v-show="isLoading" />
                </fieldset>
            </form>
        </panel>
        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </div>
    <div v-else class="center-spinner">
        <i class="fas fa-spinner fa-spin" />
    </div>
</template>

<script>
import Controller from './CrtProfile.vue'
import { STATES } from '../../../utils/states.js'
export default {
    data() {
        return {
            states: STATES,
            domain: null,
            file: null,
            isLoading: true,
            isProcessing: false,
            errors: [],
            data: {
                firstName: '',
                lastName: '',
                email: '',
                primaryPhone: '',
                secondaryPhone: '',
                photoURL: '',
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
                type: 'USER-COMPANY',
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
