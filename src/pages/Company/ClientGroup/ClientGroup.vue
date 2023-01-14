<template>
    <div :key="valuekey">
        <ol class="breadcrumb float-xl-end">
            <li class="breadcrumb-item">
                <a href="#/groups/clients">{{ $t('str.breadcrumb.client.groups') }}</a>
            </li>
        </ol>

        <h1 class="page-header">
            {{ $t('str.form.title.client.groups') }}
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
                            <label class="form-label" for="accountField">{{ $t('str.register.client.groups.account.field') }}</label>
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
                            <div class="invalid-feedback">{{ $t('str.register.client.groups.account.required') }}</div>
                        </div>
                        <!-- {{ clients }}} -->
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="nameField">{{ $t('str.register.client.groups.name.field') }}</label>
                            <input
                                v-model="data.name"
                                class="form-control"
                                v-bind:class="checkRequiredField('name') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('name')"
                                type="text"
                                key="nameField"
                                :placeholder="$t('str.register.client.groups.name.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.client.groups.name.required') }}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 mb-3">
                            <label class="form-label" for="clientsField">{{ $t('str.register.client.groups.clients.field') }}</label>
                            <span v-show="data.account" @click="removeAllClients()" disabled class="badge bg-dark rounded-5 cursor_pointer f-right badge-ml-5">{{
                                $t('str.register.client.group.remove.all.clients.label')
                            }}</span>
                            <span v-show="data.account" @click="selectAllClients()" disabled class="badge bg-dark rounded-5 cursor_pointer f-right">{{
                                $t('str.register.client.group.select.all.clients.label')
                            }}</span>
                            <v-select
                                v-bind:class="checkRequiredField('clients') ? 'is-invalid' : ''"
                                @open="removeRequiredField('clients')"
                                taggable
                                multiple
                                label="name"
                                key="clientsField"
                                v-model="data.clients"
                                :options="clients"
                                :create-option="client => ({ _id: '' })"
                                :placeholder="$t('str.register.select.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.client.groups.account.required') }}</div>
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
        <ListClientGroup v-on:load-item="selectItem" :isSuperAdminMaster="isSuperAdminMaster" :accounts="accounts" :clients="clients" />
    </div>
</template>

<script>
import ListClientGroup from './ListClientGroup.vue'
import Controller from './CrtClientGroup.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

import { STATES } from '../../../utils/states.js'

export default {
    components: {
        ListClientGroup,
    },
    data() {
        return {
            states: STATES,
            isLoading: false,
            errors: [],
            accounts: [],
            clients: [],
            valuekey: 0,
            isSuperAdminMaster: false,
            role: '',
            data: {
                name: '',
                clients: [],
                account: '',
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
<style lang="scss"></style>
