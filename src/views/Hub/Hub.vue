<template>
    <div id="wrapper" :key="valuekey">
        <div class="content-page">
            <div class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div class="page-title-box">
                                <h4 class="page-title">{{ $t('string.msg.menu.box.label') }}</h4>
                            </div>
                        </div>
                    </div>
                    <!-- Form row -->

                    <div class="row">
                        <div class="col-md-12">
                            <div class="card-box">
                                <p class="sub-header">
                                    {{ $t('str.msg.register.hubs.label') }}
                                </p>
                                <form>
                                    <div v-if="data._id" class="form-row">
                                        <div class="form-group col-md-3">
                                            <label for="inputAddress" class="col-form-label"> <code class="highlighter-rouge">*</code> {{ $t('string.msg.product.brand.label.id') }} </label>
                                            <input type="text" v-model="data._id" readonly class="form-control" />
                                        </div>
                                        <div class="form-group col-md-2">
                                            <button v-on:click="confirmArchive" class="mt-4 text-dark-gray btn btn-warning w-100">{{ $t('string.msg.status.archive') }}</button>
                                        </div>

                                        <div class="qrcode-container form-group col-md-7 text-right">
                                            <div class="qrcode-box" id="content" ref="content" key="content">
                                                <a @click="download()" class="cursor-pointer" v-tooltip="$t('str.msg.download.qrcode')"><qrcode-vue :value="data._id" :size="100" level="H"></qrcode-vue></a>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="isAdminMaster()" class="form-row">
                                        <div class="form-group col-md-6">
                                            <label for="inputAddress" class="col-form-label">
                                                <strong>{{ $t('string.msg.companies.label') }}</strong>
                                                <span class="ml-2" style="color: gray">{{ $t('string.msg.search.companies.label') }}</span>
                                            </label>
                                            <multiselect
                                                v-model="data.company"
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

                                    <div class="form-row">
                                        <div class="form-group col-md-6">
                                            <label>
                                                <code class="highlighter-rouge">*</code>
                                                {{ $t('string.msg.list.user.label.number') }}
                                            </label>
                                            <input type="text" v-model="data.name" class="form-control" :placeholder="$t('string.msg.list.user.label.number')" />
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label>
                                                <code class="highlighter-rouge">*</code>
                                                {{ $t('string.msg.question.table.label.type') }}
                                            </label>
                                            <select v-model="data.type" class="form-control">
                                                <option :value="null" selected>{{ $t('string.msg.select.selector.item') }}</option>
                                                <option value="ROLLON">{{ $t('string.msg.hub.type.rollon') }}</option>
                                                <option value="PEV">{{ $t('string.msg.hub.type.pev') }}</option>
                                                <option value="TRICYCLE">{{ $t('string.msg.hub.type.tricycle') }}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div v-if="errors.length" class="alert alert-danger">
                                        <p class="lead">{{ $t('response.msg.error.empty.fields') }}</p>
                                        <ul>
                                            <li v-bind:key="error" v-for="error in errors">{{ error }}</li>
                                        </ul>
                                    </div>

                                    <div class="form-row text-center mt-2">
                                        <div class="form-group col-md-6">
                                            <button @click="clearForm" class="btn btn-secondary w-50">{{ $t('string.msg.form.btn.clear') }}</button>
                                        </div>
                                        <div class="form-group col-md-6">
                                            <button @click="checkForm" class="btn btn-primaryGreen w-50">{{ $t('string.msg.form.btn.save') }}</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <List v-on:load-item="selectItem" />
                </div>
            </div>
        </div>

        <Spinner />
        <Toast :title="titleToast" :message="messageToast" :messageId="messageIdToast" />
        <Confirmation :title="titleToast" :message="messageToast" :cancelText="cancelText" :yesText="yesText" v-on:confirmation-return="archive" />
    </div>
</template>

<script>
import Controller from './CrtHub'
import List from './ListHub'
import Spinner from '../../components/layout/Spinner'
import Toast from '../../components/layout/Toast'
import Confirmation from '../../components/layout/Confirmation'
import QrcodeVue from 'qrcode.vue'
import Vue from 'vue'
Vue.prototype.$eventHub = new Vue()
export default {
    name: 'Hub',
    components: {
        Spinner,
        Toast,
        List,
        Confirmation,
        QrcodeVue,
    },
    data() {
        return {
            errors: [],
            addresses: [],
            companies: [],
            valuekey: 0,
            newPassword: null,
            titleToast: null,
            latitude: null,
            longitude: null,
            messageToast: null,
            messageIdToast: null,
            data: {
                status: 'ACTIVE',
                type: null,
                name: null,
                date: new Date(),
                company: null,
            },
        }
    },
    methods: Controller.methods,
    created() {
        Controller.init(this)
    },
    computed: {},
    mounted() {},
}
</script>

<style scoped>
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>