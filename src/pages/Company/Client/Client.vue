<template>
    <div :key="valuekey">
        <ol class="breadcrumb float-xl-end">
            <li class="breadcrumb-item">
                <a href="javascript:;">{{ $t('str.breadcrumb.clients') }}</a>
            </li>
        </ol>

        <h1 class="page-header">
            {{ $t('str.form.title.clients') }}
        </h1>
        <panel :title="$t('str.register.form.title')">
            <form>
                <fieldset>
                    <div v-if="data._id" class="row">
                        <!-- <div class="col-md-4 mb-3">
                            <label class="form-label" for="idField">{{ $t('str.register.id.field') }}</label>
                            <input v-model="data._id" disabled class="form-control" type="text" id="idField" />
                        </div> -->
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                            <select v-model="data.status" class="form-control" id="statusField">
                                <option value="ACTIVE">{{ $t('str.register.status.active') }}</option>
                                <option value="ARCHIVED">{{ $t('str.register.status.archived') }}</option>
                            </select>
                        </div>
                    </div>
                    <div v-if="isSuperAdminMaster" class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="accountField">{{ $t('str.register.client.account.field') }}</label>
                            <select v-model="data.account" class="form-select" v-bind:class="checkRequiredField('account') ? 'is-invalid' : ''" @focus="removeRequiredField('account')" id="accountField">
                                <option value="">{{ $t('str.register.select.placeholder') }}</option>
                                <option v-for="account in accounts" :value="account._id" :key="account._id">
                                    {{ account.name }}
                                </option>
                            </select>
                            <div class="invalid-feedback">{{ $t('str.register.client.account.required') }}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="nameField">{{ $t('str.register.client.name.field') }}</label>
                            <input
                                v-model="data.name"
                                class="form-control"
                                v-bind:class="checkRequiredField('name') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('name')"
                                type="text"
                                key="nameField"
                                :placeholder="$t('str.register.client.name.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.client.name.required') }}</div>
                        </div>

                        <div class="col-md-4 mb-3">
                            <label class="form-label">{{ $t('str.register.client.email.field') }}</label>
                            <input class="form-control" v-model="data.email" type="text" :placeholder="$t('str.register.client.email.placeholder')" />
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="primaryPhoneField">{{ $t('str.register.client.phone.field') }}</label>
                            <input
                                key="primaryPhoneField"
                                type="tel"
                                v-mask="['(##) ####-####', '(##) #####-####']"
                                v-model="data.primaryPhone"
                                class="form-control"
                                :placeholder="$t('str.register.client.phone.placeholder')"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label">{{ $t('str.register.client.owner.field') }}</label>
                            <input class="form-control" v-model="data.owner" type="text" :placeholder="$t('str.register.client.owner.placeholder')" />
                        </div>
                    </div>

                    <div class="btn-center mt-4 mb-2">
                        <button @click="checkForm" type="submit" class="btn btn-primary w-200px me-10px is-loading">
                            <i v-if="isLoading === true" class="fas fa-spinner fa-pulse"></i>
                            {{ $t('str.btn.save') }}
                        </button>
                        <button @click="clearForm" type="submit" class="btn btn-default w-200px">{{ $t('str.btn.clear.fields') }}</button>
                        <button v-if="data._id && data.status === 'ACTIVE'" v-on:click="confirmArchive" type="submit" class="ms-10px btn btn-warning w-200px">
                            {{ $t('str.btn.archive') }}
                        </button>
                    </div>
                </fieldset>
            </form>
        </panel>
        <notifications group="bottom-right" position="bottom right" :speed="500" />
        <ListClient v-on:load-item="selectItem" :accounts="accounts" />
    </div>
</template>

<script>
import ListClient from './ListClient.vue'
import Controller from './CrtClient.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

import { STATES } from '../../../utils/states.js'

export default {
    components: {
        ListClient,
    },
    data() {
        return {
            states: STATES,
            domain: null,
            file: null,
            isLoading: false,
            errors: [],
            accounts: [],
            valuekey: 0,
            isSuperAdminMaster: false,
            data: {
                name: '',
                email: '',
                primaryPhone: '',
                owner: '',
                account: '',
                type: 'CLIENT',
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
