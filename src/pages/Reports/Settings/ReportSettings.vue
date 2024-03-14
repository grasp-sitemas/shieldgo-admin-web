<template>
    <b-modal no-close-on-backdrop id="createReportSettingsModal" @hide="closeModal" :hide-footer="true" size="lg" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.breadcrumb.report.settings') }}</h4>
            <a class="btn-close cursor_pointer" @click="closeModal"></a>
        </template>

        <div>
            <div v-if="data._id && data.status === 'ARCHIVED'" class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                    <select v-model="data.status" class="form-select" id="statusField">
                        <option value="ACTIVE">{{ $t('str.register.status.active') }}</option>
                        <option value="ARCHIVED">{{ $t('str.register.status.archived') }}</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div v-if="isSuperAdminMaster" class="col-md-6 mb-3">
                    <label class="form-label" for="accountField">{{ $t('str.register.report.settings.account.field') }}</label>
                    <select v-model="data.account" class="form-select" v-bind:class="checkRequiredField('account') ? 'is-invalid' : ''" @focus="removeRequiredField('account')" id="accountField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="account in accounts" :value="account._id" :key="account._id">
                            {{ account.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.report.settings.account.required') }}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label" for="reportNameField">{{ $t('str.register.report.name.field') }}</label>
                    <select v-model="data.reportName" class="form-select" id="reportNameField" v-bind:class="checkRequiredField('reportName') ? 'is-invalid' : ''" @focus="removeRequiredField('reportName')">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="report in reportNames" :value="report._id" :key="report._id">
                            {{ $t(report.name) }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.report.type.required') }}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label" for="periodField">{{ $t('str.register.report.period.field') }}</label>
                    <select
                        v-model="data.period"
                        class="form-select"
                        id="periodField"
                        v-bind:class="checkRequiredField('period') ? 'is-invalid' : ''"
                        @change="changePeriod()"
                        @focus="removeRequiredField('period')"
                    >
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="period in periods" :value="period._id" :key="period._id">
                            {{ $t(period.name) }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.report.period.required') }}</div>
                </div>

                <div v-if="data.period === 'WEEKLY'" class="col-md-6 mb-3">
                    <label for="weeklyDayField">{{ $t('str.register.report.settings.weeklyDay.field') }}</label>
                    <select v-model="data.weeklyDay" class="form-select" id="weeklyDayField" v-bind:class="checkRequiredField('weeklyDay') ? 'is-invalid' : ''" @focus="removeRequiredField('weeklyDay')">
                        <option :value="null">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="day in weeklyDays" :value="day.value" :key="day.value">
                            {{ day.text }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.report.settings.weeklyDay.required') }}</div>
                </div>

                <div v-if="data.period === 'MONTHLY'" class="col-md-6 mb-3">
                    <label for="monthlyDayField">{{ $t('str.register.report.settings.monthlyDay.field') }}</label>
                    <select v-model="data.monthlyDay" class="form-select" id="monthlyDayField" v-bind:class="checkRequiredField('monthlyDay') ? 'is-invalid' : ''" @focus="removeRequiredField('monthlyDay')">
                        <option :value="null">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="day in monthlyDays" :value="day.value" :key="day.value">
                            {{ day.text }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.report.settings.monthlyDay.required') }}></div>
                </div>

                <div class="col-md-6 mb-3">
                    <div class="control-label fw-bold">
                        <label class="form-label">{{ $t('str.report.dispatchTime') }}</label>
                    </div>
                    <input type="time" class="form-control" v-model="data.dispatchTime" v-bind:class="checkRequiredField('dispatchTime') ? 'is-invalid' : ''" @focus="removeRequiredField('dispatchTime')" />
                    <div class="invalid-feedback">{{ $t('str.register.report.dispatchTime.required') }}</div>
                </div>

                <div class="col-md-6 mb-3">
                    <label for="emailLanguageField" class="form-label">{{ $t('str.emailLanguage.field') }}</label>
                    <select
                        v-model="data.emailLanguage"
                        class="form-select"
                        id="emailLanguageField"
                        v-bind:class="checkRequiredField('emailLanguage') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('emailLanguage')"
                    >
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option value="pt-BR">{{ $t('str.portugueseBrazil') }}</option>
                        <option value="en">{{ $t('str.english') }}</option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.report.settings.emailLanguage.required') }}</div>
                </div>
            </div>

            <div class="col-md-12 mb-3">
                <label class="form-label" for="additionalEmailField">{{ $t('str.register.report.settings.emails.field') }}</label>
                <span class="text-info float-end">{{ $t('str.register.report.settings.emails.info') }}</span>
                <v-select taggable multiple key="additionalEmailField" v-model="data.emails" :options="data.emails" @input="tagArray => handleTag(tagArray)" push-tags />
            </div>

            <div class="btn-center mt-4 mb-2">
                <button @click="checkForm" type="submit" class="btn btn-primary is-loading w-25 m-2">
                    <i v-if="isLoading === true" class="fas fa-spinner fa-pulse"></i>
                    {{ $t('str.btn.save') }}
                </button>
                <button v-if="data._id && data.status === 'ACTIVE'" v-on:click="confirmArchive" type="submit" class="btn btn-warning w-25 m-2">
                    {{ $t('str.btn.archive') }}
                </button>
                <button @click="closeModal()" type="submit" class="btn btn-default w-25 m-2">{{ $t('str.btn.close') }}</button>
            </div>
        </div>

        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </b-modal>
</template>

<script>
import Controller from './CrtReportSettings.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()
import { reportConfig } from '../../../types/reportConfig'
import Common from '../../../common/Common.vue'
import { REPORT_SETTINGS_PERIODS } from '../../../utils/report-settings'

export default {
    props: {
        selectedData: {
            type: Object,
            default: () => {},
        },
        reportNames: {
            type: Array,
            default: () => [],
        },
        items: {
            type: Array,
            default: () => [],
        },
    },
    watch: {
        selectedData: async function () {
            this.data = this?.selectedData

            this.newStatus = this.data?.status

            if (!this.data?.account) {
                this.data.account = await Common.getAccountId(this)
            }

            if (!this.data?.period) {
                this.data.period = ''
            }

            this.errors = []
        },
    },
    data() {
        return {
            domain: null,
            isLoading: false,
            errors: [],
            accounts: [],
            valuekey: 0,
            isSuperAdminMaster: false,
            newStatus: '',
            data: JSON.parse(JSON.stringify(reportConfig)),
            reportConfigObj: JSON.parse(JSON.stringify(reportConfig)),
            periods: REPORT_SETTINGS_PERIODS,
            weeklyDays: [
                { value: 0, text: this.$t('str.sunday') },
                { value: 1, text: this.$t('str.monday') },
                { value: 2, text: this.$t('str.tuesday') },
                { value: 3, text: this.$t('str.wednesday') },
                { value: 4, text: this.$t('str.thursday') },
                { value: 5, text: this.$t('str.friday') },
                { value: 6, text: this.$t('str.saturday') },
            ],
            monthlyDays: Array.from({ length: 31 }, (_, i) => ({ value: i + 1, text: i + 1 })),
        }
    },
    created() {
        Controller.init(this)
    },

    methods: Controller.methods,
}
</script>
<style lang="scss"></style>
