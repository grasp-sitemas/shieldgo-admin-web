<template>
    <b-modal no-close-on-backdrop id="createItineraryModal" @hide="closeModal" :hide-footer="true" size="lg" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.breadcrumb.itineraries') }}</h4>
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
                    <label class="form-label" for="nameField">{{ $t('str.register.itineraries.name.field') }}</label>
                    <input
                        v-model="data.name"
                        class="form-control"
                        v-bind:class="checkRequiredField('name') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('name')"
                        type="text"
                        key="nameField"
                        :placeholder="$t('str.register.itineraries.name.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.itineraries.name.required') }}</div>
                </div>
                <div v-if="isSuperAdminMaster" class="col-md-4 mb-3">
                    <label class="form-label" for="accountField">{{ $t('str.register.site.groups.account.field') }}</label>
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
                    <div class="invalid-feedback">{{ $t('str.register.itineraries.account.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="clientField">{{ $t('str.register.itineraries.client.field') }}</label>
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
                    <div class="invalid-feedback">{{ $t('str.register.itineraries.client.required') }}</div>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-md-10 mb-3">
                    <label class="form-label" for="checkPointsField">{{ $t('str.register.itineraries.checkpoints.field') }}</label>
                    <span v-show="data.client" @click="removeAllCheckpoints()" disabled class="badge bg-dark rounded-5 cursor_pointer f-right badge-ml-5">{{
                        $t('str.register.itineraries.remove.all.checkpoints.label')
                    }}</span>
                    <span v-show="data.client" @click="selectAllCheckpoints()" disabled class="badge bg-dark rounded-5 cursor_pointer f-right">{{ $t('str.register.site.group.select.all.sites.label') }}</span>
                    <v-select
                        taggable
                        multiple
                        label="name"
                        key="checkPointsField"
                        v-model="selectedCheckpoints"
                        :options="checkpoints"
                        :create-option="checkpoint => ({ _id: '' })"
                        :placeholder="$t('str.register.select.placeholder')"
                    />
                </div>
                <div class="col-md-2 mt-4">
                    <button @click="addCheckpoints()" class="btn btn-warning" type="button" :disabled="selectedCheckpoints?.length > 0 ? false : true">
                        {{ $t('str.register.checkpoints.add.button') }}
                    </button>
                </div>
            </div>

            <div class="row mt-2">
                <h6 class="" for="sitesField">{{ $t('str.register.itineraries.checkpoints.table.title') }}</h6>

                <vue-good-table
                    :columns="columns"
                    :rows="data.patrolPoints"
                    @on-row-click="selectItem"
                    :lineNumbers="true"
                    :search-options="{ enabled: true, placeholder: $t('str.table.search.in.this.table') }"
                    :pagination-options="paginationOptions"
                    tableLayout="fixed"
                >
                    <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                        <i v-if="isLoading" class="fas fa-spinner fa-spin" />
                        <span v-if="!isLoading && checkpoints?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
                    </div>

                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field === 'geolocation'" class="icon-cell">
                            <i v-on:click="showMap()" class="fas fa-map-marker-alt cursor_pointer" />
                        </span>
                        <span v-else-if="props.column.field === 'actions'">
                            <button @click="removeItem(props.row)" class="btn btn-danger btn-sm">
                                <i class="fas fa-trash"></i>
                            </button>
                        </span>
                        <span v-else>
                            {{ props.formattedRow[props.column.field] }}
                        </span>
                    </template>
                </vue-good-table>
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
        <Map :data="patrolPointItem" />
        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </b-modal>
</template>

<script>
import Controller from './CrtItineraries.vue'
import Vue from 'vue'
import { itinerary } from '../../../types/itinerary'
Vue.prototype.$registerEvent = new Vue()
import Services from '../../../common/Services.vue'
import Common from '../../../common/Common.vue'
import Map from '../../Schedule/Supervisory/Map/Map.vue'

export default {
    components: {
        Map
    },
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

            this.clients = await Services.getClientsByAccount(this, this.data?.account)

            const filter = {
                account: this.data?.account,
                client: this.data?.client,
                status: 'ACTIVE',
                type: 'SUPERVISION'
            }

            this.checkpoints = await Services.getSupervisoryPointByClient(this, filter)

            this.errors = []
        },
    },
    data() {
        return {
            isLoading: false,
            errors: [],
            accounts: [],
            clients: [],
            selectedCheckpoints: [],
            checkpoints: [],
            role: '',
            valuekey: 0,
            isSuperAdminMaster: false,
            patrolPointItem: {},
            data: JSON.parse(JSON.stringify(itinerary)),
            itineraryObj: JSON.parse(JSON.stringify(itinerary)),
            columns: [],
            paginationOptions: {},
        }
    },
    mounted() {
        Controller.init(this)
    },
    methods: Controller.methods,
}
</script>
<style lang="scss" scoped>
.dark-shadow {
    background-color: inset 0 0 0 9999px var(--bs-table-accent-bg) !important;
}

</style>
