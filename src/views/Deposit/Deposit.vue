<template>
    <div id="wrapper" :key="valuekey">
        <div class="content-page">
            <div class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div class="page-title-box">
                                <h4 class="page-title">{{ $t('str.msg.deposit.label') }}</h4>
                            </div>
                        </div>
                    </div>
                    <!-- Form row -->
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card-box">
                                <p class="sub-header">
                                    {{ $t('str.msg.register.deposits.label') }}
                                </p>
                                <div class="form-row">
                                    <div class="form-group col-md-1">
                                        <label class="col-form-label mt-4">
                                            <code class="highlighter-rouge">*</code>
                                            {{ $t('string.msg.date.begin.placeholder') }}
                                        </label>
                                    </div>

                                    <div class="form-group col-md-2">
                                        <label class="col-form-label">{{ $t('string.msg.date.begin.day') }}</label>
                                        <select id="dayBegin" v-model="dayBegin" class="form-control">
                                            <option :value="item.day" v-bind:key="item.day" v-for="item in daysBegin">{{ item.day }}</option>
                                        </select>
                                    </div>

                                    <div class="form-group col-md-2">
                                        <label class="col-form-label">{{ $t('string.msg.date.begin.month') }}</label>
                                        <select id="monthBegin" v-model="monthBegin" @change="daysInMonthBegin(monthBegin, yearBegin)" class="form-control">
                                            <option :value="Number(0)">{{ $t('string.msg.date.begin.jan') }}</option>
                                            <option :value="Number(1)">{{ $t('string.msg.date.begin.feb') }}</option>
                                            <option :value="Number(2)">{{ $t('string.msg.date.begin.mar') }}</option>
                                            <option :value="Number(3)">{{ $t('string.msg.date.begin.apr') }}</option>
                                            <option :value="Number(4)">{{ $t('string.msg.date.begin.may') }}</option>
                                            <option :value="Number(5)">{{ $t('string.msg.date.begin.jun') }}</option>
                                            <option :value="Number(6)">{{ $t('string.msg.date.begin.jul') }}</option>
                                            <option :value="Number(7)">{{ $t('string.msg.date.begin.aug') }}</option>
                                            <option :value="Number(8)">{{ $t('string.msg.date.begin.sep') }}</option>
                                            <option :value="Number(9)">{{ $t('string.msg.date.begin.oct') }}</option>
                                            <option :value="Number(10)">{{ $t('string.msg.date.begin.nov') }}</option>
                                            <option :value="Number(11)">{{ $t('string.msg.date.begin.dec') }}</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-2">
                                        <label class="col-form-label">{{ $t('string.msg.date.begin.year') }}</label>
                                        <select v-model="yearBegin" class="form-control">
                                            <option :value="2019" selected>{{ $t('2019') }}</option>
                                            <option :value="2020">{{ $t('2020') }}</option>
                                            <option :value="2021">{{ $t('2021') }}</option>
                                            <option :value="2022">{{ $t('2022') }}</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-md-1">
                                        <label class="col-form-label mt-4">
                                            <code class="highlighter-rouge">*</code>
                                            {{ $t('string.msg.date.end.placeholder') }}
                                        </label>
                                    </div>

                                    <div class="form-group col-md-2">
                                        <label class="col-form-label">{{ $t('string.msg.date.begin.day') }}</label>
                                        <select id="dayBegin" v-model="dayEnd" class="form-control">
                                            <option :value="item.day" v-bind:key="item.day" v-for="item in daysEnd">{{ item.day }}</option>
                                        </select>
                                    </div>

                                    <div class="form-group col-md-2">
                                        <label class="col-form-label">{{ $t('string.msg.date.begin.month') }}</label>
                                        <select id="monthEnd" v-model="monthEnd" @change="daysInMonthEnd(monthEnd, yearEnd)" class="form-control">
                                            <option :value="Number(0)">{{ $t('string.msg.date.begin.jan') }}</option>
                                            <option :value="Number(1)">{{ $t('string.msg.date.begin.feb') }}</option>
                                            <option :value="Number(2)">{{ $t('string.msg.date.begin.mar') }}</option>
                                            <option :value="Number(3)">{{ $t('string.msg.date.begin.apr') }}</option>
                                            <option :value="Number(4)">{{ $t('string.msg.date.begin.may') }}</option>
                                            <option :value="Number(5)">{{ $t('string.msg.date.begin.jun') }}</option>
                                            <option :value="Number(6)">{{ $t('string.msg.date.begin.jul') }}</option>
                                            <option :value="Number(7)">{{ $t('string.msg.date.begin.aug') }}</option>
                                            <option :value="Number(8)">{{ $t('string.msg.date.begin.sep') }}</option>
                                            <option :value="Number(9)">{{ $t('string.msg.date.begin.oct') }}</option>
                                            <option :value="Number(10)">{{ $t('string.msg.date.begin.nov') }}</option>
                                            <option :value="Number(11)">{{ $t('string.msg.date.begin.dec') }}</option>
                                        </select>
                                    </div>

                                    <div class="form-group col-md-2">
                                        <label class="col-form-label">{{ $t('string.msg.date.begin.year') }}</label>
                                        <select v-model="yearEnd" class="form-control">
                                            <option :value="2019" selected>{{ $t('2019') }}</option>
                                            <option :value="2020">{{ $t('2020') }}</option>
                                            <option :value="2021">{{ $t('2021') }}</option>
                                            <option :value="2022">{{ $t('2022') }}</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-md-4">
                                        <label class="col-form-label">
                                            <strong>{{ $t('string.msg.dashboard.orders.select.employee.collect.label') }}</strong>
                                        </label>
                                        <multiselect
                                            v-model="filters.systemUser"
                                            :options="systemUsers"
                                            @input="selectItem(filters.systemUser)"
                                            :close-on-select="true"
                                            track-by="_id"
                                            :custom-label="customLabelSystemUser"
                                            :searchable="true"
                                            placeholder="Selecione"
                                        >
                                        </multiselect>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label class="col-form-label">
                                            <strong>{{ $t('string.msg.dashboard.orders.select.hub.deposited.label') }}</strong>
                                        </label>
                                        <multiselect
                                            v-model="filters.hub"
                                            :options="hubs"
                                            @input="selectItem(filters.hub)"
                                            :close-on-select="true"
                                            track-by="_id"
                                            :custom-label="customLabelHub"
                                            :searchable="true"
                                            placeholder="Selecione"
                                        >
                                        </multiselect>
                                    </div>
                                    <div v-if="isAdminMaster()" class="m-0 form-group col-md-4">
                                        <label for="inputAddress" class="col-form-label">
                                            <strong>{{ $t('string.msg.companies.label') }}</strong>
                                        </label>
                                        <multiselect
                                            v-model="filters.company"
                                            :options="companies"
                                            :close-on-select="true"
                                            track-by="_id"
                                            :custom-label="customLabelCompany"
                                            :searchable="true"
                                            placeholder="Selecione"
                                        >
                                        </multiselect>
                                    </div>
                                </div>

                                <br />

                                <div class="d-flex justify-content-end bd-highlight mb-3"></div>

                                <div class="form-row mt-2">
                                    <div class="form-group col-md-2">
                                        <button @click="clearFilters()" class="btn btn-secondary w-100">{{ $t('string.msg.form.btn.clear.filters') }}</button>
                                    </div>
                                    <div class="form-group col-md-2">
                                        <button @click="checkForm()" class="btn btn-success w-100">{{ $t('string.msg.form.btn.search') }}</button>
                                    </div>
                                    <div class="form-group col-md-4 justify-content-end" v-if="items && items.length > 0">
                                        <h4 class="text-right pr-4">
                                            {{ $t('str.total') + ': ' }}
                                            <label class="text-right pr-4" style="color: grey">{{ totalCollects }}</label>
                                        </h4>
                                    </div>
                                    <div v-if="items.length > 0" class="form-group col-md-4 justify-content-end">
                                        <download-excel class="btn btn-primary" :fetch="fetchData" :fields="json_fields" :meta="json_meta" type="csv" name="depositos.csv">
                                            <label class="download-csv" style="cursor: pointer">Download CSV</label>
                                        </download-excel>
                                        <!-- <div class="text-right d-print-none mr-2">
                                            <a href="javascript:window.print()" class="btn btn-primary waves-effect waves-light"><i class="mdi mdi-printer mr-1"></i> Print</a>
                                        </div> -->
                                    </div>
                                </div>

                                <div class="pb-0 pt-3">
                                    <jw-pagination :items="items" class="elevation" @changePage="onChangePage" :labels="customLabels"></jw-pagination>
                                </div>

                                <div class="table-responsive">
                                    <table class="table table-centered table-hover mb-0" id="datatable">
                                        <thead class="table-dark">
                                            <tr>
                                                <th class="border-top-0"></th>
                                                <th class="border-top-0">{{ $t('string.msg.dashboard.orders.table.date.deposit.title') }}</th>
                                                <th class="border-top-0">{{ $t('string.msg.dashboard.orders.table.employee.title') }}</th>
                                                <th class="border-top-0">{{ $t('string.msg.dashboard.orders.table.hub.title') }}</th>
                                                <th class="border-top-0">{{ $t('string.msg.dashboard.deposit.table.quantity.collect.title') }}</th>
                                                <th class="border-top-0">{{ $t('string.msg.deposit.weight.total') }}</th>
                                                <th class="border-top-0">{{ $t('string.msg.dashboard.orders.table.status.collect.title') }}</th>
                                            </tr>
                                        </thead>
                                        <tbody v-bind:key="item._id" v-for="item in pageOfItems" class="cursor-pointer accordion" id="accordionExample">
                                            <tr v-if="item" id="headingOne" :class="{ opened: opened.includes(item._id) }" @click="toggle(item._id)">
                                                <td v-if="item._id != collapsedId">
                                                    <i class="fas fa-plus-circle" style="color: green"></i>
                                                </td>
                                                <td v-else>
                                                    <i class="fas fa-minus" style="color: red"></i>
                                                </td>
                                                <td>
                                                    <span v-if="item.date">
                                                        {{ new Date(item.date).toLocaleDateString('pt-br') + ' - ' + new Date(item.date).toLocaleTimeString('pt-br') }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span v-if="item.systemUser && item.systemUser.firstName">
                                                        {{ camelize(item.systemUser.firstName) }}
                                                    </span>
                                                    <span v-if="item.systemUser && item.systemUser.lastName">
                                                        {{ camelize(item.systemUser.lastName) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span v-if="item.hub && item.hub.name">
                                                        {{ item.hub.name }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span v-if="item.collects">
                                                        {{ item.collects.length }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span v-if="item.totalWeight">
                                                        {{ item.totalWeight.toFixed(2) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span v-if="item.status == 'ACTIVE'">
                                                        <span style="color: green">{{ $t('string.msg.dashboard.deposit.table.status.active') }}</span>
                                                    </span>
                                                    <span v-else-if="item.status == 'OPENED'">
                                                        <span style="color: red">{{ $t('string.msg.dashboard.orders.table.status.open') }}</span>
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr v-if="opened.includes(item._id)" style="background-color: #f1f5f7">
                                                <th></th>
                                                <th class="border-top-0">{{ $t('str.collect.date') }}</th>
                                                <th class="border-top-0">{{ $t('str.collected.point') }}</th>
                                                <th class="border-top-0">{{ $t('str.collect.weight') }}</th>
                                                <th class="border-top-0" style="text-align: right">{{ $t('str.collect.photo') }}</th>
                                                <th class="border-top-0"></th>
                                                <th class="border-top-0"></th>
                                            </tr>
                                            <tr v-bind:key="items._id" v-for="items in infoOne(item)">
                                                <td></td>
                                                <td>
                                                    <span v-if="items.date">
                                                        {{ new Date(items.date).toLocaleDateString('pt-br') + ' - ' + new Date(item.date).toLocaleTimeString('pt-br') }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span v-if="items.pointCollect && items.pointCollect.name">
                                                        {{ items.pointCollect.name }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span v-if="items.weight">
                                                        {{ items.weight.toFixed(2) }}
                                                    </span>
                                                </td>
                                                <td style="text-align: right">
                                                    <span v-if="items.photoURL && items.photoURL != 'https://'" @click="showPhoto(items.photoURL)" class="fas fa-camera-retro" style="font-size: medium"></span>
                                                    <span v-else> {{ $t('string.msg.collects.dont.have.photo') }}</span>
                                                </td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Photo :photoURL="photoURL" />
                    <Map :geolocation="geolocation" />
                    <Spinner />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Controller from './CrtDeposit'
import Spinner from '../../components/layout/Spinner'
import Toast from '../../components/layout/Toast'
import Photo from '../../components/layout/ModalPhoto'
import Map from '../../components/layout/ModalMap'
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)
export default {
    name: 'ListDeposits',
    props: ['valuekey'],
    components: {
        Spinner,
        Toast,
        Photo,
        Map,
    },
    data() {
        return {
            errors: [],
            collapsedId: null,
            titleToast: null,
            messageToast: null,
            messageIdToast: null,
            photoURL: null,
            items: [],
            hubs: [],
            companies: [],
            pageOfItems: [],
            opened: [],
            systemUsers: [],
            order: null,
            geolocation: {},
            timer: '',
            orderSelected: null,
            value: '0',
            size: 100,
            nDays: 1,
            justifyClose: null,
            dayBegin: null,
            monthBegin: null,
            yearBegin: null,
            dayEnd: null,
            monthEnd: null,
            yearEnd: null,
            daysBegin: [{ day: null }],
            daysEnd: [{ day: null }],
            filters: {
                company: null,
                systemUser: null,
                startDate: null,
                endDate: null,
                hub: null,
                status: 'ACTIVE',
            },
            totalDeposits: 0,
            newCollect: false,
            customLabels: {
                first: 'Primeira',
                last: 'Último',
                previous: 'Anterior',
                next: 'Próxima',
            },
            json_fields: {
                Data: 'date',
                HUB: 'hub.name',
                Funcionario: 'systemUser.firstName',
            },
            json_data: [
                {
                    date: null,
                    hub: {
                        name: null,
                    },
                    systemUser: {
                        firstName: null,
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
        Controller.init(this)
    },
    mounted() {},
}
</script>

<style>
.multiselect__option--highlight {
    background: #343b4a;
    outline: none;
    color: #fff;
}
.multiselect__tag {
    position: relative;
    display: inline-block;
    padding: 4px 26px 4px 10px;
    border-radius: 5px;
    margin-right: 10px;
    color: #fff;
    line-height: 1;
    background: #343b4a;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
}
.multiselect__tag-icon:focus,
.multiselect__tag-icon:hover {
    background: #343b4a;
}
</style>