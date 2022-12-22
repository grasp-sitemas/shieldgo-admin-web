<template>
    <div>
        <div style="min-height: 100vh; background-size: 360px; background-position: right bottom">
            <div class="d-flex align-items-center mb-3">
                <h1 class="page-header mb-0">{{ $t('str.form.title.monitor') }}</h1>
            </div>
            <!-- <div class="row">
                <div class="col-md-12 mb-3 p-3">
                    <div id="accordion" class="accordion rounded overflow-hidden">
                        <b-card class="bg-gray-800 text-white border-0 rounded-0" no-body>
                            <b-card-header header-tag="header" class="card-header bg-gray-900 text-white pointer-cursor px-3 py-10px d-flex align-items-center" v-b-toggle.companies>
                                {{ $t('str.filters') }}
                            </b-card-header>
                            <b-collapse id="companies" visible accordion="filterSession">
                                <b-card-body>
                                    <div class="row">
                                        <div v-if="isSuperAdminMaster" class="col-md-3 mb-3">
                                            <label class="form-label" for="accountField">{{ $t('str.register.user.account.field') }}</label>
                                            <select v-model="filters.account" @change="changeAccount" class="form-select" id="accountField">
                                                <option value="">{{ $t('str.register.select.placeholder') }}</option>
                                                <option v-for="account in accounts" :value="account._id" :key="account._id">
                                                    {{ account.name }}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-md-3 mb-3">
                                            <label class="form-label" for="clientField">{{ $t('str.register.user.client.field') }}</label>
                                            <select v-model="filters.client" @change="changeClient" class="form-select" id="clientField">
                                                <option value="">{{ $t('str.register.select.placeholder') }}</option>
                                                <option v-for="client in clients" :value="client._id" :key="client._id">
                                                    {{ client.name }}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-md-3 mb-3">
                                            <label class="form-label" for="siteField">{{ $t('str.register.user.site.field') }}</label>
                                            <select v-model="filters.site" @change="filter" class="form-select" id="siteField">
                                                <option value="">{{ $t('str.register.select.placeholder') }}</option>
                                                <option v-for="site in sites" :value="site._id" :key="site._id">
                                                    {{ site.name }}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-md-3 mb-3">
                                            <p class="form-label" for="typesField">{{ $t('str.filters.event.types') }}</p>
                                            <div class="form-check form-switch mb-2 ms-2" v-bind:key="item.id" v-for="item in this.eventTypes">
                                                <input v-model="filters.types" @change="filter" :id="item.value" :value="item.value" :true-value="item.value" class="form-check-input" type="checkbox" />
                                                <label class="form-check-label" :for="item.value">{{ $t(item.label) }}</label>
                                            </div>
                                        </div>
                                    </div>
                                </b-card-body>
                            </b-collapse>
                        </b-card>
                    </div>
                </div>
            </div> -->
            <div class="row">
                <div class="col-xl-4 col-lg-6">
                    <panel title="Eventos">
                        <div class="list-group list-group-flush rounded-bottom overflow-hidden panel-body p-0">
                            <a @click="handleSelectEvent(event)" v-for="event in events" :key="event.id" class="list-group-item list-group-item-action d-flex cursor-mouse">
                                <div class="me-3 fs-16px">
                                    <i v-bind:class="event?.icon" />
                                </div>
                                <div class="flex-fill">
                                    <div class="fs-14px lh-12 mb-2px fw-bold">{{ $t(event?.type) }}</div>
                                    <div class="mb-1 fs-12px">
                                        <div class="flex-1">{{ event?.description }}</div>
                                    </div>
                                    <div class="mb-1">
                                        <span v-bind:class="event?.tag">{{ $t(event?.type) }}</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </panel>
                </div>

                <div v-if="selectedEvent" class="col-xl-4 col-lg-6">
                    <panel :title="$t(selectedEvent?.type) + ' ' + $t('str.on') + ' ' + selectedEvent?.formattedDate + ' ' + $t('str.at') + ' ' + selectedEvent?.formattedTime">
                        <div class="result-info">
                            <div class="flex-1 mb-3">
                                <div class="text-opacity-50 small fw-bold">
                                    {{ $t('str.monitor.details.patrol') }}:
                                    <label v-if="selectedEvent?.event?.name" class="info-result">{{ selectedEvent?.event?.name }}</label>
                                    <label v-else class="info-result"> {{ $t('str.monitor.alone.patrol') }} </label>
                                </div>
                                <div class="text-opacity-50 small fw-bold">
                                    {{ $t('str.monitor.details.status') }}:
                                    <label v-if="selectedEvent?.event" class="info-result">{{ $t(selectedEvent?.event?.status) }}</label>
                                    <label v-else class="info-result">
                                        {{ $t('str.monitor.without.status') }}
                                    </label>
                                </div>
                                <div class="text-opacity-50 small fw-bold">
                                    {{ $t('str.monitor.details.site') }}: <label class="info-result">{{ selectedEvent?.site?.name }}</label>
                                </div>
                            </div>
                            <hr class="bg-gray-500" />

                            <div class="flex-1 mb-3">
                                <div class="timeline-header">
                                    <div class="userimage">
                                        <img
                                            v-if="selectedEvent?.vigilant?.photoURL && selectedEvent?.vigilant?.photoURL !== 'https://'"
                                            crossorigin="anonymous"
                                            v-bind:src="`${domain}${selectedEvent?.vigilant?.photoURL}`"
                                        />
                                        <img v-else src="@/assets/images/profile.png" />
                                    </div>
                                    <div class="username">
                                        <a>{{ selectedEvent?.vigilant?.firstName }} {{ selectedEvent?.vigilant?.lastName }}</a>
                                    </div>
                                </div>

                                <div class="text-opacity-50 small fw-bold">
                                    {{ $t('str.monitor.details.vigilant.phone') }}:
                                    <label class="info-result">{{ selectedEvent?.vigilant?.primaryPhone }}</label>
                                </div>
                                <div v-if="selectedEvent?.vigilant?.email" class="text-opacity-50 small fw-bold">
                                    {{ $t('str.monitor.details.vigilant.email') }}:
                                    <label class="info-result">{{ selectedEvent?.vigilant?.email }}</label>
                                </div>
                            </div>
                            <hr class="bg-gray-500" />

                            <div class="btn-row mb-4">
                                <a v-if="selectedEvent?.geolocation" v-on:click="showMap()" data-toggle="tooltip" data-container="body" data-title="Map" class="cursor-mouse">
                                    <i class="fa fa-fw fa-map-marker-alt"></i>
                                </a>
                                <a
                                    v-if="selectedEvent?.photoURL && selectedEvent?.photoURL !== 'https://'"
                                    v-on:click="showPhoto()"
                                    data-toggle="tooltip"
                                    data-container="body"
                                    data-title="Image"
                                    class="cursor-mouse"
                                >
                                    <i class="fa fa-fw fa-image"></i>
                                </a>
                                <a
                                    v-if="selectedEvent?.soundURL && selectedEvent?.soundURL !== 'https://'"
                                    v-on:click="showSound()"
                                    data-toggle="tooltip"
                                    data-container="body"
                                    data-title="Audio"
                                    class="cursor-mouse"
                                >
                                    <i class="fa fa-fw fa-volume-up"></i>
                                </a>
                                <a
                                    v-if="selectedEvent?.signatureURL && selectedEvent?.signatureURL !== 'https://'"
                                    v-on:click="showSignature()"
                                    data-toggle="tooltip"
                                    data-container="body"
                                    data-title="Signature"
                                    class="cursor-mouse"
                                >
                                    <i class="fa fa-fw fa-pen"></i>
                                </a>
                                <a v-if="selectedEvent?.deviceInfo" v-on:click="showDeviceInfo()" data-toggle="tooltip" data-container="body" data-title="Device Info" class="cursor-mouse">
                                    <i class="fa fa-fw fa-info-circle"></i>
                                </a>
                            </div>

                            <!-- render incident list in selectedEvent?.incidents -->
                            <div v-if="selectedEvent?.incidents?.length > 0" class="mb-3">
                                <div class="text-opacity-50 small fw-bold">{{ $t('str.monitor.details.incidents') }}:</div>
                                <div class="text-opacity-50 small fw-bold">
                                    <ul>
                                        <li v-for="incident in selectedEvent?.incidents" :key="incident._id">
                                            {{ incident.name }}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div class="result-price">
                                <a @click="handleAnswerEvent()" class="btn btn-yellow d-block w-100"> {{ $t('str.monitor.answer.event') }} </a>
                            </div>
                        </div>
                    </panel>
                </div>
            </div>
        </div>
        <Map :data="selectedEvent" />
        <Photo :data="selectedEvent" />
        <Signature :data="selectedEvent" />
        <Sound :data="selectedEvent" />
        <DeviceInfo :data="selectedEvent" />
        <notifications position="top left" />
    </div>
</template>

<script>
import Controller from './CrtMonitor.vue'
// import Common from '../../common/Common.vue'
import { EVENT_TYPES } from '../../utils/events'
import Map from './Components/Map/Map.vue'
import Photo from './Components/Photo/Photo.vue'
import Signature from './Components/Signature/Signature.vue'
import Sound from './Components/Sound/Sound.vue'
import DeviceInfo from './Components/DeviceInfo/DeviceInfo.vue'
import db from '../../firebaseInit.js'
import { doc, onSnapshot, deleteDoc } from 'firebase/firestore'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        Map,
        Photo,
        Signature,
        Sound,
        DeviceInfo,
    },
    data() {
        return {
            isLoading: true,
            domain: '',
            valuekey: 0,
            eventTypes: EVENT_TYPES,
            errors: [],
            accounts: [],
            clients: [],
            sites: [],
            items: [],
            events: [],
            notifications: [],
            selectedEvent: null,
            answerEvent: null,
            filters: {
                types: [],
                status: 'ACTIVE',
                account: '',
                client: '',
                site: '',
            },
            isSuperAdminMaster: false,
            columns: [],
            paginationOptions: {
                perPage: 15,
            },
        }
    },
    mounted() {
        Controller.init(this)
    },
    created() {
        const state = this
        state.$registerEvent.$on('refreshList', function () {
            state.filter()
        })

        state.$registerEvent.$on('changeLanguage', function () {
            state.initTable()
        })

        const siteId = state.$session.get('user')?.site
        onSnapshot(doc(db, 'notifications', siteId), async document => {
            const type = document.data()?.type

            if (type === 'INCIDENT') {
                await deleteDoc(doc(db, 'notifications', siteId))
                state.filter()
            } else if (type === 'SOS_ALERT') {
                state.$registerEvent.$emit('soundAlert')
                state.filter()
                await deleteDoc(doc(db, 'notifications', siteId))
            }
        })
    },
    methods: Controller.methods,
}
</script>
<style lang="scss" scoped>
.form-check {
    display: inline-block !important;
}
.result-info {
    padding: 1.171875rem;
    position: relative;
    flex: 1;
}

.result-info .btn-row {
    display: flex;
    flex-wrap: wrap;
}

.result-info .btn-row a {
    color: var(--app-component-color);
    background: rgba(var(--app-component-color-rgb), 0.15);
    font-size: 0.875rem;
    padding: 0.3121875rem 0.46875rem;
    border-radius: 4px;
}

.result-info .btn-row a + a {
    margin-left: 0.3121875rem;
}

.panel .panel-body {
    max-height: 75vh !important;
    overflow-y: auto !important;
}

.info-result {
    color: var(--app-component-color);
    font-weight: 500;
}

.userimage {
    width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 36px;
    margin-right: 0.75rem;
    object-fit: contain;
}

.timeline-header {
    padding: 0.2rem;
    display: flex;
    align-items: center;
}

img {
    max-width: 100% !important;
    display: block;
}
</style>
