<template>
    <div :key="valuekey">
        <ol class="breadcrumb float-xl-end">
            <li class="breadcrumb-item">
                <a href="#/guard-groups">{{ $t('str.breadcrumb.guard.groups') }}</a>
            </li>
        </ol>

        <h1 class="page-header">
            {{ $t('str.form.title.guard.groups') }}
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
                            <label class="form-label" for="accountField">{{ $t('str.register.guard.groups.account.field') }}</label>
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
                            <div class="invalid-feedback">{{ $t('str.register.guard.groups.account.required') }}</div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="clientField">{{ $t('str.register.guard.groups.client.field') }}</label>
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
                            <div class="invalid-feedback">{{ $t('str.register.guard.groups.client.required') }}</div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="siteField">{{ $t('str.register.guard.groups.site.field') }}</label>
                            <select
                                v-model="data.site"
                                @change="changeSite"
                                class="form-select"
                                v-bind:class="checkRequiredField('site') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('site')"
                                id="siteField"
                            >
                                <option value="">{{ $t('str.register.select.placeholder') }}</option>
                                <option v-for="site in sites" :value="site._id" :key="site._id">
                                    {{ site.name }}
                                </option>
                            </select>
                            <div class="invalid-feedback">{{ $t('str.register.guard.groups.site.required') }}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="nameField">{{ $t('str.register.guard.groups.name.field') }}</label>
                            <input
                                v-model="data.name"
                                class="form-control"
                                v-bind:class="checkRequiredField('name') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('name')"
                                type="text"
                                key="nameField"
                                :placeholder="$t('str.register.guard.groups.name.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.guard.groups.name.required') }}</div>
                        </div>
                        <div class="col-md-8 mb-3">
                            <label class="form-label" for="vigilantsField">{{ $t('str.register.guard.groups.vigilants.field') }}</label>
                            <span v-show="data.site" @click="removeAllVigilants()" disabled class="badge bg-dark rounded-5 cursor_pointer f-right badge-ml-5">{{
                                $t('str.register.guard.group.remove.all.vigilants.label')
                            }}</span>
                            <span v-show="data.site" @click="selectAllVigilants()" disabled class="badge bg-dark rounded-5 cursor_pointer f-right">{{
                                $t('str.register.guard.group.select.all.vigilants.label')
                            }}</span>
                            <v-select
                                taggable
                                multiple
                                label="firstName"
                                key="vigilantsField"
                                v-model="data.vigilants"
                                :options="vigilants"
                                :create-option="vigilant => ({ _id: '' })"
                                :placeholder="$t('str.register.select.placeholder')"
                            />
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
        <ListGuardGroup v-on:load-item="selectItem" :isSuperAdminMaster="isSuperAdminMaster" :accounts="accounts" />
    </div>
</template>

<script>
import ListGuardGroup from './ListGuardGroup.vue'
import Controller from './CrtGuardGroup.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

import { STATES } from '../../../utils/states.js'
import { ROLES } from '../../../utils/roles.js'

export default {
    components: {
        ListGuardGroup,
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
            vigilants: [],
            valuekey: 0,
            isSuperAdminMaster: false,
            data: {
                name: '',
                vigilants: [],
                account: '',
                client: '',
                site: '',
                status: 'ACTIVE',
            },
            options: [
                {
                    title: 'HTML5',
                    author: {
                        firstName: 'Remy',
                        lastName: 'Sharp',
                    },
                },
                {
                    title: 'HTML5',
                    author: {
                        firstName: 'Remy',
                        lastName: 'Sharp',
                    },
                },
                {
                    title: 'HTML5',
                    author: {
                        firstName: 'Remy',
                        lastName: 'Sharp',
                    },
                },
            ],
        }
    },
    mounted() {
        Controller.init(this)
    },
    methods: Controller.methods,
}
</script>
<style lang="scss"></style>
