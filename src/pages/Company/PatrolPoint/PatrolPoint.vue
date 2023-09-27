<template>
    <div>
        <template>
            <b-modal no-close-on-backdrop id="createPatrolPointModal" @hide="closeModal" :hide-footer="true" size="lg" class="modal-message">
                <template slot="modal-header">
                    <h4 class="modal-title">{{ $t('str.breadcrumb.patrol.points') }}</h4>
                    <a class="btn-close cursor_pointer" @click="closeModal"></a>
                </template>

                <div>
                    <div v-if="data._id" class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                            <select v-model="data.status" class="form-select" id="statusField">
                                <option value="ACTIVE">{{ $t('str.register.status.active') }}</option>
                                <option value="ARCHIVED">{{ $t('str.register.status.archived') }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="statusField">{{ $t('str.register.type.field') }}</label>
                            <select v-model="data.type" class="form-select" id="statusField">
                                <option value="QRCODE">{{ $t('str.qrcode.option') }}</option>
                                <option value="SUPERVISION">{{ $t('str.supervision.option') }}</option>
                            </select>
                        </div>
                        <div v-if="isSuperAdminMaster" class="col-md-6 mb-3">
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
                        <div v-if="role === 'SUPER_ADMIN_MASTER' || role === 'ADMIN' || role === 'MANAGER'" :class="data?.type === 'QRCODE' ? 'col-md-6 mb-3' : 'col-md-12 mb-3'">
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
                        <div v-if="data.type === 'QRCODE'" class="col-md-6 mb-3">
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

                    <div class="row mt-3">
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="cepField">{{ $t('str.register.site.cep.field') }}</label>
                            <input
                                type="tel"
                                v-mask="'#####-###'"
                                key="cepField"
                                @keyup.delete="handleCEPDelete"
                                @input="inputCep()"
                                @focus="removeRequiredField('allAddress')"
                                v-bind:class="checkRequiredField('cep') ? 'is-invalid' : ''"
                                v-model="data.address.cep"
                                class="form-control"
                                :placeholder="$t('str.register.site.cep.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.site.cep.required') }}</div>
                        </div>
                        <div v-if="data?.address?.cep?.length === 9" class="col-md-4 mb-3">
                            <label class="form-label" for="addressField">{{ $t('str.register.site.address.field') }}</label>
                            <input
                                v-model="data.address.address"
                                v-bind:class="checkRequiredField('address') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('address')"
                                class="form-control"
                                type="text"
                                key="addressField"
                                :placeholder="$t('str.register.site.address.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.site.address.required') }}</div>
                        </div>
                        <div v-if="data?.address?.cep?.length === 9" class="col-md-4 mb-3">
                            <label class="form-label" for="numberField">{{ $t('str.register.site.number.field') }}</label>
                            <input
                                v-model="data.address.number"
                                v-bind:class="checkRequiredField('number') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('number')"
                                class="form-control"
                                type="number"
                                key="numberField"
                                ref="numberField"
                                :placeholder="$t('str.register.site.number.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.site.number.required') }}</div>
                        </div>
                    </div>
                    <div class="row" v-if="data?.address?.cep?.length === 9">
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="complementField">{{ $t('str.register.site.complement.field') }}</label>
                            <input v-model="data.address.complement" class="form-control" type="text" id="complementField" :placeholder="$t('str.register.site.complement.placeholder')" />
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="districtField">{{ $t('str.register.site.district.field') }}</label>
                            <input
                                v-model="data.address.neighborhood"
                                v-bind:class="checkRequiredField('neighborhood') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('neighborhood')"
                                class="form-control"
                                type="text"
                                key="districtField"
                                :placeholder="$t('str.register.site.district.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.site.neighborhood.required') }}</div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="cityField">{{ $t('str.register.site.city.field') }}</label>
                            <input
                                v-model="data.address.city"
                                v-bind:class="checkRequiredField('city') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('city')"
                                class="form-control"
                                type="text"
                                key="cityField"
                                :placeholder="$t('str.register.site.city.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.register.site.city.required') }}</div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="stateField">{{ $t('str.register.site.state.field') }}</label>
                            <select v-model="data.address.state" class="form-select" v-bind:class="checkRequiredField('state') ? 'is-invalid' : ''" @focus="removeRequiredField('state')" id="stateField">
                                <option v-for="state in states" :value="state.value" :key="state.value">
                                    {{ state.label }}
                                </option>
                            </select>
                            <div class="invalid-feedback">{{ $t('str.register.site.cep.required') }}</div>
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
                        <button v-b-modal.qrCodeModal v-if="data._id && data.status === 'ACTIVE'" type="submit" class="ms-10px btn btn-success w-200px">
                            {{ $t('str.btn.qrcode') }}
                        </button>
                        <button @click="closeModal" type="submit" class="btn btn-default w-25 m-2">{{ $t('str.btn.close') }}</button>
                    </div>
                </div>
            </b-modal>
        </template>

        <QrCodeModal :qrcodeId="data._id" :data="data" />
        <ListPatrolPoint v-on:load-item="selectItem" :isSuperAdminMaster="isSuperAdminMaster" :accounts="accounts" :clients="clients" :role="role" />
        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </div>
</template>

<script>
import Controller from './CrtPatrolPoint.vue'
import ListPatrolPoint from './ListPatrolPoint.vue'
import QrCodeModal from './QrCodeModal/QrCodeModal.vue'
import Map from './Map/Map.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()
import { patrolPoint } from '../../../types/patrolPoint'
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
            role: '',
            user: {},
            valuekey: 0,
            isSuperAdminMaster: false,
            data: JSON.parse(JSON.stringify(patrolPoint)),
            patrolPointObj: JSON.parse(JSON.stringify(patrolPoint)),
        }
    },
    created() {
        Controller.init(this)
    },
    methods: Controller.methods,
}
</script>
