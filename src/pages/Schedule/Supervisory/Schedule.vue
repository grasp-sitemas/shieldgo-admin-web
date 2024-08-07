<template>
    <div>
        <h1 class="page-header">{{ $t('str.form.title.schedules.supervisory.patrol') }}</h1>
        <hr />

        <div class="row">
            <div v-if="isSuperAdminMaster" class="col-md-4 mb-3">
                <label class="form-label" for="accountField">{{ $t('str.register.guard.groups.account.field') }}</label>
                <select v-model="filters.account" @change="changeAccount" class="form-select" id="accountField">
                    <option value="">{{ $t('str.register.select.placeholder') }}</option>
                    <option v-for="account in accounts" :value="account._id" :key="account._id">
                        {{ account.name }}
                    </option>
                </select>
                <div class="invalid-feedback">{{ $t('str.register.guard.groups.account.required') }}</div>
            </div>
            <div v-if="role === 'SUPER_ADMIN_MASTER' || role === 'ADMIN' || role === 'MANAGER'" class="col-md-4 mb-3">
                <label class="form-label" for="clientField">{{ $t('str.register.guard.groups.client.field') }}</label>
                <select v-model="filters.client" @change="changeClient" class="form-select" id="clientField">
                    <option value="">{{ $t('str.register.select.placeholder') }}</option>
                    <option v-for="client in clients" :value="client._id" :key="client._id">
                        {{ client.name }}
                    </option>
                </select>
                <div class="invalid-feedback">{{ $t('str.register.guard.groups.client.required') }}</div>
            </div>
        </div>

        <CreateScheduleModal :role="role" :selectedAppointment="selectedAppointment" :selectedDate="selectedDate" :accounts="accounts" :clients="clients" :isSuperAdminMaster="isSuperAdminMaster" />
        <FullCalendar :events="appointments" :options="calendarOptions"></FullCalendar>

        <div v-if="isLoading" class="spinner-overlay">
            <b-spinner label="Carregando..." style="width: 2rem; height: 2rem" type="border" variant="primary" />
        </div>

        <notifications group="top-right" position="top right" :speed="1000" />
    </div>
</template>

<script>
import moment from 'moment'
import Common from '../../../common/Common.vue'
import Controller from './CrtSchedule.vue'
import FullCalendar from '@fullcalendar/vue'
import CreateScheduleModal from './CreateScheduleModal/CreateScheduleModal.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        FullCalendar,
        CreateScheduleModal,
    },
    data() {
        return {
            calendarOptions: {},
            appointments: [],
            accounts: [],
            clients: [],
            isLoading: false,
            selectedAppointment: {},
            lastFetchedMonth: null,
            filters: {
                account: '',
                client: '',
                category: 'SUPERVISORY_PATROL',
                startDate: moment().startOf('month').utc(true).format(),
                endDate: moment().endOf('month').utc(true).format(),
                isSortByStartDate: true,
                isFullCalendar: true,
            },
            role: '',
            isSuperAdminMaster: false,
            selectedDate: '',
        }
    },
    methods: Controller.methods,
    created() {
        Controller.init(this)
        const state = this
        state.$registerEvent.$on('changeLanguage', function () {
            state.changeLanguage()
        })
        state.$registerEvent.$on('refreshSchedule', function () {
            if (state.filters.account) {
                state.getAppointments()
            }
        })
        state.$registerEvent.$on('cancelAppointment', function () {
            Common.show(state, 'top-right', 'success', state.$t('str.form.archive.success'))
            state.$bvModal.hide('createScheduleModal')

            if (state.filters.account) {
                state.getAppointments()
            }
        })
    },
}
</script>
<style scoped>
.spinner-overlay {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
