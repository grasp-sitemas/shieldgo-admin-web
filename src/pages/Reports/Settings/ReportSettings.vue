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
                    <select
                        v-model="data.account"
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
                    <div class="invalid-feedback">{{ $t('str.register.report.settings.account.required') }}</div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label" for="reportNameField">{{ $t('str.register.report.name.field') }}</label>
                    <select v-model="data.reportName" class="form-select" id="reportNameField"
                        v-bind:class="checkRequiredField('reportName') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('reportName')"
                    >
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="report in reportNames" :value="report._id" :key="report._id">
                            {{ $t(report.name) }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.report.type.required') }}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="control-label fw-bold">
                        <label class="form-label">{{ $t('str.report.dispatchTime') }}</label>
                    </div>
                    <input type="time" class="form-control" v-model="data.dispatchTime"
                        v-bind:class="checkRequiredField('dispatchTime') ? 'is-invalid' : ''"
                        @focus="removeRequiredField('dispatchTime')">
                    <div class="invalid-feedback">{{ $t('str.register.report.dispatchTime.required') }}</div>
                </div>
            </div>

            <div class="col-md-12 mb-3">
                <label class="form-label" for="additionalEmailField">{{ $t('str.register.report.settings.emails.field') }}</label>
                <span class="text-info float-end">{{ $t('str.register.report.settings.emails.info') }}</span>
                <v-select
                    taggable
                    multiple
                    key="additionalEmailField"
                    v-model="data.emails"
                    :options="data.emails"
                    @input="tagArray => handleTag(tagArray)"
                    push-tags
                />
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
    },
    watch: {
        selectedData: async function () {
            this.data = this?.selectedData

            this.newStatus = this.data?.status
            
            if (!this.data?.account) {
                this.data.account = await Common.getAccountId(this)
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
        }
    },
    created() {
        Controller.init(this)
    },

    methods: Controller.methods,
}
</script>
<style lang="scss">
</style>
