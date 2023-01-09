<template>
    <div :key="valuekey">
        <ol class="breadcrumb float-xl-end">
            <li class="breadcrumb-item">
                <a href="#/check.points">{{ $t('str.breadcrumb.patrol.points') }}</a>
            </li>
        </ol>

        <h1 class="page-header">
            {{ $t('str.form.title.patrol.points') }}
        </h1>

        <panel v-if="data._id" :title="$t('str.register.form.title')">
            <form>
                <fieldset>
                    <div v-if="data._id" class="row">
                        <div class="col-md-3 mb-3">
                            <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                            <select v-model="data.status" class="form-select" id="statusField">
                                <option value="ACTIVE">{{ $t('str.register.status.active') }}</option>
                                <option value="ARCHIVED">{{ $t('str.register.status.archived') }}</option>
                            </select>
                        </div>
                        <div v-if="isSuperAdminMaster" class="col-md-3 mb-3">
                            <label class="form-label" for="accountField">{{ $t('str.register.check.point.account.field') }}</label>
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
                            <div class="invalid-feedback">{{ $t('str.register.check.point.account.required') }}</div>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label" for="clientField">{{ $t('str.register.check.point.client.field') }}</label>
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
                            <div class="invalid-feedback">{{ $t('str.register.check.point.client.required') }}</div>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label" for="siteField">{{ $t('str.register.check.point.site.field') }}</label>
                            <select v-model="data.site" class="form-select" v-bind:class="checkRequiredField('site') ? 'is-invalid' : ''" @focus="removeRequiredField('site')" id="siteField">
                                <option value="">{{ $t('str.register.select.placeholder') }}</option>
                                <option v-for="site in sites" :value="site._id" :key="site._id">
                                    {{ site.name }}
                                </option>
                            </select>
                            <div class="invalid-feedback">{{ $t('str.register.check.point.site.required') }}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-12">
                                    <Map :location="[Number(data?.geolocation?.latitude), Number(data?.geolocation?.longitude)]" :radius="data?.radius" />
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label" for="nameField">{{ $t('str.register.check.point.name.field') }}</label>
                                    <input
                                        v-model="data.name"
                                        class="form-control"
                                        v-bind:class="checkRequiredField('name') ? 'is-invalid' : ''"
                                        @focus="removeRequiredField('name')"
                                        type="text"
                                        key="nameField"
                                        :placeholder="$t('str.register.check.point.name.placeholder')"
                                    />
                                    <div class="invalid-feedback">{{ $t('str.register.check.point.name.required') }}</div>
                                </div>
                                <div class="col-md-12 mb-3">
                                    <label class="form-label" for="noteField">{{ $t('str.register.check.point.note.field') }}</label>
                                    <textarea v-model="data.notes" key="noteField" style="resize: none" class="form-control" rows="3" :placeholder="$t('str.register.check.point.note.placeholder')"></textarea>
                                </div>

                                <div class="col-md-12 mb-3">
                                    <label class="form-label" for="latitudeField">{{ $t('str.register.check.point.latitude.field') }}</label>
                                    <input
                                        type="text"
                                        v-mask="['-##.######', '##.######']"
                                        key="latitudeField"
                                        v-model="data.geolocation.latitude"
                                        class="form-control"
                                        :placeholder="$t('str.register.check.point.latitude.placeholder')"
                                    />
                                </div>
                                <div class="col-md-12 mb-3">
                                    <label class="form-label" for="longitudeField">{{ $t('str.register.check.point.longitude.field') }}</label>
                                    <input
                                        type="text"
                                        v-mask="['-##.######', '##.######']"
                                        key="longitudeField"
                                        v-model="data.geolocation.longitude"
                                        class="form-control"
                                        :placeholder="$t('str.register.check.point.longitude.placeholder')"
                                    />
                                </div>
                                <div class="col-md-12 mb-3">
                                    <label class="form-label" for="radiusField">{{ $t('str.register.check.point.radius.field') }}</label>
                                    <input
                                        @input="checkRangeValue"
                                        @blur="checkRangeValue"
                                        type="number"
                                        key="radiusField"
                                        v-model="data.radius"
                                        class="form-control"
                                        :placeholder="$t('str.register.check.point.radius.placeholder')"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="btn-center mt-4 mb-2">
                            <button @click="checkForm" type="submit" class="btn btn-primary w-200px me-10px is-loading">
                                <i v-if="isLoading === true" class="fas fa-spinner fa-pulse"></i>
                                {{ $t('str.btn.save') }}
                            </button>
                            <button v-b-modal.checkPointModal v-on:click="openCheckPointModal" type="submit" class="btn btn-default w-200px">{{ $t('str.btn.new.form') }}</button>
                            <button v-if="data.status === 'ACTIVE'" v-on:click="confirmArchive" type="submit" class="ms-10px btn btn-warning w-200px">
                                {{ $t('str.btn.archive') }}
                            </button>

                            <button v-b-modal.qrCodeModal v-if="data._id && data.status === 'ACTIVE'" type="submit" class="ms-10px btn btn-success w-200px">
                                {{ $t('str.btn.qrcode') }}
                            </button>
                        </div>
                    </div>
                </fieldset>
            </form>
        </panel>
        <notifications group="bottom-right" position="bottom right" :speed="500" />
        <QrCodeModal :qrcodeId="data._id" :data="data" />
        <ListPatrolPoint v-on:load-item="selectItem" :isSuperAdminMaster="isSuperAdminMaster" :accounts="accounts" :clients="clients" />
    </div>
</template>

<script>
import Controller from './CrtPatrolPoint.vue'
import ListPatrolPoint from './ListPatrolPoint.vue'
import QrCodeModal from './QrCodeModal/QrCodeModal.vue'
import Map from './Map/Map.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

import { STATES } from '../../../utils/states.js'
import { ROLES } from '../../../utils/roles.js'

export default {
    components: {
        ListPatrolPoint,
        Map,
        QrCodeModal,
    },
    data() {
        return {
            states: STATES,
            roles: ROLES,
            isLoading: false,
            errors: [],
            accounts: [],
            clients: [],
            sites: [],
            valuekey: 0,
            isSuperAdminMaster: false,
            data: {
                name: '',
                notes: '',
                type: '',
                account: '',
                client: '',
                site: '',
                geolocation: {
                    latitude: '',
                    longitude: '',
                },
                radius: null,
                address: {},
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
