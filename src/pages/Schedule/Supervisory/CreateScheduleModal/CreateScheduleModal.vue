<template>
    <b-modal no-close-on-backdrop id="createScheduleModal" @hide="closeModal" :hide-footer="true" size="lg" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">
            {{ data._id }}
            {{ updateAppointment }}
            {{ updateSchedule }}
                <span v-if="data?._id && !updateAppointment && !updateSchedule">{{ $t('str.modal.schedule.information') }}</span>
                <span v-if="!data?._id && !updateAppointment && !updateSchedule">{{ $t('str.modal.schedule.new') }}</span>
                <span v-else-if="updateSchedule">{{ $t('str.modal.schedule.title.edit.serie') }}</span>
                <span v-else-if="updateAppointment">{{ $t('str.modal.schedule.title.edit.ocurrence') }}</span>

            </h4>
            <span v-if="data?.status === 'ARCHIVED'" class="m-2 badge bg-danger rounded-5 cursor_pointer f-right"
                ><a>{{ $t('str.modal.schedule.status.archived') }}</a></span
            >
            <a class="btn-close cursor_pointer" @click="$bvModal.hide('createScheduleModal')"></a>
        </template>
        <div v-if="!isLoading">
            <div class="row">
                <div v-if="isSuperAdminMaster" class="col-md-6 mb-3">
                    <label class="form-label" for="accountField">{{ $t('str.register.incident.account.field') }}</label>
                    <select
                        v-model="data.account"
                        v-on:change="changeAccount"
                        :disabled="data._id ? true : updateAppointment ? true : false"
                        class="form-select"
                        v-bind:class="checkRequiredField('account') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('account')"
                        id="accountField"
                    >
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="account in accountList" :value="account._id" :key="account._id">
                            {{ account.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.incident.account.required') }}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label" for="clientField">{{ $t('str.register.incident.client.field') }}</label>
                    <select
                        v-model="data.client"
                        v-on:change="changeClient"
                        :disabled="data._id ? true : updateAppointment ? true : false"
                        class="form-select"
                        v-bind:class="checkRequiredField('client') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('client')"
                        id="clientField"
                    >
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="client in clientList" :value="client._id" :key="client._id">
                            {{ client.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.incident.client.required') }}</div>
                </div>
               
            </div>

            <div class="row">
                <div class="col-md-12 mb-3">
                    <label class="form-label" for="nameField">{{ $t('str.register.schedule.name.field') }}</label>
                    <input
                        v-model="data.name"
                        :disabled="data._id ? true : updateAppointment ? true : false"
                        type="text"
                        class="form-control"
                        v-bind:class="checkRequiredField('name') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('name')"
                        id="nameField"
                        :placeholder="$t('str.register.schedule.name.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.schedule.name.required') }}</div>
                </div>
            </div>
           

            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="frequencyField">{{ $t('str.register.schedule.frequency.field') }}</label>
                    <select
                        v-model="data.frequency"
                        :disabled="data._id ? true : updateAppointment ? true : false"
                        @change="changeFrequency()"
                        class="form-select"
                        v-bind:class="checkRequiredField('frequency') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('frequency')"
                        id="frequencyField"
                    >
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="frequency in frequencies" :value="frequency.value" :key="frequency.value">
                            {{ $t(frequency.label) }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.schedule.frequency.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="beginDateField">{{ $t('str.register.schedule.starts.in.field') }}</label>
                    <input
                        v-model="data.beginDate"
                        :disabled="data._id ? true : updateAppointment ? true : false"
                        type="date"
                        class="form-control"
                        v-bind:class="checkRequiredField('beginDate') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('beginDate')"
                        id="beginDateField"
                        :placeholder="$t('str.register.schedule.starts.in.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.schedule.starts.in.required') }}</div>
                </div>

                <div class="col-md-4 mb-3">
                    <label class="form-label" for="endDateField">{{ $t('str.register.schedule.ends.in.field') }}</label>
                    <input
                        v-model="data.endDate"
                        :disabled="data._id ? true : updateAppointment ? true : false"
                        type="date"
                        class="form-control"
                        v-bind:class="checkRequiredField('endDate') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('endDate')"
                        id="endDateField"
                        :placeholder="$t('str.register.schedule.ends.in.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.schedule.ends.in.required') }}</div>
                </div>
            </div>

            <div class="row mb-3" v-if="data.frequency === 'WEEKLY'">
                <label class="form-label" for="startDateField">{{ $t('str.register.schedule.weekly.days.field') }}</label>
                <div class="d-flex flex-wrap">
                    <div class="form-check form-switch mb-2 me-3" v-bind:key="item.value" v-for="item in this.weeklyDays">
                        <input
                            v-model="data.weeklyDays"
                            :disabled="data._id ? true : updateAppointment ? true : false"
                            :id="item.value"
                            :value="item.value"
                            :true-value="item.value"
                            class="form-check-input cursor_pointer"
                            type="checkbox"
                        />
                        <label class="form-check-label cursor_pointer" :for="item.value">{{ $t(item.label) }}</label>
                    </div>
                </div>
            </div>

            <div class="row mb-3" v-if="data.frequency === 'MONTHLY'">
                <div class="col-md-4">
                    <label class="form-label" for="monthlyDayFrequencyField">{{ $t('str.register.schedule.frequency.monthly.day.field') }}</label>
                    <input
                        v-model="data.frequencyMonth.day"
                        :disabled="data._id ? true : updateAppointment ? true : false"
                        type="number"
                        class="form-control"
                        min="1"
                        max="31"
                        @blur="verifyMonthDay()"
                        v-bind:class="checkRequiredField('frequencyMonthDay') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('frequencyMonthDay')"
                        id="monthlyDayFrequencyField"
                        :placeholder="$t('str.register.schedule.frequency.monthly.day.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.schedule.frequency.monthly.day.required') }}</div>
                </div>
            </div>

            <div class="row" v-if="data.frequency === 'YEARLY'">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="yearlyMonthFrequencyField">{{ $t('str.register.schedule.frequency.yearly.month.field') }}</label>
                    <select
                        v-model="data.frequencyYear.month"
                        :disabled="data._id ? true : updateAppointment ? true : false"
                        class="form-select"
                        v-bind:class="checkRequiredField('frequencyYearMonth') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('frequencyYearMonth')"
                        id="yearlyMonthFrequencyField"
                    >
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="month in months" :value="month.value" :key="month.value">
                            {{ $t(month.label) }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.schedule.frequency.year.month.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="yearlyDayFrequencyField">{{ $t('str.register.schedule.frequency.yearly.day.field') }}</label>
                    <input
                        v-model="data.frequencyYear.day"
                        :disabled="data._id ? true : updateAppointment ? true : false"
                        type="number"
                        class="form-control"
                        min="1"
                        max="31"
                        @blur="verifyDay()"
                        v-bind:class="checkRequiredField('frequencyYearDay') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('frequencyYearDay')"
                        id="yearlyDayFrequencyField"
                        :placeholder="$t('str.register.schedule.frequency.year.day.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.schedule.frequency.year.month.required') }}</div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="beginHourField">{{ $t('str.register.schedule.begin.hour.field') }}</label>
                    <input
                        v-model="data.beginHour"
                        :disabled="data._id ? true : false"
                        type="time"
                        class="form-control"
                        v-bind:class="checkRequiredField('beginHour') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('beginHour')"
                        id="beginHourField"
                        :placeholder="$t('str.register.schedule.begin.hour.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.schedule.begin.hour.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="endHourField">{{ $t('str.register.schedule.end.hour.field') }}</label>
                    <input
                        v-model="data.endHour"
                        :disabled="data._id ? true : false"
                        type="time"
                        class="form-control"
                        v-bind:class="checkRequiredField('endHour') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('endHour')"
                        id="endHourField"
                        :placeholder="$t('str.register.schedule.end.hour.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.schedule.end.hour.required') }}</div>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="timeSlotField">{{ $t('str.register.schedule.timeSlot.field') }}</label>
                    <input
                        v-model="data.timeSlot"
                        :disabled="data._id ? true : false"
                        type="number"
                        min="1"
                        max="120"
                        class="form-control"
                        id="timeSlotField"
                        :placeholder="$t('str.register.schedule.timeSlot.placeholder')"
                    />
                </div>
            </div>

        
            <div style="display: flex;" class="mb-2">
                <label class="form-label mt-1 mr-1" for="patrolPointsTable">{{ $t('str.register.schedule.add.patrol.points.table') }}</label>
                <hr style="flex-grow: 1; margin-left: 10px;"/>
            </div>


            <div class="row">
                            
                <div class="col-md-10 mb-3">
                    <label class="form-label" for="vigilantsField">{{ $t('str.register.schedule.invited.patrol.points.field') }}</label>
                    <span v-show="!data._id" @click="removeAllPatrolPoints()" disabled class="badge bg-dark rounded-5 cursor_pointer f-right badge-ml-5">{{
                        $t('str.register.schedule.remove.all.patrol.points.label')
                    }}</span>
                    <span v-show="!data._id" @click="selectAllPatrolPoints()" disabled class="badge bg-dark rounded-5 cursor_pointer f-right">{{ $t('str.register.schedule.select.all.patrol.points.label') }}</span>
                    <v-select
                        taggable
                        multiple
                        :disabled="data._id ? true : false"
                        :searchable="true"
                        :clearable="true"
                        label="name"
                        key="patrolPointsFields"
                        v-model="selectedPatrolPoints"
                        @search:blur="removeRequiredField('patrolPoints')"
                        v-bind:class="checkRequiredField('patrolPoints') ? 'is-invalid' : ''"
                        :options="patrolPoints"
                        :placeholder="$t('str.register.select.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.schedule.patrol.points.required') }}</div>
                </div>

                <div class="col-md-2 mt-4">
                    <button @click="addPatrolPoints()" class="btn btn-warning" type="button" :disabled="selectedPatrolPoints?.length > 0 ? false : true">
                        {{ $t('str.patrol.points.add.button') }}
                    </button>
                </div>
           
            </div>

            <vue-good-table
                class="table-container"
                :columns="columns"
                :rows="data.points"
                :search-options="{ enabled: true, placeholder: $t('str.table.search.in.this.table') }"
                :lineNumbers="true"
                @on-row-click="selectItem"
            >

                <div slot="emptystate" class="vgt-center-align vgt-text-disabled">{{ $t('str.table.subtitle.no.data') }}</div>
                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field === 'type'">
                        {{ $t(props.formattedRow[props.column.field]) }}
                    </span>
                    <span v-else-if="props.column.field === 'geolocation'" class="icon-cell">
                        <i v-on:click="showMap()" class="fas fa-map-marker-alt cursor_pointer" />
                    </span>
                    <span v-else-if="props.column.field === 'actions'" class="icon-cell">
                        <i v-on:click="removeRow(props.row)" class="fas fa-trash-alt cursor_pointer" />
                    </span>
                    <span v-else>
                        {{ props.formattedRow[props.column.field] }}
                    </span>
                </template>
            </vue-good-table>
            
            <div class="align-right mt-3 mb-2" style="text-align: right;">
                <button 
                    v-if="(data.points?.length > 0 && (updateAppointment || updateSchedule)) || (!data._id && data.points?.length > 0)" 
                    @click="clearCheckPoints()" class="btn btn-primary" type="button" style="margin-right: 10px;" >
                    <i class="fas fa-eraser"></i>
                    {{ $t('str.btn.clear.table') }}
                </button>
                <button 
                    v-if="(data.points?.length > 0 && (updateAppointment || updateSchedule)) || (!data._id && data.points?.length > 0)" 
                    @click="createRoute()" class="btn btn-primary" type="button" style="margin-right: 10px;" >
                    <i class="fas fa-route"></i>
                    {{ $t('str.patrol.points.create.route.button') }}
                </button>
                <button 
                    v-if="(updateAppointment || updateSchedule) || !data._id" 
                    @click="loadRoute()" class="btn btn-primary" type="button" >
                    <i class="fas fa-upload"></i>
                    {{ $t('str.patrol.points.load.route.button') }}
                </button>
            </div>

            <div class="invalid-feedback">{{ $t('str.register.schedule.patrol.points.required') }}</div>

            <div class="row mb-3 mt-10px">
                <div class="col-md-4">
                    <div class="form-check">
                        <input
                            v-model="data.notifyVigilants"
                            :disabled="data._id ? true : false"
                            class="form-check-input cursor-pointer"
                            type="checkbox"
                            :value="data.notifyVigilants"
                            id="notifyVigilantsCheck"
                        />
                        <label class="form-check-label cursor-pointer" for="notifyVigilantsCheck">{{ $t('str.register.schedule.notify.supervisors.field') }} </label>
                    </div>
                </div>
            </div>

            <div class="row" v-if="role !== 'AUDITOR'">
                <div class="col-md-12 mb-3">
                    <div class="btn-center mt-4 mb-2">
                        <button v-if="!data._id" @click="checkForm" type="submit" class="btn btn-primary w-200px me-10px is-loading">
                            <i v-if="isSaveLoading === true" class="fas fa-spinner fa-pulse"></i>
                            {{ $t('str.btn.save') }}
                        </button>
                        <button v-if="data._id && !isPastDate" v-on:click="confirmEdit" type="submit" class="ms-10px btn btn-primary w-200px">
                            {{ $t('str.btn.edit') }}
                        </button>
                        <button v-if="data._id && !isPastDate" v-on:click="confirmArchive" type="submit" class="ms-10px btn btn-warning w-200px">
                            {{ $t('str.btn.delete') }}
                        </button>
                        <button @click="closeModal()" type="submit" class="ms-10px btn btn-secondary w-200px">
                            {{ $t('str.btn.close') }}
                        </button>
                    </div>
                </div>
            </div>

            <notifications group="bottom-right" position="bottom right" :speed="500" />
            <Map :data="patrolPointItem" />
            <ItineraryModal
                :account="data.account"
                :client="data.client"
                :patrolPoints="data.points"
            />
            <ItineraryListModal :itineraryList="itineraries" 
                @selected-row="updateSelectedItinerary($event)"
            />
        </div>
        <div v-else class="center-spinner">
            <i class="fas fa-spinner fa-spin" />
        </div>
        <notifications group="bottom-right" position="bottom right" :speed="500" />

    </b-modal>
</template>

<script>
import Controller from './CrtCreateScheduleModal.vue'
import { FREQUENCIES, WEEKLY_DAYS, MONTHS } from '../../../../utils/schedules.js'
import { schedule } from '../../../../types/schedule'
import { moment } from 'moment'
import Map from '../Map/Map.vue'
import ItineraryModal from '../ItineraryModal/ItineraryModal.vue'
import ItineraryListModal from '../ItineraryModal/ItineraryListModal.vue'
import Services from '../../../../common/Services.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        Map,
        ItineraryModal,
        ItineraryListModal
    },
    props: {
        selectedDate: {
            type: String,
            default: () => {
                return moment().format('YYYY-MM-DD')
            },
        },
        selectedAppointment: {
            type: Object,
            default: () => {},
        },
        accounts: {
            type: Array,
            default: () => [],
        },
        clients: {
            type: Array,
            default: () => [],
        },
        isSuperAdminMaster: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            default: '',
        },
    },
    watch: {
        selectedAppointment: async function () {
            this.data = this?.selectedAppointment

            this.initSelectedAppointment()
        },
        selectedDate: function () {
            this.data.beginDate = String(this.selectedDate)
        },
        accounts: function () {
            this.accountList = this.accounts
        },
        clients: function () {
            this.clientList = this.clients
        },
    },
    data() {
        return {
            isLoading: false,
            isSaveLoading: false,
            isPastDate: false,
            updateAppointment: false,
            updateSchedule: false,
            patrolPointItem: {},
            appointment: {},
            selectedItinerary: null,
            errors: [],
            accountList: [],
            clientList: [],
            patrolPoints: [],
            selectedPatrolPoints: [],
            vigilants: [],
            itineraries: [],
            frequencies: FREQUENCIES,
            weeklyDays: WEEKLY_DAYS,
            months: MONTHS,
            table: null,
            data: schedule,
            scheduleObj: schedule,
            columns: [],
        }
    },
    methods: Controller.methods,
    mounted() {
        Controller.init(this)
    },
    async created() {
        let state = this

        state.$registerEvent.$on('changeLanguage', function () {
            state.initTable()
        })

        state.$registerEvent.$on('refreshItinerary', async function () {
            state.itineraries = await Services.getItinerariesByClient(state, state.data?.client)
        })

    },
}
</script>
<style lang="scss" scoped>
.center-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin-top: 30%;
    margin-bottom: 30%;
}
.table-container {
  max-height: 320px;
  overflow-y: auto;
}

.icon-cell {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
