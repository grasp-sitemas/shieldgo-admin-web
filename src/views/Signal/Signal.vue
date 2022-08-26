<template>
    <div id="wrapper" :key="valuekey">
        <div class="content-page">
            <div class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div class="page-title-box">
                                <h4 class="page-title">{{ $t('str.msg.signal.label') }}</h4>
                            </div>
                        </div>
                    </div>
                    <!-- Form row -->
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card-box">
                                <div class="form-row">
                                    <div class="form-group col-md-8">
                                        <p class="sub-header">
                                            {{ $t('str.msg.report.signal.label') }}
                                        </p>
                                    </div>
                                    <div class="form-group col-md-1">
                                        <span class="card-signal" style="background-color: #3cae76">
                                            {{ $t('str.space') }}
                                        </span>
                                        <label
                                            ><strong>{{ $t('str.50.percent') }}</strong></label
                                        >
                                    </div>
                                    <div class="form-group col-md-1">
                                        <span class="card-signal" style="background-color: #f1c94e">
                                            {{ $t('str.space') }}
                                        </span>
                                        <label
                                            ><strong>{{ $t('str.75.percent') }}</strong></label
                                        >
                                    </div>
                                    <div class="form-group col-md-1">
                                        <span class="card-signal" style="background-color: #f68638">
                                            {{ $t('str.space') }}
                                        </span>
                                        <label
                                            ><strong>{{ $t('str.90.percent') }}</strong></label
                                        >
                                    </div>
                                    <div class="form-group col-md-1">
                                        <span class="card-signal" style="background-color: #fe0000">
                                            {{ $t('str.space') }}
                                        </span>
                                        <label
                                            ><strong>{{ $t('str.100.percent') }}</strong></label
                                        >
                                    </div>
                                </div>

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
                                    <div class="form-group col-md-11">
                                        <button @click="checkForm()" class="btn btn-success w-20">{{ $t('string.msg.form.btn.search') }}</button>
                                    </div>
                                    <div class="form-group col-md-1" v-if="items">
                                        <h4 class="text-center">{{ $t('str.total') }}</h4>
                                        <h4 class="text-center" style="color: grey">{{ totalSignals }}</h4>
                                        <div class="text-right d-print-none mr-2">
                                            <a href="javascript:window.print()" class="btn btn-primary waves-effect waves-light"><i class="mdi mdi-printer mr-1"></i> Print</a>
                                        </div>
                                    </div>
                                </div>

                                <form>
                                    <div class="pb-0 pt-3">
                                        <jw-pagination :items="items" class="elevation" @changePage="onChangePage" :labels="customLabels"></jw-pagination>
                                    </div>
                                    <div id="vue-table">
                                        <div class="table-responsive">
                                            <table class="table table-centered table-hover mb-0" id="datatable">
                                                <thead class="table-dark">
                                                    <tr>
                                                        <th class="border-top-0" style="width: 20%">{{ $t('string.msg.list.signal.chipset') }}</th>
                                                        <th class="border-top-0" style="width: 20%">{{ $t('string.msg.list.signal.value.batery') }}</th>
                                                        <th class="border-top-0" style="width: 20%">{{ $t('string.msg.list.signal.name') }}</th>
                                                        <th class="border-top-0" style="width: 20%">{{ $t('string.msg.list.signal.date') }}</th>
                                                        <th class="border-top-0" style="width: 20%">{{ $t('string.msg.list.signal.value') }}</th>
                                                    </tr>
                                                </thead>
                                                <tbody v-bind:key="item._id" v-for="item in pageOfItems" class="cursor-pointer">
                                                    <tr v-if="item">
                                                        <td>
                                                            <span v-if="item.chipsetId">
                                                                {{ item.chipsetId }}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span v-if="item.batteryLevel">
                                                                {{ Number(Number(item.batteryLevel) / 100).toFixed(2) }}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span v-if="item.name">
                                                                {{ item.name }}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span v-if="item.date">
                                                                {{ new Date(item.date).toLocaleDateString('pt-br') + ' - ' + new Date(item.date).toLocaleTimeString('pt-br') }}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span v-if="item.value">
                                                                <span class="flip-card active-card" style="color: white">
                                                                    <span v-if="item.value >= 0 && item.value <= 50" class="card-signal" style="background-color: #3cae76">
                                                                        <h5>{{ item.value + '%' }}</h5>
                                                                    </span>
                                                                    <span v-if="item.value >= 51 && item.value <= 75" class="card-signal" style="background-color: #f1c94e">
                                                                        <h5>{{ item.value + '%' }}</h5>
                                                                    </span>
                                                                    <span v-if="item.value >= 76 && item.value <= 90" class="card-signal" style="background-color: #f68638">
                                                                        <h5>{{ item.value + ' %' }}</h5>
                                                                    </span>
                                                                    <span v-if="item.value >= 91 && item.value <= 100" class="card-signal" style="background-color: #fe0000">
                                                                        <h5>{{ item.value + '%' }}</h5>
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Spinner />
        <Toast :title="titleToast" :message="messageToast" :messageId="messageIdToast" />
    </div>
</template>

<script>
import Controller from './CrtSignal'
import Spinner from '../../components/layout/Spinner'
import Toast from '../../components/layout/Toast'

export default {
    name: 'Signal',
    components: {
        Spinner,
        Toast,
    },
    data() {
        return {
            errors: [],
            items: [],
            pageOfItems: [],
            timer: '',
            valuekey: 0,
            titleToast: null,
            messageToast: null,
            messageIdToast: null,
            totalSignals: null,
            filters: {
                name: null,
                startDate: null,
                endDate: null,
                status: 'ACTIVE',
            },
            customLabels: {
                first: 'Primeira',
                last: 'Último',
                previous: 'Anterior',
                next: 'Próxima',
            },
        }
    },
    methods: Controller.methods,
    created() {},
    mounted() {
        Controller.init(this)
        this.filter()
    },
    cron: {
        time: 30000,
        method: 'load',
    },
    destroyed() {
        clearInterval(this.timer)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
}
</script>
