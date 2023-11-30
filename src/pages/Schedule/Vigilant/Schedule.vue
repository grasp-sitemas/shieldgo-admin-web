<template>
    <div>
        <h1 class="page-header">{{ $t('str.form.title.schedules.vigilant.patrol') }}</h1>
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
            <div class="col-md-4 mb-3">
                <label class="form-label" for="siteField">{{ $t('str.register.guard.groups.site.field') }}</label>
                <select v-model="filters.site" @change="changeSite" class="form-select" id="siteField">
                    <option value="">{{ $t('str.register.select.placeholder') }}</option>
                    <option v-for="site in sites" :value="site._id" :key="site._id">
                        {{ site.name }}
                    </option>
                </select>
                <div class="invalid-feedback">{{ $t('str.register.guard.groups.site.required') }}</div>
            </div>
        </div>

        <CreateScheduleModal :role="role" :selectedAppointment="selectedAppointment" :selectedDate="selectedDate" :accounts="accounts" :clients="clients" :isSuperAdminMaster="isSuperAdminMaster" />
        <FullCalendar :events="appointments" :options="calendarOptions" />
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
            sites: [],
            isLoading: false,
            originalAppointments: [],
            selectedAppointment: {},
            lastFetchedMonth: null,
            filters: {
                account: '',
                client: '',
                site: '',
                category: 'SECURITY_PATROL',
                startDate: moment().utc(true).format(),
                endDate: moment().endOf('month').utc(true).format(),
                isSortByStartDate: true,
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
            state.getAppointments()
        })
        state.$registerEvent.$on('cancelAppointment', function () {
            state.getAppointments()
            state.$bvModal.hide('createScheduleModal')
            Common.show(state, 'bottom-right', 'success', state.$t('str.form.archive.success'))
        })
    },
}
</script>
