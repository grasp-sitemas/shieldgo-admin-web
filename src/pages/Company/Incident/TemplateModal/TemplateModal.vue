<template>
    <b-modal id="templateModal" :hide-footer="true" class="modal-message" size="lg">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.modal.templates.title') }}</h4>
            <a class="btn-close cursor_pointer" @click="$bvModal.hide('templateModal')"></a>
        </template>

        <div class="container_card_options">
            <label class="option_item" v-for="(item, index) in templates" :key="index">
                <input @change="handleTemplate(item)" v-model="template" type="checkbox" class="checkbox" />
                <div class="option_inner qrcode">
                    <div class="tickmark"></div>
                    <div class="form-label">{{ $t(item.name) }}</div>
                </div>
            </label>
        </div>
        <!-- <div v-if="isSelected && template?.incidents">
            <ul class="mb-3px"  v-for="incident in template.incidents"  :key="incident" >
                <span class="badge bg-success">{{ $t(incident.label) }}</span>
            </ul>
        </div> -->

        <div class="row mt-3">
            <div v-if="isSuperAdminMaster" class="col-md-4 mb-3">
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
            <div class="col-md-4 mb-3">
                <label class="form-label" for="clientField">{{ $t('str.register.incident.client.field') }}</label>
                <select v-model="data.client" @change="changeClient" class="form-select" v-bind:class="checkRequiredField('client') ? 'is-invalid' : ''" @focus="removeRequiredField('client')" id="clientField">
                    <option value="">{{ $t('str.register.select.placeholder') }}</option>
                    <option v-for="client in clients" :value="client._id" :key="client._id">
                        {{ client.name }}
                    </option>
                </select>
                <div class="invalid-feedback">{{ $t('str.register.incident.client.required') }}</div>
            </div>
            <div class="col-md-4 mb-3">
                <label class="form-label" for="siteField">{{ $t('str.register.incident.site.field') }}</label>
                <select v-model="data.site" class="form-select" v-bind:class="checkRequiredField('site') ? 'is-invalid' : ''" @focus="removeRequiredField('site')" id="siteField">
                    <option value="">{{ $t('str.register.select.placeholder') }}</option>
                    <option v-for="site in listSites" :value="site._id" :key="site._id">
                        {{ site.name }}
                    </option>
                </select>
                <div class="invalid-feedback">{{ $t('str.register.incident.site.required') }}</div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12 mb-3">
                <div class="btn-center mt-4 mb-2">
                    <button :disabled="!isSelected || template?.incidents?.length === 0" @click="checkForm" type="submit" class="btn btn-primary w-200px me-10px is-loading">
                        <i v-if="isLoading === true" class="fas fa-spinner fa-pulse"></i>
                        {{ $t('str.btn.save') }}
                    </button>
                    <button @click="$bvModal.hide('templateModal')" type="submit" class="ms-10px btn btn-secondary w-200px">
                        {{ $t('str.btn.close') }}
                    </button>
                </div>
            </div>
        </div>
        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </b-modal>
</template>

<script>
import Controller from './CrtTemplateModal.vue'
export default {
    props: {
        templates: {
            type: Array,
            default: () => [],
        },
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
    },
    watch: {
        sites: function () {
            this.listSites = this?.sites
        },
    },
    data() {
        return {
            errors: [],
            isSelected: false,
            isLoading: false,
            template: null,
            listSites: [],
            data: {
                name: '',
                priority: null,
                account: '',
                client: '',
                site: '',
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

<style lang="scss" scoped></style>
