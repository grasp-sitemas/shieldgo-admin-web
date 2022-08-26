<template>
    <div class="row">
        <div class="col-xl-12">
            <div class="card-box">
                <div class="form-row">
                    <div class="col-md-11">
                        <p class="sub-header">
                            {{ $t('string.msg.list.user.label.description') }}
                        </p>
                    </div>
                    <div class="col-md-1" v-if="items">
                        <h4 class="text-center">{{ $t('str.total') }}</h4>
                        <h4 class="text-center" style="color: grey">{{ items.length }}</h4>
                        <div class="text-right d-print-none mr-2">
                            <a href="javascript:window.print()" class="btn btn-primary waves-effect waves-light"><i class="mdi mdi-printer mr-1"></i> Print</a>
                        </div>
                    </div>
                </div>

                <form>
                    <div class="form-group col-md-6">
                        <label for="inputAddress" class="col-form-label">
                            <strong>{{ $t('string.msg.companies.label') }}</strong>
                        </label>
                        <multiselect
                            v-model="filters.company"
                            @input="filter(filters.company)"
                            :options="companies"
                            :close-on-select="true"
                            track-by="_id"
                            :custom-label="customLabelCompany"
                            :searchable="true"
                            placeholder="Selecione"
                        >
                        </multiselect>
                    </div>

                    <div class="d-flex justify-content-end bd-highlight mb-3">
                        <download-excel v-if="items.length > 0" class="btn btn-primary" :fetch="fetchData" :fields="json_fields" :meta="json_meta" type="csv" name="funcionarios.csv">
                            <label class="download-csv">Download CSV</label>
                        </download-excel>
                    </div>
                </form>
                <div class="pb-0 pt-3">
                    <jw-pagination :items="items" class="elevation" @changePage="onChangePage" :labels="customLabels"></jw-pagination>
                </div>
                <div class="table-responsive">
                    <table class="table table-centered table-hover mb-0" id="datatable">
                        <thead class="thead-dark">
                            <tr>
                                <th class="border-top-0">{{ $t('string.msg.table.list.user.label.name') }}</th>
                                <th class="border-top-0">{{ $t('string.msg.list.user.label.subtype') }}</th>
                                <th class="border-top-0">{{ $t('string.msg.list.user.label.employedType') }}</th>
                                <th class="border-top-0">{{ $t('string.msg.list.user.label.phone') }}</th>
                                <th class="border-top-0">{{ $t('string.msg.list.user.label.company') }}</th>
                                <th class="border-top-0">{{ $t('string.msg.table.list.user.label.status') }}</th>
                            </tr>
                        </thead>
                        <tbody v-bind:key="item._id" v-for="item in pageOfItems" class="cursor-pointer" @click="selectItem(item)">
                            <tr v-if="item.status == 'ACTIVE' && item.companyUser.subtype != 'ADMIN_MASTER'">
                                <td>
                                    <span v-if="item.firstName">
                                        {{ camelize(item.firstName) }}
                                    </span>
                                    <span v-if="item.lastName">
                                        {{ ' ' + camelize(item.lastName) }}
                                    </span>
                                </td>
                                <td>
                                    <span v-if="item.companyUser && item.companyUser.subtype && item.companyUser.subtype == 'ADMIN_MASTER'">
                                        {{ $t('string.msg.point.type.admin_master') }}
                                    </span>
                                    <span v-if="item.companyUser && item.companyUser.subtype && item.companyUser.subtype == 'ADMIN'">
                                        {{ $t('string.msg.point.type.master') }}
                                    </span>
                                    <span v-if="item.companyUser && item.companyUser.subtype && item.companyUser.subtype == 'EMPLOYEE'">
                                        {{ $t('string.msg.point.type.employee') }}
                                    </span>
                                </td>
                                <td>
                                    <span v-if="item.companyUser && item.companyUser.employedType == 'TRICYCLE'">
                                        {{ $t('string.msg.point.employedType.tricycle') }}
                                    </span>
                                    <span v-else-if="item.companyUser && item.companyUser.employedType == 'ROLLON'">
                                        {{ $t('string.msg.point.employedType.rollon') }}
                                    </span>
                                    <span v-else-if="item.companyUser && item.companyUser.employedType == 'PEV'">
                                        {{ $t('string.msg.point.employedType.pev') }}
                                    </span>
                                    <span v-else-if="!item.companyUser.employedType">
                                        <strong> - </strong>
                                    </span>
                                </td>
                                <td>
                                    <span v-if="item.primaryPhone">
                                        {{ item.primaryPhone }}
                                    </span>
                                </td>
                                <td>
                                    <span v-if="item.companyUser && item.companyUser.company && item.companyUser.company.fantasyName">
                                        {{ toUpperCase(item.companyUser.company.fantasyName) }}
                                    </span>
                                </td>
                                <td>
                                    <span v-if="item.status">
                                        {{ camelize($t(item.status)) }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-if="errors.length" class="alert alert-danger">
                    <p class="lead">{{ $t('response.msg.error.empty.fields') }}</p>
                    <ul>
                        <li v-bind:key="error" v-for="error in errors">{{ error }}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Controller from './CrtListUser'
import Spinner from '../../../components/layout/Spinner'
import Toast from '../../../components/layout/Toast'
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
Vue.prototype.$eventHub = new Vue()
Vue.component('downloadExcel', JsonExcel)

export default {
    name: 'ListUser',
    props: ['valuekey'],
    watch: {
        valuekey() {},
    },
    components: {
        Spinner,
        Toast,
    },
    data() {
        return {
            errors: [],
            titleToast: null,
            messageToast: null,
            messageIdToast: null,
            items: [],
            services: [],
            companies: [],
            userType: null,
            PageNumbers: 1,
            pageOfItems: [],
            filters: {
                status: 'ACTIVE',
                name: '',
                company: null,
            },
            customLabels: {
                first: 'Primeira',
                last: 'Último',
                previous: 'Anterior',
                next: 'Próxima',
            },
            json_fields: {
                Nome: 'firstName',
                Sobrenome: 'lastName',
                Email: 'email',
                Telefone: 'primaryPhone',
                'Tipo de funcionario': 'companyUser.employedType',
            },
            json_data: [
                {
                    firstName: null,
                    lastName: null,
                    emial: null,
                    primaryPhone: null,
                    companyUser: {
                        employedType: null,
                    },
                },
            ],
            json_meta: [
                [
                    {
                        key: 'charset',
                        value: 'utf-8',
                    },
                ],
            ],
        }
    },
    methods: Controller.methods,
    created() {
        let state = this
        this.$eventHub.$on('refreshList', function () {
            state.filter()
        })
    },
    mounted() {
        Controller.init(this)
    },
}
</script>

<style>
</style>
