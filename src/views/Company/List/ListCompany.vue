<template>
    <div class="row">
        <div class="col-xl-12">
            <div class="card-box">
                <div class="form-row">
                    <div class="col-md-11">
                        <p class="sub-header">
                            {{ $t('string.msg.list.company.label.description') }}
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
                    <div class="form-row">
                        <div class="form-group col-md-6" v-if="userType != null && userType == 'SEARCH-USER'">
                            <label for="inputAddress" class="col-form-label">
                                {{ $t('string.msg.list.user.company.search') }}
                            </label>
                            <input type="text" v-model="filters.name" class="form-control" />
                        </div>
                        <div class="form-group col-md-6" v-else-if="userType == 'SEARCH-USER-COMPANY'">
                            <label for="inputAddress" class="col-form-label">
                                {{ $t('string.msg.companies.search.label.name.company') }}
                            </label>
                            <input type="text" v-model="filters.name" class="form-control" />
                        </div>
                    </div>
                    <br />

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
                                <th class="border-top-0">{{ $t('string.msg.table.list.user.label.fantasyName') }}</th>
                                <th class="border-top-0">{{ $t('string.msg.table.list.user.label.socialName') }}</th>
                                <th class="border-top-0">{{ $t('string.msg.list.user.label.phone') }}</th>
                                <th class="border-top-0">{{ $t('string.msg.table.list.user.label.document') }}</th>
                            </tr>
                        </thead>
                        <tbody v-bind:key="item._id" v-for="item in pageOfItems" class="cursor-pointer" @click="selectItem(item)">
                            <tr>
                                <td>
                                    <span v-if="item.fantasyName">
                                        {{ camelize(item.fantasyName) }}
                                    </span>
                                </td>
                                <td>
                                    <span v-if="item.socialName">
                                        {{ camelize(item.socialName) }}
                                    </span>
                                </td>
                                <td>
                                    <span v-if="item.primaryPhone">
                                        {{ item.primaryPhone }}
                                    </span>
                                </td>
                                <td>
                                    <span v-if="item.document">
                                        {{ camelize($t(item.document)) }}
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
import Controller from './CrtListCompany'
import Spinner from '../../../components/layout/Spinner'
import Toast from '../../../components/layout/Toast'
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
Vue.prototype.$eventHub = new Vue()
Vue.component('downloadExcel', JsonExcel)

export default {
    name: 'ListCompany',
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
            userType: null,
            PageNumbers: 1,
            pageOfItems: [],
            companies: [],
            filters: {
                name: '',
                status: 'ACTIVE',
                company: null,
            },
            customLabels: {
                first: 'Primeira',
                last: 'Último',
                previous: 'Anterior',
                next: 'Próxima',
            },
            json_fields: {
                'Nome da empresa': 'fantasyName',
                'Nome social da empresa': 'socialName',
                Telefone: 'primaryPhone',
                CNPJ: 'document',
            },
            json_data: [
                {
                    fantasyName: null,
                    socialName: null,
                    emial: null,
                    primaryPhone: null,
                    document: null,
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
