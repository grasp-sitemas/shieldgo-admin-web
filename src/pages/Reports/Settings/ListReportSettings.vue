<template>
    <div>
        <panel :title="$t('str.table.list.report.setting')" bodyClass="p-0">
            <div class="row ms-2 mb-1 mt-3 me-1">
                <div v-if="isSuperAdminMaster" class="col-md-3 mb-3">
                    <label class="form-label" for="accountField">{{ $t('str.register.report.setting.account.field') }}</label>
                    <select v-model="filters.account" @change="changeAccount" class="form-select" id="accountField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="account in accounts" :value="account._id" :key="account._id">
                            {{ account.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.report.setting.account.required') }}</div>
                </div>
                    
                <div class="col-md-3">
                    <label class="form-label" for="reportNameField">{{ $t('str.register.report.type.field') }}</label>
                    <select v-model="filters.reportName" @change="changeReportName" class="form-select" id="reportNameField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="report in reportNames" :value="report._id" :key="report._id">
                            {{ $t(report.name) }}
                        </option>
                    </select>
                </div>

                <div class="col-md-3">
                    <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                    <select v-model="filters.status" @change="filter" class="form-select" id="statusField">
                        <option value="ACTIVE">{{ $t('str.register.status.active') }}</option>
                        <option value="ARCHIVED">{{ $t('str.register.status.archived') }}</option>
                    </select>
                </div>
                <div class="col-md-3 mt-4" :class="{ 'mt-4': isSuperAdminMaster }">
                    <button @click="selectItem()" type="submit" class="btn btn-default w-50">{{ $t('str.btn.new.form') }}</button>
                </div>
            </div>
            <vue-good-table
                class="table-centered"
                :columns="columns"
                :rows="items"
                :lineNumbers="true"
                @on-row-click="selectItem"
                :search-options="{ enabled: true, placeholder: $t('str.table.search.in.this.table') }"
                :pagination-options="paginationOptions"
                tableLayout="fixed"
                :sort-options="{
                    enabled: true,
                    multipleColumns: true,
                }"
            >
                <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                    <i v-if="isLoading" class="fas fa-spinner fa-spin" />
                    <span v-if="!isLoading && items?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
                </div>

                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field === 'account'">
                        {{ props.formattedRow[props.column.field]?.name }}
                    </span>
                    <span v-else-if="props.column.field === 'emails'">
                        <p class="m-0 p-0" v-for="(email, emailIndex) in props.formattedRow[props.column.field]" :key="'email-' + emailIndex">
                            {{ email }}
                        </p>
                    </span>
                    <span v-else-if="props.column.field === 'createDate'">
                        {{ formatDate(props.formattedRow[props.column.field], true) }}
                    </span>
                    <span v-else-if="props.column.field === 'status'">
                        <span class="badge" v-bind:class="props.formattedRow[props.column.field] === 'ACTIVE' ? 'bg-success' : 'bg-danger'"> {{ $t(props.formattedRow[props.column.field]) }} </span>
                    </span>
                    <span v-else-if="props.column.field === 'reportName'">
                        {{ $t(props.formattedRow[props.column.field]) }}
                    </span>
                    <span v-else>
                        {{ props.formattedRow[props.column.field] }}
                    </span>
                </template>
            </vue-good-table>
        </panel>
        <ReportSettingsModal :selectedData="data" :reportNames="reportNames" :accounts="accounts"  />
        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </div>
</template>

<script>
import Controller from './CrtListReportSettings.vue'
import ReportSettingsModal from './ReportSettings.vue'
import { reportConfig } from '../../../types/reportConfig'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        ReportSettingsModal,
    },

    data() {
        return {
            items: [],
            isLoading: false,
            data: {},
            filters: {
                account: '',
                reportName: '',
                status: 'ACTIVE',
            },
            isSuperAdminMaster: false,
            reportConfigObj: JSON.parse(JSON.stringify(reportConfig)),
            accounts: [],
            columns: [],
            reportNames: [],
            paginationOptions: {},
        }
    },
    mounted() {
        Controller.init(this)
    },
    created() {
        let state = this
        this.$registerEvent.$on('refreshList', function () {
            state.filter()
        })
        this.$registerEvent.$on('changeLanguage', function () {
            state.initTable()
        })
    },
    methods: Controller.methods,
}
</script>
<style lang="scss">
.table-centered td, 
.table-centered th {
    vertical-align: middle !important; /* Centraliza verticalmente */
    text-align: left !important; /* Centraliza horizontalmente */
}
</style>

