<template>
    <div :key="valuekey">
        <ol class="breadcrumb float-xl-end">
            <li class="breadcrumb-item">
                <a href="#/incidents">{{ $t('str.breadcrumb.incidents') }}</a>
            </li>
        </ol>

        <h1 class="page-header">
            {{ $t('str.form.title.incidents') }}
        </h1>

        <panel :title="$t('str.register.form.title')">
            <form>
                <fieldset>
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
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="siteField">{{ $t('str.register.incident.site.field') }}</label>
                            <select v-model="data.site" class="form-select" v-bind:class="checkRequiredField('site') ? 'is-invalid' : ''" @focus="removeRequiredField('site')" id="siteField">
                                <option value="">{{ $t('str.register.select.placeholder') }}</option>
                                <option v-for="site in sites" :value="site._id" :key="site._id">
                                    {{ site.name }}
                                </option>
                            </select>
                            <div class="invalid-feedback">{{ $t('str.register.incident.site.required') }}</div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="nameField">{{ $t('str.register.incident.name.field') }}</label>
                            <input
                                v-model="data.name"
                                class="form-control"
                                v-bind:class="checkRequiredField('name') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('name')"
                                type="text"
                                key="nameField"
                                :placeholder="$t('str.register.incident.name.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.incident.name.required') }}</div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="priorityField">{{ $t('str.register.incident.priority.field') }}</label>
                            <select v-model="data.priority" class="form-select" v-bind:class="checkRequiredField('priority') ? 'is-invalid' : ''" @focus="removeRequiredField('priority')" id="priorityField">
                                <option :value="null">{{ $t('str.register.select.placeholder') }}</option>
                                <option v-for="priority in priorities" :value="priority.value" :key="priority.value">
                                    {{ $t(priority.name) }}
                                </option>
                            </select>
                            <div class="invalid-feedback">{{ $t('str.register.incident.priority.required') }}</div>
                        </div>
                    </div>

                    <div class="btn-center mt-4 mb-2">
                        <button @click="checkForm" type="submit" class="btn btn-primary w-200px me-10px is-loading">
                            <i v-if="isLoading" class="fas fa-spinner fa-pulse" />
                            {{ $t('str.btn.save') }}
                        </button>
                        <button @click="clearForm" type="submit" class="btn btn-default w-200px">{{ $t('str.btn.new.form') }}</button>
                        <button v-if="data._id && data.status === 'ACTIVE'" v-on:click="confirmArchive" type="submit" class="ms-10px btn btn-warning w-200px">
                            {{ $t('str.btn.archive') }}
                        </button>
                        <button v-if="!data._id" v-b-modal.templateModal type="submit" class="ms-10px btn btn-warning w-200px">
                            {{ $t('str.btn.template') }}
                        </button>
                    </div>
                </fieldset>
            </form>
        </panel>
        <notifications group="bottom-right" position="bottom right" :speed="500" />
        <TemplateModal :templates="templates" :isSuperAdminMaster="isSuperAdminMaster" :accounts="accounts" :clients="clients" />
        <ListIncident v-on:load-item="selectItem" :isSuperAdminMaster="isSuperAdminMaster" :accounts="accounts" :clients="clients" />
    </div>
</template>
<script>
import ListIncident from './ListIncident.vue'
import TemplateModal from './TemplateModal/TemplateModal.vue'
import Controller from './CrtIncident.vue'
import { INCIDENT_TEMPLATES_PT, INCIDENT_TEMPLATES_EN } from './utils/incidents.js'
import Vue from 'vue'
import { incident } from '../../../types/incident'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        ListIncident,
        TemplateModal,
    },
    data() {
        return {
            isSuperAdminMaster: false,
            isLoading: false,
            errors: [],
            accounts: [],
            clients: [],
            sites: [],
            templates: [],
            valuekey: 0,
            incidentObj: incident,
            data: incident,
            priorities: [
                {
                    value: 2,
                    name: 'LOW',
                },
                {
                    value: 1,
                    name: 'MEDIUM',
                },

                {
                    value: 0,
                    name: 'HIGH',
                },
            ],
        }
    },
    methods: Controller.methods,
    mounted() {
        Controller.init(this)
    },
    created() {
        const state = this
        state.$registerEvent.$on('changeLanguage', function () {
            const language = state.$session.get('user')?.language
            state.templates = language === 'pt' ? INCIDENT_TEMPLATES_PT : INCIDENT_TEMPLATES_EN
        })
    },
}
</script>
