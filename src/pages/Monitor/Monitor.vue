<template>
    <div style="min-height: 100vh; background-size: 360px; background-position: right bottom">
        <div class="d-flex align-items-center mb-3">
            <h1 class="page-header mb-0">{{ $t('str.form.title.monitor') }}</h1>
        </div>
        <div class="row">
            <div class="col-md-12 mb-3">
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
                                    <div v-if="isSuperAdminMaster || role === 'ADMIN' || role === 'MANAGER'" class="col-md-3 mb-3">
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
        </div>

        <div v-if="!isLoading && events !== null" class="row">
            <div v-if="events?.length > 0" class="col-xl-4 col-lg-6">
                <panel :title="$t('str.events.title')">
                    <div class="list-group list-group-flush rounded-bottom overflow-hidden panel-body p-0">
                        <div @click="handleSelectEvent(event)" v-for="event in events" :key="event.id">
                            <a class="list-group-item list-group-item-action d-flex cursor-mouse" v-bind:class="selectedEvent?._id === event?._id ? 'list-group-selected' : ''">
                                <div class="me-3 fs-16px">
                                    <i v-bind:class="event?.icon" />
                                </div>
                                <div class="flex-fill">
                                    <div class="fs-14px lh-12 mb-2px fw-bold">
                                        {{ event?.failureText }}
                                    </div>
                                    <div class="mb-1 fs-12px">
                                        <div class="flex-1">{{ event?.description }}</div>
                                    </div>
                                    <div class="mb-1">
                                        <span v-bind:class="event?.tag">{{ event?.failurePatrolType ? $t('str.msg.failure.patrol') : $t(event?.type) }}</span>
                                    </div>
                                </div>
                                <div v-if="!event?.attendance || !event?.attendance?.isAttendance" class="dot animated-dot">
                                    <i class="fa fa-circle dot-color" />
                                </div>
                            </a>
                        </div>
                    </div>
                </panel>
            </div>
            <div v-else class="no-events">
                <i class="fa fa-exclamation-triangle fa-5x text-white mb-4" />
                <h3>{{ $t('str.monitor.no.events.title') }}</h3>
                <p>{{ $t('str.monitor.no.events.description') }}</p>
            </div>

            <div v-if="selectedEvent" class="col-xl-4 col-lg-6">
                <panel :title="selectedEvent?.failureText + ' ' + $t('str.on') + ' ' + selectedEvent?.formattedDate + ' ' + $t('str.at') + ' ' + selectedEvent?.formattedTime">
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

                        <div v-if="selectedEvent?.vigilant" class="flex-1 mb-3">
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
                        <hr v-if="selectedEvent?.vigilant" class="bg-gray-500" />

                        <div v-if="selectedEvent?.attendance?.isAttendance" class="flex-1 mb-3">
                            <div class="text-opacity-50 small fw-bold">
                                {{ $t('str.monitor.details.attendance.by') }}:
                                <label class="info-result">{{ selectedEvent?.attendance?.operator?.firstName }} {{ selectedEvent?.attendance?.operator?.lastName }}</label>
                            </div>
                            <div class="text-opacity-50 small fw-bold">
                                {{ $t('str.monitor.details.attendance.opened.date') }}:
                                <label class="info-result">{{ formatDate(selectedEvent?.attendance?.openedDate) }}</label>
                            </div>
                            <div v-if="selectedEvent?.attendance?.closedDate" class="text-opacity-50 small fw-bold">
                                {{ $t('str.monitor.details.attendance.closed.date') }}:
                                <label class="info-result">{{ formatDate(selectedEvent?.attendance?.closedDate) }}</label>
                            </div>

                            <hr class="bg-gray-500" />
                        </div>

                        <div class="btn-row mb-4" v-if="selectedEvent.type !== 'FAILURE_PATROL'">
                            <a v-if="selectedEvent?.geolocation && selectedEvent?.geolocation?.latitude" v-on:click="showMap" data-toggle="tooltip" data-container="body" data-title="Map" class="cursor-mouse">
                                <i class="fa fa-fw fa-map-marker-alt"></i>
                            </a>
                            <a v-if="selectedEvent?.photoURL && selectedEvent?.photoURL?.length > 0" v-on:click="showPhoto()" data-toggle="tooltip" data-container="body" data-title="Image" class="cursor-mouse">
                                <i class="fa fa-fw fa-image"></i>
                                <i v-if="selectedEvent?.photoURL === 'https://'" class="fa fa-fw fa-clock small-icon"> </i>
                            </a>
                            <a v-if="selectedEvent?.soundURL && selectedEvent?.soundURL?.length > 0" v-on:click="showSound()" data-toggle="tooltip" data-container="body" data-title="Audio" class="cursor-mouse">
                                <i class="fa fa-fw fa-volume-up"></i>
                                <i v-if="selectedEvent?.soundURL === 'https://'" class="fa fa-fw fa-clock small-icon"> </i>
                            </a>
                            <a
                                v-if="selectedEvent?.signatureURL && selectedEvent?.signatureURL?.length > 0"
                                v-on:click="showSignature()"
                                data-toggle="tooltip"
                                data-container="body"
                                data-title="Signature"
                                class="cursor-mouse"
                            >
                                <i class="fa fa-fw fa-pen"></i>
                                <i v-if="selectedEvent?.signatureURL === 'https://'" class="fa fa-fw fa-clock small-icon"> </i>
                            </a>
                            <a v-if="selectedEvent?.deviceInfo" v-on:click="showDeviceInfo()" data-toggle="tooltip" data-container="body" data-title="Device Info" class="cursor-mouse">
                                <i class="fa fa-fw fa-mobile-alt"></i>
                            </a>
                        </div>

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

                        <div
                            v-if="
                                (!selectedEvent?.attendance || !selectedEvent?.attendance?.isAttendance) &&
                                user?.companyUser?.subtype === 'OPERATOR' &&
                                (selectedEvent?.type === 'SOS_ALERT' || selectedEvent?.type === 'FAILURE_PATROL' || selectedEvent?.type === 'INCIDENT')
                            "
                            class="result-price"
                        >
                            <a
                                @click="handleAttendanceEvent()"
                                class="btn d-block w-100"
                                v-bind:class="{
                                    'btn-yellow': selectedEvent?.type === 'INCIDENT',
                                    'btn-red': selectedEvent?.type === 'SOS_ALERT',
                                    'btn-dark-orange': selectedEvent?.type === 'FAILURE_PATROL',
                                }"
                            >
                                <i v-if="isLoadingAttendanceEventButton" class="fas fa-spinner fa-spin" />
                                {{ $t('str.monitor.answer.event') }}
                            </a>
                        </div>
                    </div>
                </panel>
            </div>

            <div class="col-xl-4 col-lg-6 panel-attendance-body p-0" v-if="selectedEvent?.attendance?.isAttendance">
                <panel :title="$t('str.event.attendance')">
                    <div v-if="selectedEvent?.attendance?.operator?._id === user._id && selectedEvent?.attendance?.status === 'IN_PROGRESS'" class="result-info overflow-hidden">
                        <div class="flex-1 mb-3">
                            <label class="form-label" for="attendancesOptionsField">{{ $t('str.attendances.options.field') }}</label>
                            <select
                                v-model="attendance.type"
                                class="form-select"
                                id="attendancesOptionsField"
                                @focus="removeRequiredField('attendanceOptions')"
                                v-bind:class="checkRequiredField('attendanceOptions') ? 'is-invalid' : ''"
                            >
                                <option value="">{{ $t('str.register.select.placeholder') }}</option>
                                <option v-for="attendance in attendancesTypes" :value="attendance._id" :key="attendance._id">
                                    {{ $t(attendance._id) }}
                                </option>
                            </select>
                            <div class="invalid-feedback">{{ $t('str.attendances.options.field.error') }}</div>
                        </div>
                        <div class="flex-1 mb-3">
                            <label class="form-label" for="attendancesNotesField">{{ $t('str.attendances.notes.field') }}</label>
                            <textarea v-model="attendance.notes" class="form-control" id="attendancesNotesField" rows="3"></textarea>
                        </div>
                        <div class="result-price d-flex justify-content-between align-items-center mb-3">
                            <a
                                v-on:click="checkForm()"
                                class="btn d-block w-50 m-2"
                                v-bind:class="{
                                    'btn-yellow': selectedEvent?.type === 'INCIDENT',
                                    'btn-red': selectedEvent?.type === 'SOS_ALERT',
                                    'btn-dark-orange': selectedEvent?.type === 'FAILURE_PATROL',
                                }"
                            >
                                <i v-if="isLoadingSendAttendanceButton" class="fas fa-spinner fa-spin" />
                                {{ $t('str.btn.attendance.register') }}
                            </a>
                            <!-- close attendance button -->
                            <a v-on:click="confirmCloseAttendance" class="btn d-block w-50 m-2 btn-gray">
                                <!-- <i v-if="isLoadingCloseAttendanceButton" class="fas fa-spinner fa-spin" /> -->
                                {{ $t('str.btn.attendance.close') }}
                            </a>
                        </div>
                        <hr class="bg-gray-500" />
                    </div>

                    <div class="result-info pd-0">
                        <label class="form-label">{{ $t('str.attendances.history.list') }}</label>

                        <table class="table table-hover table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">{{ $t('str.attendances.date.field') }}</th>
                                    <th scope="col">{{ $t('str.attendances.type.field') }}</th>
                                    <th width="30%" scope="col">{{ $t('str.attendances.notes.field') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="isLoadingAttendanceList">
                                    <td colspan="3" class="text-center">
                                        <i class="fas fa-spinner fa-spin" />
                                    </td>
                                </tr>
                                <tr v-else-if="!isLoadingAttendanceList && attendances.length === 0">
                                    <td colspan="3" class="text-center">{{ $t('str.msg.waiting.attendance.by.operator') }}</td>
                                </tr>
                                <tr v-else v-for="attendance in attendances" :key="attendance._id">
                                    <td>{{ formatDate(attendance.createDate) }}</td>
                                    <td>{{ $t(attendance.type) }}</td>
                                    <td>{{ attendance.notes }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </panel>
            </div>

            <gritterNotify v-if="operatorWithoutGroup" :title="$t('str.operator.without.sites.title')" :text="$t('str.operator.without.sites.text')" @after-close="operatorWithoutGroup = false" />
        </div>
        <div v-else class="center-spinner">
            <i class="fas fa-spinner fa-spin" />
        </div>

        <notifications group="top-right" position="top right" :speed="1000" />
        <Photo :photoURL="selectedEvent?.photoURL" />
        <Signature :signatureURL="selectedEvent?.signatureURL" />
        <Sound :soundURL="selectedEvent?.soundURL" />
        <Map :data="selectedEvent" />
        <DeviceInfo :data="selectedEvent" />
    </div>
</template>

<script>
import gritterNotify from '../../components/notification/gritter.vue'
import Controller from './CrtMonitor.vue'
import Services from '../../common/Services.vue'
import Common from '../../common/Common.vue'
import { EVENT_TYPES } from '../../utils/events'
import Map from './Components/Map/Map.vue'
import Photo from './Components/Photo/Photo.vue'
import Signature from './Components/Signature/Signature.vue'
import Sound from './Components/Sound/Sound.vue'
import DeviceInfo from './Components/DeviceInfo/DeviceInfo.vue'
import db from '../../firebaseInit.js'
import { doc, onSnapshot, deleteDoc } from 'firebase/firestore'

import moment from 'moment'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()
export default {
    components: {
        Map,
        Photo,
        Signature,
        Sound,
        DeviceInfo,
        gritterNotify,
    },
    data() {
        return {
            isLoading: true,
            isLoadingEvents: false,
            isLoadingSendAttendanceButton: false,
            isLoadingAttendanceEventButton: false,
            isLoadingAttendanceList: false,
            domain: '',
            valuekey: 0,
            eventTypes: EVENT_TYPES,
            errors: [],
            accounts: [],
            clients: [],
            sites: [],
            items: [],
            events: null,
            user: null,
            role: null,
            attendances: [],
            selectedEvent: null,
            selectedAttendence: null,
            attendancesTypes: [],
            attendanceEventEnabled: false,
            operatorWithoutGroup: false,
            attendance: {
                account: null,
                client: null,
                site: null,
                operator: null,
                event: '',
                type: '',
                notes: '',
                patrolAction: '',
                createDate: moment().utc(true).format(),
                status: 'ACTIVE',
            },
            answerEvent: null,
            filters: {
                types: [],
                status: 'ACTIVE',
                account: '',
                client: '',
                site: '',
                sites: [],
                eventNotAttandance: true,
                startDate: moment().utc(true).subtract(1, 'days').format(),
                endDate: moment().utc(true).format(),
            },
            isSuperAdminMaster: false,
        }
    },
    methods: Controller.methods,
    async created() {
        Controller.init(this)

        const state = this

        state.$registerEvent.$on('changeLanguage', async function () {
            state.events = await state.formatPatrolActions(state.items)
        })

        state.$registerEvent.$on('refreshSchedule', function () {
            state.filter()
        })

        const siteIds = await state.$session.get('user')?.siteGroup?.sites
        const siteGroupId = await state.$session.get('user')?.siteGroup?._id
        const role = await state.$session.get('user')?.companyUser?.subtype

        if ((!siteIds || siteIds?.length === 0) && role === 'OPERATOR') {
            state.operatorWithoutGroup = true
        }

        // subscribe notifications snapshot in array of sites ids
        if (siteIds && siteIds?.length > 0) {
            siteIds.forEach(site => {
                onSnapshot(doc(db, 'notifications', site), async document => {
                    const type = document.data()?.type
                    if (type && type.length > 0) {
                        if (type === 'INCIDENT') {
                            Common.show(state, 'top-right', 'warn', state.$t('msg.new.incident.notification'))
                        } else if (type === 'SOS_ALERT') {
                            state.$registerEvent.$emit('soundAlert')
                        }
                        if (type === 'CRASH') {
                            Common.show(state, 'top-right', 'warn', state.$t('msg.crash.device.notification'))
                        } else if (type === 'LOWVOLTAGE') {
                            Common.show(state, 'top-right', 'warn', state.$t('msg.low.voltage.device.notification'))
                        } else if (type === 'FAILURE_PATROL') {
                            console.log('FAILURE_PATROL')
                            const subtype = document.data()?.subtype
                            switch (subtype) {
                                case 'EXPIRED':
                                    Common.show(state, 'top-right', 'warn', state.$t('msg.expired.patrol.notification'))
                                    break
                                case 'NOT_STARTED':
                                    Common.show(state, 'top-right', 'warn', state.$t('msg.not.started.patrol.notification'))
                                    break
                                case 'INCOMPLETE':
                                    Common.show(state, 'top-right', 'warn', state.$t('msg.incomplete.patrol.notification'))
                                    break
                            }
                        } else if (type === 'CANCEL_PATROL') {
                            Common.show(state, 'top-right', 'indigo', state.$t('msg.new.canceled.patrol.notification'))
                        }
                        await deleteDoc(doc(db, 'notifications', site))
                        await state.filter()
                    }
                })

                onSnapshot(doc(db, 'updatedMedias', site), async document => {
                    const patrolAction = document.data()?.patrolAction
                    const type = document.data()?.type

                    if (patrolAction === state.selectedEvent?._id) {
                        const url = document.data()?.url
                        if (type === 'PHOTO') {
                            state.selectedEvent.photoURL = url
                        } else if (type === 'SIGNATURE') {
                            state.selectedEvent.signatureURL = url
                        } else if (type === 'SOUND') {
                            state.selectedEvent.soundURL = url
                        }
                    }
                    await deleteDoc(doc(db, 'updatedMedias', site))
                })
            })
        }

        if (siteGroupId) {
            onSnapshot(doc(db, 'updateAttendanceEventReport', siteGroupId), async document => {
                const patrolActionId = document.data()?.patrolActionId
                if (patrolActionId === state.selectedEvent?._id) {
                    const patrolAction = document.data()?.patrolActionId
                    const filters = {
                        patrolAction: patrolAction,
                        status: 'ACTIVE',
                    }
                    state.attendances = await Services.getEventAttendances(state, filters)
                    await deleteDoc(doc(db, 'updateAttendanceEventReport', siteGroupId))
                }
            })

            onSnapshot(doc(db, 'updateCloseAttendanceEvent', siteGroupId), async document => {
                const patrolActionId = document.data()?.patrolActionId
                if (patrolActionId) {
                    await state.filter()
                    if (patrolActionId === state.selectedEvent?._id) {
                        state.selectedEvent = null
                        state.attendances = []
                    }
                    await deleteDoc(doc(db, 'updateCloseAttendanceEvent', siteGroupId))
                }
            })

            onSnapshot(doc(db, 'updateAttendanceEvent', siteGroupId), async document => {
                if (document?.data()?.attendance) {
                    const attendance = JSON.parse(document.data()?.attendance)
                    const operator = JSON.parse(document.data()?.operator)
                    const patrolActionId = document.data()?.patrolActionId
                    await state.filter()
                    if (patrolActionId === state.selectedEvent?._id) {
                        attendance.operator = operator
                        state.selectedEvent.attendance = attendance
                    }
                    await deleteDoc(doc(db, 'updateAttendanceEvent', siteGroupId))
                }
            })
        }
    },
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

.panel-body {
    max-height: 80vh !important;
    overflow-y: auto !important;
}

.panel-attendance-body {
    max-height: 88vh !important;
    overflow-y: auto !important;
}

.overflow-y {
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

.disabled-icon {
    color: #ccc;
}

.small-icon {
    font-size: 0.5rem;
    margin: 0 0rem;
    color: var(--app-component-color);
}

.pd-0 {
    padding-top: 0;
}

.dot {
    position: absolute;
    bottom: 0.8rem;
    right: 0.8rem;
}
.animated-dot {
    animation: blinker 1s linear infinite;
}

.dot-color {
    color: lightskyblue;
    font-size: 0.5rem;
}

@keyframes blinker {
    50% {
        opacity: 0;
    }
}

img {
    max-width: 100% !important;
    display: block;
}

.center-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin-top: 22%;
}

.list-group-selected {
    color: var(--app-component-hover-color);
    background-color: var(--app-component-hover-bg);
}

.no-events {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    text-align: center;
}

.no-events h3 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.no-events p {
    color: #777;
    margin-bottom: 20px;
}

.no-events-icon {
    width: 80px;
    height: 80px;
}
</style>
