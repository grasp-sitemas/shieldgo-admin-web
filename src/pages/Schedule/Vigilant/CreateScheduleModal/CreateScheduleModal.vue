<template>
    <b-modal no-close-on-backdrop id="createScheduleModal" @hide="closeModal" :hide-footer="true" size="lg" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ data?._id ? $t('str.modal.schedule.title.information') : $t('str.modal.create.schedule.title.create') }}</h4>
            <span v-if="data?.status === 'ARCHIVED'" class="m-2 badge bg-danger rounded-5 cursor_pointer f-right"
                ><a>{{ $t('str.modal.schedule.status.archived') }}</a></span
            >
            <a class="btn-close cursor_pointer" @click="$bvModal.hide('createScheduleModal')"></a>
        </template>
        <div v-if="!isLoading">
            <div class="row">
                <div v-if="isSuperAdminMaster" class="col-md-4 mb-3">
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
                <div class="col-md-4 mb-3">
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
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="siteField">{{ $t('str.register.incident.site.field') }}</label>
                    <select
                        v-model="data.site"
                        :disabled="data._id ? true : updateAppointment ? true : false"
                        v-on:change="changeSite"
                        class="form-select"
                        v-bind:class="checkRequiredField('site') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('site')"
                        id="siteField"
                    >
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="site in siteList" :value="site._id" :key="site._id">
                            {{ site.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.incident.site.required') }}</div>
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
            <!-- 
            <div class="row">
                <div class="col-md-12 mb-3">
                    <label class="form-label" for="vigilantsField">{{ $t('str.register.schedule.invited.vigilants.field') }}</label>
                    <span v-show="!data._id" @click="removeAllVigilants()" disabled class="badge bg-dark rounded-5 cursor_pointer f-right badge-ml-5">{{
                        $t('str.register.schedule.remove.all.vigilants.label')
                    }}</span>
                    <span v-show="!data._id" @click="selectAllVigilants()" disabled class="badge bg-dark rounded-5 cursor_pointer f-right">{{ $t('str.register.schedule.select.all.vigilants.label') }}</span>

                    <v-select
                        taggable
                        multiple
                        :disabled="data._id ? true : false"
                        label="fullName"
                        key="vigilantsField"
                        v-model="data.vigilants"
                        @search:blur="removeRequiredField('vigilants')"
                        v-bind:class="checkRequiredField('vigilants') ? 'is-invalid' : ''"
                        :options="vigilants"
                        :create-option="vigilant => ({ _id: '' })"
                        :placeholder="$t('str.register.select.placeholder')"
                    />
                    <div class="invalid-feedback">{{ $t('str.register.schedule.vigilants.required') }}</div>
                </div>
            </div> -->

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
                        @focus="clearErrorDate('beginDate')"
                        id="beginDateField"
                        :placeholder="$t('str.register.schedule.starts.in.placeholder')"
                        @change="isValidBeginDate"
                        min="2021-01-01"
                        max="2100-12-31"
                        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                        required
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
                        @focus="clearErrorDate('endDate')"
                        id="endDateField"
                        :placeholder="$t('str.register.schedule.ends.in.placeholder')"
                        @change="isValidEndDate"
                        min="2021-01-01"
                        max="2100-12-31"
                        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                        required
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

            <div class="row">
                <label class="form-label" for="patrolPointsTable">{{ $t('str.register.schedule.patrol.points.table') }}</label>
                <vue-good-table
                    :columns="columns"
                    :rows="patrolPoints"
                    :search-options="{ enabled: true, placeholder: $t('str.table.search.in.this.table') }"
                    :lineNumbers="true"
                    :pagination-options="paginationOptions"
                    @on-selected-rows-change="selectionChanged"
                    :select-options="selectOptions"
                >
                    <div slot="emptystate" class="vgt-center-align vgt-text-disabled">{{ $t('str.table.subtitle.no.data') }}</div>
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field === 'type'">
                            {{ $t(props.formattedRow[props.column.field]) }}
                        </span>

                        <span v-else-if="props.column.field === 'geolocation'">
                            <span
                                v-if="
                                    props.formattedRow[props.column.field]?.latitude &&
                                    props.formattedRow[props.column.field]?.longitude &&
                                    props.formattedRow[props.column.field]?.latitude?.length > 0 &&
                                    props.formattedRow[props.column.field]?.longitude?.length > 0
                                "
                            >
                                {{ 'Lat: ' + props.formattedRow[props.column.field]?.latitude + ' Lng: ' + props.formattedRow[props.column.field]?.longitude }}
                            </span>
                            <span v-else>
                                <i class="fas fa-ban"></i>
                            </span>
                        </span>
                        <span v-else>
                            {{ props.formattedRow[props.column.field] }}
                        </span>
                    </template>
                </vue-good-table>
                <div class="invalid-feedback">{{ $t('str.register.schedule.patrol.points.required') }}</div>
            </div>

            <div class="row mb-3 mt-10px">
                <div class="col-md-4 mb-2">
                    <div class="form-check">
                        <input
                            v-model="data.notifyVigilants"
                            :disabled="data._id ? true : false"
                            class="form-check-input cursor-pointer"
                            type="checkbox"
                            :value="data.notifyVigilants"
                            id="notifyVigilantsCheck"
                        />
                        <label class="form-check-label cursor-pointer" for="notifyVigilantsCheck">{{ $t('str.register.schedule.notify.vigilants.field') }} </label>
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
export default {
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
        sites: {
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
        sites: function () {
            this.siteList = this.sites
        },
    },
    data() {
        return {
            isLoading: false,
            isSaveLoading: false,
            isPastDate: false,
            updateAppointment: false,
            updateSchedule: false,
            appointment: {},
            errors: [],
            accountList: [],
            clientList: [],
            siteList: [],
            patrolPoints: [],
            vigilants: [],
            frequencies: FREQUENCIES,
            weeklyDays: WEEKLY_DAYS,
            months: MONTHS,
            table: null,
            data: schedule,
            scheduleObj: schedule,
            columns: [],
            paginationOptions: {},
            selectOptions: {
                enabled: true,
            },
        }
    },
    methods: Controller.methods,
    mounted() {
        Controller.init(this)
    },
    created() {
        let state = this
        state.$registerEvent.$on('changeLanguage', function () {
            state.initTable()
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
</style>
