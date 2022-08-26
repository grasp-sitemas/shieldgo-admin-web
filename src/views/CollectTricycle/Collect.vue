<template>
    <div id="wrapper" :key="valuekey">
        <div class="content-page">
            <div class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div class="page-title-box">
                                <h4 class="page-title">{{ $t('str.msg.collects.label') }}</h4>
                            </div>
                        </div>
                    </div>
                    <!-- Form row -->
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card-box">
                                <p class="sub-header">
                                    {{ $t('str.msg.register.collects.tricycle.label') }}
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

                                <div class="form-row mt-2">
                                    <div class="form-group col-md-4">
                                        <label class="col-form-label">
                                            <strong>{{ $t('string.msg.dashboard.orders.select.status.collect.label') }}</strong>
                                        </label>
                                        <select v-model="filters.type" class="form-control">
                                            <option :value="null" selected>{{ $t('string.msg.select.selector.item') }}</option>
                                            <option value="OPENED" style="color: red">{{ $t('string.msg.dashboard.orders.table.status.open') }}</option>
                                            <option value="CLOSED" style="color: green">{{ $t('string.msg.dashboard.orders.table.status.closed') }}</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label class="col-form-label">
                                            <strong>{{ $t('string.msg.dashboard.orders.select.product.collect.label') }}</strong>
                                        </label>
                                        <select v-model="filters.productType" class="form-control">
                                            <option :value="null" selected>{{ $t('string.msg.select.selector.item') }}</option>
                                            <option value="GLASS">{{ $t('string.msg.point.productTypes.glass') }}</option>
                                            <option value="BOTTLE">{{ $t('string.msg.point.productTypes.bottle') }}</option>
                                        </select>
                                    </div>
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
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-md-4">
                                        <label class="col-form-label">
                                            <strong>{{ $t('string.msg.dashboard.orders.select.pointCollect.label') }}</strong>
                                        </label>
                                        <multiselect
                                            v-model="filters.pointCollect"
                                            :options="pointCollects"
                                            @input="selectItem(filters.pointCollect)"
                                            :close-on-select="true"
                                            track-by="_id"
                                            :custom-label="customLabelPointCollect"
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
                                    <div class="m-0 form-group col-md-4">
                                        <label for="inputAddress" class="col-form-label">
                                            <strong>{{ $t('string.msg.project.label') }}</strong>
                                        </label>
                                        <multiselect
                                            v-model="filters.project"
                                            :options="projects"
                                            :close-on-select="true"
                                            track-by="_id"
                                            :custom-label="customLabelProject"
                                            :searchable="true"
                                            placeholder="Selecione"
                                        >
                                        </multiselect>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-md-4">
                                        <label class="col-form-label">
                                            <strong>{{ $t('string.msg.state') }}</strong>
                                        </label>
                                        <multiselect
                                            v-model="filters.address.state"
                                            :options="states"
                                            :close-on-select="true"
                                            track-by="_id"
                                            :custom-label="customLabelState"
                                            :searchable="true"
                                            placeholder="Selecione"
                                        >
                                        </multiselect>
                                    </div>
                                    <div class="m-0 form-group col-md-4">
                                        <label for="inputAddress" class="col-form-label">
                                            <strong>{{ $t('string.msg.city') }}</strong>
                                        </label>
                                        <multiselect
                                            v-model="filters.address.city"
                                            :options="cities"
                                            :close-on-select="true"
                                            track-by="_id"
                                            :custom-label="customLabelCity"
                                            :searchable="true"
                                            placeholder="Selecione"
                                        >
                                        </multiselect>
                                    </div>
                                </div>

                                <div v-if="items.length > 0" class="d-flex justify-content-end bd-highlight mb-3 mt-4">
                                    <i @click="downloadPDF()" class="fas fa-file-pdf mr-3" style="color: #f22100; font-size: 28px; cursor: pointer">
                                        <label style="cursor: pointer; padding-left: 2px" class="pdf-text">PDF</label>
                                    </i>
                                    <download-excel class="btn btn-primary" :fetch="fetchData" :fields="json_fields" :meta="json_meta" type="csv" name="coletas.csv">
                                        <label style="cursor: pointer" class="download-csv">Download CSV</label>
                                    </download-excel>
                                </div>

                                <div class="form-row mt-2">
                                    <div class="form-group col-md-2">
                                        <button @click="clearFilters()" class="btn btn-secondary w-100">{{ $t('string.msg.form.btn.clear.filters') }}</button>
                                    </div>
                                    <div class="form-group col-md-2">
                                        <button @click="checkForm()" class="btn btn-success w-100">{{ $t('string.msg.form.btn.search') }}</button>
                                    </div>
                                    <div class="form-group col-md-2 justify-content-end" v-if="items && items.length > 0">
                                        <h4 class="text-center">{{ $t('str.number.collects') }}</h4>
                                        <h4 class="text-center" style="color: grey">{{ items.length }}</h4>
                                    </div>
                                    <div class="form-group col-md-2 justify-content-end" v-if="totalWeight">
                                        <h4 class="text-center">{{ $t('str.total.weight') }}</h4>
                                        <h4 class="text-center" style="color: grey">{{ totalWeight.toFixed(2) }}</h4>
                                    </div>
                                </div>
                            </div>
                            <div v-if="items && items.length > 0">
                                <div class="pb-0 pt-3">
                                    <jw-pagination :items="items" class="elevation" @changePage="onChangePage" :labels="customLabels"></jw-pagination>
                                </div>

                                <div class="table-responsive mb-4">
                                    <table class="table table-centered table-hover mb-0" id="datatable">
                                        <thead class="table-dark">
                                            <tr>
                                                <th class="border-top-0" style="width: 20%">{{ $t('string.msg.dashboard.orders.table.project.title') }}</th>
                                                <th class="border-top-0" style="width: 10%">{{ $t('string.msg.dashboard.orders.table.pointCollect.title') }}</th>
                                                <th class="border-top-0" style="width: 10%">{{ $t('string.msg.dashboard.orders.table.date.collect.title') }}</th>
                                                <th class="border-top-0" style="width: 10%">{{ $t('string.msg.dashboard.orders.table.product.title') }}</th>
                                                <th class="border-top-0" style="width: 5%">{{ $t('string.msg.dashboard.orders.table.weight.title') }}</th>
                                                <th class="border-top-0" style="width: 5%">{{ $t('string.msg.dashboard.orders.table.quantity.title') }}</th>
                                                <th class="border-top-0" style="width: 10%">{{ $t('string.msg.dashboard.orders.table.employee.title') }}</th>
                                                <th class="border-top-0" style="width: 10%">
                                                    {{ $t('string.msg.dashboard.orders.table.geo.collect.title') }}
                                                    <i class="fas fa-eye"></i>
                                                </th>
                                                <th class="border-top-0" style="width: 5%; text-align: center">
                                                    {{ $t('string.msg.dashboard.orders.table.photo.title') }}
                                                    <i class="fas fa-eye"></i>
                                                </th>
                                                <th class="border-top-0" style="width: 5%">{{ $t('string.msg.dashboard.orders.table.status.collect.title') }}</th>
                                                <th class="border-top-0"></th>
                                            </tr>
                                        </thead>
                                        <tbody v-bind:key="item._id" v-for="(item, index) in pageOfItems" class="cursor-pointer">
                                            <tr v-if="item">
                                                <td>
                                                    <span v-if="!item.project && isAdminMaster()">
                                                        <select @change="applyProject(item)" id="project" v-model="item.project" class="form-control">
                                                            <option :value="project" v-bind:key="project" v-for="project in projects">
                                                                {{ project.name }}
                                                            </option>
                                                        </select>
                                                    </span>
                                                    <span v-else-if="item.project && item.project.name" style="cursor: pointer">
                                                        {{ item.project.name }}
                                                        <br />
                                                        <span v-if="isAdminMaster()" @click="removeProject(item, index)">
                                                            <i class="fa fa-times" aria-hidden="true" style="color: red; font-size: 20px; text-align: center"></i>
                                                        </span>
                                                    </span>
                                                    <span v-else> {{ '--' }} </span>
                                                </td>
                                                <td>
                                                    <span v-if="item.pointCollect && item.pointCollect.name">
                                                        {{ item.pointCollect.name }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span v-if="item.startCollect">
                                                        {{ new Date(item.startCollect).toLocaleDateString('pt-br') + ' ' + new Date(item.startCollect).toLocaleTimeString('pt-br') }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span v-if="item.productType">
                                                        {{ $t(item.productType) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span v-if="item.weight">
                                                        {{ item.weight }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span v-if="item.quantity"> {{ item.quantity }} </span>
                                                    <span v-else class="align-center" v-tooltip="$t('str.just.for.botle')">
                                                        <strong style="font-size: 26px">{{ '-' }}</strong>
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
                                                    <span v-if="item.latlng && item.latlng.latitude && item.latlng.longitude">
                                                        <span @click="showMap(item.latlng)" v-tooltip="$t('str.msg.click.to.show.geolocation')">{{ item.latlng.latitude + '\n' + item.latlng.longitude }}</span>
                                                    </span>
                                                </td>
                                                <td style="text-align: center">
                                                    <span v-if="item.photoURL && item.photoURL != 'https://'" @click="showPhoto(item.photoURL)" class="fas fa-camera-retro" style="font-size: medium"></span>
                                                    <span v-else> {{ $t('string.msg.collects.dont.have.photo') }}</span>
                                                </td>
                                                <td>
                                                    <span v-if="item.type == 'CLOSED'">
                                                        <span style="color: green" v-tooltip="$t('str.msg.collect.deposited')">{{ $t('string.msg.dashboard.orders.table.status.closed') }}</span>
                                                    </span>
                                                    <span v-else-if="item.type == 'OPENED'">
                                                        <span style="color: red" v-tooltip="$t('str.msg.collect.not.deposited')">{{ $t('string.msg.dashboard.orders.table.status.open') }}</span>
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        v-tooltip="$t('str.msg.collect.delete')"
                                                        v-if="isAdminMaster()"
                                                        v-on:click="confirmArchive(item._id, index)"
                                                        class="far fa-trash-alt btn w-35"
                                                        style="color: red"
                                                    ></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-else class="form-row">
                                <div class="form-group col-md-12 text-center">
                                    <label>Nenhuma coleta encontrada...</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Confirmation :title="titleToast" :message="messageToast" :cancelText="cancelText" :yesText="yesText" v-on:confirmation-return="archive" />
                <Photo :photoURL="photoURL" />
                <Map :geolocation="geolocation" />
                <Spinner />
            </div>
        </div>
    </div>
</template>
<script>
import Controller from './CrtCollect'
import Spinner from '../../components/layout/Spinner'
import Confirmation from '../../components/layout/Confirmation'
import Toast from '../../components/layout/Toast'
import Photo from '../../components/layout/ModalPhoto'
import Map from '../../components/layout/ModalMap'
import STATES from '../../utils/states'
import CITIES from '../../utils/cities'
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

export default {
    name: 'ListCollectTricycle',
    props: ['valuekey'],
    components: {
        Confirmation,
        Spinner,
        Toast,
        Photo,
        Map,
    },
    data() {
        return {
            errors: [],
            titleToast: null,
            messageToast: null,
            messageIdToast: null,
            photoURL: null,
            states: STATES,
            cities: CITIES,
            isLoading: false,
            items: [],
            companies: [],
            projects: [],
            pointCollects: [],
            collectId: null,
            collectIndex: null,
            pageOfItems: [],
            systemUsers: [],
            geolocation: {},
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
            project: null,
            daysBegin: [{ day: null }],
            daysEnd: [{ day: null }],
            filters: {
                type: null,
                systemUser: null,
                company: null,
                project: null,
                startCollect: null,
                endCollect: null,
                collectType: 'TRICYCLE',
                productType: null,
                status: 'ACTIVE',
                pointCollect: null,
                address: {
                    state: null,
                    city: null,
                },
            },
            totalWeight: 0,
            totalCollects: 0,
            newCollect: false,
            customLabels: {
                first: 'Primeira',
                last: 'Último',
                previous: 'Anterior',
                next: 'Próxima',
            },
            json_fields: {
                Projeto: 'project.name',
                'Pontos de coletas': 'pointCollect.name',
                'Data da coleta': 'startCollect',
                'Tipo de Produto': 'productType',
                Peso: 'weight',
                Quantidade: 'quantity',
                Funcionário: 'systemUser.firstName',
                Latitude: 'latlng.latitude',
                Longitude: 'latlng.longitude',
                Status: 'type',
            },
            json_data: [
                {
                    startCollect: null,
                    project: {
                        name: null,
                    },
                    pointCollect: {
                        name: null,
                    },
                    collectType: null,
                    weight: null,
                    quantity: null,
                    systemUser: {
                        firstName: null,
                    },
                    type: null,
                    latlng: {
                        latitude: null,
                        longitude: null,
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
.pdf-text {
    color: #000;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    font-family: 'Roboto', sans-serif;
}
</style>