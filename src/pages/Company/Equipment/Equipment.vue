<template>
    <b-modal no-close-on-backdrop id="registerModal" @hide="closeModal" :hide-footer="true" size="lg" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.breadcrumb.equipment') }}</h4>
            <a class="btn-close cursor_pointer" @click="closeModal"></a>
        </template>

        <!-- Conteúdo do formulário de equipamento -->
        <div>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="accountField">{{ $t('str.register.equipment.account.field') }}</label>
                    <select v-model="data.account" @change="changeAccount" class="form-select" v-bind:class="checkRequiredField('account') ? 'is-invalid' : ''" @focus="removeRequiredField('account')">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="account in accounts" :value="account._id" :key="account._id">{{ account.name }}</option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.equipment.account.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="clientField">{{ $t('str.register.equipment.client.field') }}</label>
                    <select v-model="data.client" @change="changeClient" class="form-select" v-bind:class="checkRequiredField('client') ? 'is-invalid' : ''" @focus="removeRequiredField('client')">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="client in clients" :value="client._id" :key="client._id">{{ client.name }}</option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.equipment.client.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="siteField">{{ $t('str.register.equipment.site.field') }}</label>
                    <select v-model="data.site" class="form-select" v-bind:class="checkRequiredField('site') ? 'is-invalid' : ''" @focus="removeRequiredField('site')">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="site in sites" :value="site._id" :key="site._id">{{ site.name }}</option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.equipment.site.required') }}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="codeField">{{ $t('str.register.equipment.code.field') }}</label>
                    <input
                        v-model="data.code"
                        type="text"
                        class="form-control"
                        key="codeField"
                        v-bind:class="checkRequiredField('code') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('code')"
                        :placeholder="$t('str.register.equipment.code.placeholder')"
                        id="codeField"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.equipment.code.required') }}</div>
                </div>

                <div class="col-md-4 mb-3">
                    <label class="form-label" for="typeField">{{ $t('str.register.equipment.type.field') }}</label>
                    <select v-model="data.type" class="form-select">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option value="DEVICE-PHONE">{{ $t('str.register.equipment.type.device-phone') }}</option>
                        <option value="DEVICE-READER">{{ $t('str.register.equipment.type.device-reader') }}</option>
                    </select>
                </div>

                <div class="col-md-4 mb-3">
                    <label class="form-label" for="brandField">{{ $t('str.register.equipment.brand.field') }}</label>
                    <select v-model="data.brand" class="form-select">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option value="ZOOY">ZOOY</option>
                        <option value="JWM">JWM</option>
                        <option value="OTHER">{{ $t('str.register.equipment.brand.other') }}</option>
                    </select>
                </div>
            </div>

            <!-- <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="vigilantField">{{ $t('str.register.equipment.guard.field') }}</label>
                    <select v-model="data.user" class="form-select" id="vigilantField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="vigilant in vigilants" :value="vigilant._id" :key="vigilant._id">
                            {{ vigilant.fullName }}
                        </option>
                    </select>
                </div>
            </div> -->
        </div>

        <div class="btn-center mt-4 mb-2">
            <button @click="checkForm" type="submit" class="btn btn-primary is-loading w-25 m-2">
                <i v-if="isLoading === true" class="fas fa-spinner fa-pulse"></i>
                {{ $t('str.btn.save') }}
            </button>
            <button @click="closeModal" type="submit" class="btn btn-default w-25 m-2">{{ $t('str.btn.close') }}</button>
        </div>

        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </b-modal>
</template>

<script>
import { equipment } from '../../../types/equipment'
import Controller from './CrtEquipment.vue'
import Services from '../../../common/Services.vue'
export default {
    props: {
        selectedData: {
            type: Object,
            default: () => {},
        },
        accountList: {
            type: Array,
            default: () => [],
        },
        clientList: {
            type: Array,
            default: () => [],
        },
        siteList: {
            type: Array,
            default: () => [],
        },
    },
    watch: {
        selectedData: async function () {
            if (!this?.selectedData) return

            const data = JSON.parse(JSON.stringify(this.selectedData))

            if (data.account) {
                this.clients = await Services.getClientsByAccount(this, data.account)
            }

            if (data.client) {
                this.sites = await Services.getSitesByClient(this, data.client)
            }

            if (!data?.brand) {
                data.brand = ''
            }

            if (!data?.type) {
                data.type = ''
            }

            // if (data.site) {
            //     this.vigilants = await Services.getVigilantsBySite(this, data.site)
            // } else {
            //     this.vigilants = await Services.getVigilantsByClient(this, data.client)
            // }

            this.data = data
        },
        accountList: async function () {
            this.accounts = this.accountList
        },
        clientList: async function () {
            this.clients = this.clientList
        },
        siteList: async function () {
            this.sites = this.siteList
        },
    },
    data() {
        return {
            domain: null,
            isLoading: false,
            errors: [],
            data: JSON.parse(JSON.stringify(equipment)),
            equipmentObj: JSON.parse(JSON.stringify(equipment)),
            accounts: [],
            clients: [],
            sites: [],
        }
    },
    mounted() {
        Controller.init(this)
    },
    methods: Controller.methods,
}
</script>
