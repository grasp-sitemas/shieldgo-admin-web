<template>
    <b-modal id="checkPointModal" :hide-footer="true" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.modal.check.points.title') }}</h4>
            <a class="btn-close cursor_pointer" v-on:click="clearForm"></a>
        </template>
        <div class="container_card_options">
            <label class="option_item">
                <input :checked="data.type === 'QRCODE'" @change="handleCheckpointOption('QRCODE')" type="radio" class="checkbox" />
                <div :class="{ option_inner: true, qrcode: data.type === 'QRCODE' }">
                    <div class="tickmark"></div>
                    <i class="fa-solid fa-qrcode fa-3x" />
                    <div class="name">{{ $t('str.modal.check.points.qr.code') }}</div>
                </div>
            </label>
            <label class="option_item">
                <input :checked="data.type === 'SUPERVISION'" @change="handleCheckpointOption('SUPERVISION')" type="radio" class="checkbox" />
                <div :class="{ option_inner: true, qrcode: data.type === 'SUPERVISION' }">
                    <div class="tickmark"></div>
                    <i class="fas fa-user-shield fa-3x"></i>
                    <div class="name">{{ $t('str.modal.check.points.supervision') }}</div>
                </div>
            </label>
            <label class="option_item">
                <input :checked="data.type === 'TAG_RFID_125'" @change="handleCheckpointOption('TAG_RFID_125')" type="radio" class="checkbox" />
                <div :class="{ option_inner: true, qrcode: data.type === 'TAG_RFID_125' }">
                    <div class="tickmark"></div>
                    <i class="fas fa-tags fa-3x"></i>
                    <div class="name">{{ $t('str.modal.check.points.tag.rfid') }}</div>
                </div>
            </label>
        </div>
        <div v-if="data.type === 'QRCODE' || data.type === 'SUPERVISION' || data.type === 'TAG_RFID_125'" class="mt-4">
            <div class="row">
                <div v-if="isSuperAdminMaster" class="col-md-6 mt-3">
                    <label class="form-label" for="accountField">{{ $t('str.register.incident.account.field') }}</label>
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
                    <div class="invalid-feedback">{{ $t('str.register.incident.account.required') }}</div>
                </div>
                <div v-if="role === 'SUPER_ADMIN_MASTER' || role === 'ADMIN' || role === 'MANAGER'" class="col-md-6 mt-3">
                    <label class="form-label" for="clientField">{{ $t('str.register.incident.client.field') }}</label>
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
                    <div class="invalid-feedback">{{ $t('str.register.incident.client.required') }}</div>
                </div>
                <div v-if="data.type === 'QRCODE' || data.type === 'TAG_RFID_125'" class="col-md-6 mt-3">
                    <label class="form-label" for="siteField">{{ $t('str.register.incident.site.field') }}</label>
                    <select v-model="data.site" class="form-select" v-bind:class="checkRequiredField('site') ? 'is-invalid' : ''" @focus="removeRequiredField('site')" id="siteField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="site in sites" :value="site._id" :key="site._id">
                            {{ site.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.incident.site.required') }}</div>
                </div>
                <div class="col-md-6 mt-3">
                    <label class="form-label" for="quantityField">{{ $t('str.register.check.point.quantity.field') }}</label>
                    <input
                        v-model="quantity"
                        v-bind:class="checkRequiredField('quantity') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('quantity')"
                        class="form-control"
                        type="number"
                        key="quantityField"
                        min="1"
                        max="100"
                        maxlength="3"
                        :placeholder="$t('str.register.check.point.quantity.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.check.point.quantity.required') }}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 mb-3 mt-3">
                    <div class="btn-center mt-4 mb-2">
                        <button @click="checkForm" type="submit" class="btn btn-primary w-200px me-10px is-loading">
                            <i v-if="isLoading === true" class="fas fa-spinner fa-pulse"></i>
                            {{ $t('str.btn.save') }}
                        </button>
                        <button @click="closeModal()" type="submit" class="ms-10px btn btn-secondary w-200px">
                            {{ $t('str.btn.close') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </b-modal>
</template>

<script>
import Controller from './CrtCheckPointModal.vue'
export default {
    props: {
        accounts: {
            type: Array,
            default: () => [],
        },
        clients: {
            type: Array,
            default: () => [],
        },
        sites: {
            type: Array,
            default: () => [],
        },
        isSuperAdminMaster: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            default: () => '',
        },
    },
    watch: {
        role: function () {
            if (this.role === 'ADMIN') {
                this.data.account = this.$session.get('user')?.account?._id
            } else if (this.role === 'MANAGER') {
                this.data.account = this.$session.get('user')?.account?._id
                this.data.client = this.$session.get('user')?.client?._id
            } else if (this.role === 'OPERATOR') {
                this.data.account = this.$session.get('user')?.account?._id
                this.data.client = this.$session.get('user')?.client?._id
            }
        },
    },
    data() {
        return {
            errors: [],
            isSelected: false,
            isSupervisionSelected: false,
            isLoading: false,
            quantity: null,
            data: {
                account: '',
                client: '',
                site: '',
                type: '',
                status: 'ACTIVE',
            },
        }
    },
    methods: Controller.methods,
}
</script>

<style scoped>
.option_item .option_inner {
    padding: 40px 20px !important;
}
</style>
