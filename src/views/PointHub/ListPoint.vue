<template>
    <div class="row">
        <div class="col-xl-12">
            <div class="card-box">
                <div class="form-row">
                    <div class="col-md-11">
                        <p class="sub-header">
                            {{ $t('string.msg.point.box.list.label.title') }}
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
                        <div class="form-group col-md-6">
                            <label class="col-form-label">
                                {{ $t('string.msg.list.user.label.name') }}
                            </label>
                            <input type="text" v-model="filters.name" class="form-control" :placeholder="$t('string.msg.list.user.label.name')" />
                        </div>
                    </div>

                    <br />

                    <div class="d-flex justify-content-end bd-highlight mb-3">
                        <download-excel v-if="items.length > 0" class="btn btn-primary" :fetch="fetchData" :fields="json_fields" :meta="json_meta" type="csv" name="points.csv">
                            <label class="download-csv">Download CSV</label>
                        </download-excel>
                    </div>

                    <div class="d-flex justify-content-between bd-highlight mb-3">
                        <button @click="filter" class="btn btn-success w-20">{{ $t('string.msg.form.btn.search') }}</button>
                    </div>
                </form>

                <div class="pb-0 pt-3">
                    <jw-pagination :items="items" class="elevation" @changePage="onChangePage" :labels="customLabels"></jw-pagination>
                </div>
                <div id="vue-table">
                    <div class="table-responsive">
                        <table class="table table-centered table-hover mb-0" id="datatable">
                            <thead class="table-dark">
                                <tr>
                                    <th class="border-top-0">{{ $t('string.msg.list.user.label.name') }}</th>
                                    <th class="border-top-0">{{ $t('string.msg.company.addresses.label') }}</th>
                                    <th class="border-top-0">{{ $t('string.msg.company.label.personToTalk') }}</th>
                                    <th class="border-top-0">{{ $t('string.msg.company.label.primaryphone') }}</th>
                                    <th class="border-top-0">{{ $t('string.msg.platforms.table.label.type') }}</th>
                                    <th v-if="isAdminMaster()" class="border-top-0">{{ $t('string.msg.company.label.name') }}</th>
                                </tr>
                            </thead>
                            <tbody v-bind:key="item._id" v-for="item in pageOfItems" class="cursor-pointer" @click="selectItem(item)">
                                <tr v-if="item && item.status == 'ACTIVE'">
                                    <td>
                                        <span v-if="item.name">
                                            {{ item.name }}
                                        </span>
                                    </td>
                                    <td>
                                        <span v-if="item.address">
                                            {{ camelize(item.address.address) + ', ' + item.address.number + ', ' + camelize(item.address.neighborhood) }}
                                        </span>
                                    </td>
                                    <td>
                                        <span v-if="item.personToTalk">
                                            {{ item.personToTalk }}
                                        </span>
                                    </td>
                                    <td>
                                        <span v-if="item.primaryPhone">
                                            {{ item.primaryPhone }}
                                        </span>
                                    </td>
                                    <td>
                                        <span v-if="item.status == 'ACTIVE'">
                                            {{ $t('string.msg.status.ACTIVE') }}
                                        </span>
                                        <span v-else-if="item.status == 'ARCHIVED'">
                                            {{ $t('string.msg.status.ARCHIVED') }}
                                        </span>
                                    </td>
                                    <td v-if="isAdminMaster()">
                                        <span v-if="item.company && item.company.fantasyName">
                                            {{ String(item.company.fantasyName).toUpperCase() }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <Toast :title="titleToast" :message="messageToast" :messageId="messageIdToast" />
    </div>
</template>

<script>
import Controller from './CrtListPoint'
import Spinner from '../../components/layout/Spinner'
import Toast from '../../components/layout/Toast'
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
Vue.prototype.$eventHub = new Vue()
Vue.component('downloadExcel', JsonExcel)

export default {
    name: 'ListPointHub',
    props: ['valuekey'],

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
            pageOfItems: [],
            filters: {
                name: null,
                status: 'ACTIVE',
            },
            customLabels: {
                first: 'Primeira',
                last: 'Último',
                previous: 'Anterior',
                next: 'Próxima',
            },
            json_fields: {
                Nome: 'name',
                Tipo: 'type',
                CEP: 'address.cep',
                Estado: 'address.state',
                Cidade: 'address.city',
                Rua: 'address.address',
                Numero: 'address.number',
                Bairro: 'address.neighborhood',
                Complemento: 'address.complement',
            },
            json_data: [
                {
                    name: null,
                    type: null,
                    address: {
                        state: null,
                        cep: null,
                        city: null,
                        address: null,
                        neighborhood: null,
                        number: null,
                        complement: null,
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