<template>
    <b-modal no-close-on-backdrop id="createUserModal" @hide="closeModal" :hide-footer="true" size="lg" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.breadcrumb.users') }}</h4>
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
                    <label class="form-label" for="roleField">{{ $t('str.register.user.role.field') }}</label>
                    <select
                        v-model="data.companyUser.subtype"
                        @change="changeRole"
                        class="form-select"
                        v-bind:class="checkRequiredField('role') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('role')"
                        id="roleField"
                    >
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="role in roles" :value="role.value" :key="role.value">
                            {{ $t(role.label) }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.user.role.required') }}</div>
                </div>
            </div>
            <div class="row" v-if="data.companyUser.subtype">
                <div v-if="isSuperAdminMaster" class="col-md-4 mb-3">
                    <label class="form-label" for="accountField">{{ $t('str.register.user.account.field') }}</label>
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
                    <div class="invalid-feedback">{{ $t('str.register.user.account.required') }}</div>
                </div>
                <div v-if="data.companyUser.subtype === 'OPERATOR' || data.companyUser.subtype === 'AUDITOR' || data.companyUser.subtype === 'MANAGER'" class="col-md-4 mb-3">
                    <label class="form-label" for="clientField">{{ $t('str.register.user.client.field') }}</label>
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
                    <div class="invalid-feedback">{{ $t('str.register.user.client.required') }}</div>
                </div>
                <div v-if="data.companyUser.subtype === 'MANAGER'" class="col-md-4 mb-3">
                    <label class="form-label" for="clientGroupField">{{ $t('str.register.user.clientGroup.field') }}</label>
                    <select
                        v-model="data.clientGroup"
                        @change="changeClientGroup"
                        class="form-select"
                        v-bind:class="checkRequiredField('clientGroup') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('clientGroup')"
                        id="clientGroupField"
                    >
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="clientGroup in clientGroups" :value="clientGroup._id" :key="clientGroup._id">
                            {{ clientGroup.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.user.client.required') }}</div>
                </div>

                <div v-if="data.companyUser.subtype === 'OPERATOR' || (data.companyUser.subtype === 'AUDITOR' && data.account)" class="col-md-4 mb-3">
                    <label class="form-label" for="siteField">{{ $t('str.register.user.site.field') }}</label>
                    <select v-model="data.site" class="form-select" v-bind:class="checkRequiredField('site') ? 'is-invalid' : ''" @focus="removeRequiredField('site')" id="siteField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="site in sites" :value="site._id" :key="site._id">
                            {{ site.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.user.siteGroup.required') }}</div>
                </div>

                <div v-if="data.companyUser.subtype === 'OPERATOR' || (data.companyUser.subtype === 'AUDITOR' && data.account)" class="col-md-4 mb-3">
                    <label class="form-label" for="siteGroupField">{{ $t('str.register.user.siteGroup.field') }}</label>
                    <select v-model="data.siteGroup" class="form-select" v-bind:class="checkRequiredField('siteGroup') ? 'is-invalid' : ''" @focus="removeRequiredField('siteGroup')" id="siteGroupField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="siteGroup in siteGroups" :value="siteGroup._id" :key="siteGroup._id">
                            {{ siteGroup.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.user.siteGroup.required') }}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 mb-3">
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
                <div class="col-md-4 mb-3">
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
                    <label class="form-label">{{ $t('str.register.user.email.field') }}</label>
                    <input
                        class="form-control"
                        :autocomplete="'username'"
                        v-bind:class="checkRequiredField('email') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('email')"
                        v-model="data.email"
                        type="text"
                        :placeholder="$t('str.register.user.email.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.user.email.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">{{ $t('str.register.user.password.field') }}</label>
                    <div class="input-group">
                        <input
                            class="form-control"
                            :autocomplete="'new-password'"
                            v-bind:class="checkRequiredField('password') ? 'is-invalid' : ''"
                            @focus="removeRequiredField('password')"
                            v-model="data.password"
                            v-bind:type="showPassword ? 'text' : 'password'"
                            :placeholder="$t('str.register.user.password.placeholder')"
                        />
                        <span class="input-group-text" v-on:click="showPassword = !showPassword">
                            <i v-bind:class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                        </span>
                        <div class="invalid-feedback">{{ $t('str.register.user.password.required') }}</div>
                    </div>
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
                    <div class="invalid-feedback">{{ $t('str.register.user.cep.required') }}</div>
                </div>
                <div v-if="data?.address?.cep?.length === 9" class="col-md-4 mb-3">
                    <label class="form-label" for="addressField">{{ $t('str.register.user.address.field') }}</label>
                    <input v-model="data.address.address" class="form-control" type="text" key="addressField" :placeholder="$t('str.register.user.address.placeholder')" />
                </div>
                <div v-if="data?.address?.cep?.length === 9" class="col-md-4 mb-3">
                    <label class="form-label" for="numberField">{{ $t('str.register.user.number.field') }}</label>
                    <input v-model="data.address.number" class="form-control" type="number" ref="numberField" key="numberField" :placeholder="$t('str.register.user.number.placeholder')" />
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
import Controller from './CrtUser.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()
import { user } from '../../../types/user'
import { STATES } from '../../../utils/states.js'
import { ROLES } from '../../../utils/roles.js'
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

            if (!this.data?.companyUser?.subtype) {
                this.data.companyUser = {
                    status: 'ACTIVE',
                    subtype: '',
                }
            }

            if (this.data?.siteGroup) {
                this.data.siteGroup = this.data.siteGroup._id
            } else {
                this.data.siteGroup = ''
            }

            if (this.data?.clientGroup) {
                this.data.clientGroup = this.data.clientGroup._id
            } else {
                this.data.clientGroup = ''
            }

            if (this.data.account) {
                this.clients = await Services.getClientsByAccount(this, this.data.account)
            }

            if (this.data.client) {
                this.sites = await Services.getSitesByClient(this, this.data.client)
            }

            if (this.data?.companyUser?.subtype === 'OPERATOR' || this.data?.companyUser?.subtype === 'AUDITOR') {
                this.siteGroups = await Services.getSiteGroupsByAccount(this, this.data?.account?._id)
            }

            if (this.data?.companyUser?.subtype === 'MANAGER') {
                this.clientGroups = await Services.getClientGroupsByAccount(this, this.data?.account?._id)
            }

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
            siteGroups: [],
            clientGroups: [],
            role: null,
            valuekey: 0,
            showPassword: false,
            isSuperAdminMaster: false,
            data: JSON.parse(JSON.stringify(user)),
            userObj: JSON.parse(JSON.stringify(user)),
        }
    },
    mounted() {
        Controller.init(this)
    },
    methods: Controller.methods,
}
</script>
