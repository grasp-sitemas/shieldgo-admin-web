<template>
    <div id="wrapper" :key="valuekey">
        <div class="content-page">
            <div class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div class="page-title-box">
                                <h4 class="page-title">{{ $t('string.msg.list.companies.label.title') }}</h4>
                            </div>
                        </div>
                    </div>
                    <!-- Form row -->
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card-box">
                                <p class="sub-header">
                                    {{ $t('str.msg.register.company') }}
                                </p>
                                <form>
                                    <div v-if="dataCompany._id" class="form-row">
                                        <div class="form-group col-md-3">
                                            <label for="inputAddress" class="col-form-label"> <code class="highlighter-rouge">*</code> {{ $t('string.msg.product.brand.label.id') }} </label>
                                            <input type="text" v-model="dataCompany._id" class="form-control" />
                                        </div>
                                        <div class="form-group col-md-2">
                                            <br />
                                            <br />
                                            <button v-on:click="confirmArchive" class="text-dark-gray btn btn-warning w-100">{{ $t('string.msg.status.archive') }}</button>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group col-md-6">
                                            <label for="inputAddress" class="col-form-label"> <code class="highlighter-rouge">*</code> {{ $t('string.msg.list.user.label.fantasyName') }} </label>
                                            <input type="text" v-model="dataCompany.fantasyName" class="form-control" />
                                        </div>

                                        <div class="form-group col-md-6">
                                            <label for="inputAddress" class="col-form-label">
                                                {{ $t('string.msg.list.user.label.socialName') }}
                                            </label>
                                            <input type="text" v-model="dataCompany.socialName" class="form-control" />
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group col-md-6">
                                            <label for="inputAddress" class="col-form-label">
                                                {{ $t('string.msg.list.user.label.phone') }}
                                            </label>
                                            <input type="tel" v-model="dataCompany.primaryPhone" class="form-control" v-mask="['(##) ####-####', '(##) #####-####']" />
                                        </div>

                                        <div class="form-group col-md-6">
                                            <label for="inputAddress" class="col-form-label">
                                                {{ $t('string.msg.list.user.label.document') }}
                                            </label>
                                            <input type="tel" v-model="dataCompany.document" class="form-control" v-mask="['##.###.###/####-##']" />
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group col-md-6">
                                            <label>
                                                {{ $t('string.msg.has.sensor.project') }}
                                            </label>
                                            <select v-model="dataCompany.hasProjectSensor" class="form-control">
                                                <option :value="null || undefined" selected>{{ $t('string.msg.select.selector.item') }}</option>
                                                <option :value="true">{{ $t('string.msg.yes') }}</option>
                                                <option :value="false">{{ $t('string.msg.no') }}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div v-if="!dataCompany._id">
                                        <label for="inputAddress" class="col-form-label">{{ $t('string.msg.user.information') }} </label>
                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="inputAddress" class="col-form-label"> <code class="highlighter-rouge">*</code> {{ $t('string.msg.list.user.label.name') }} </label>
                                                <input type="text" v-model="dataUser.firstName" class="form-control" />
                                            </div>

                                            <div class="form-group col-md-6">
                                                <label for="inputAddress" class="col-form-label"> <code class="highlighter-rouge">*</code> {{ $t('string.msg.list.user.label.lastname') }} </label>
                                                <input type="text" v-model="dataUser.lastName" class="form-control" />
                                            </div>
                                        </div>

                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="inputAddress" class="col-form-label"> <code class="highlighter-rouge">*</code> {{ $t('string.msg.list.user.label.email') }} </label>
                                                <input type="text" v-model="dataUser.email" class="form-control" />
                                            </div>

                                            <div class="form-group col-md-6">
                                                <label for="inputAddress" class="col-form-label"> <code class="highlighter-rouge">*</code> {{ $t('string.msg.list.user.label.password') }} </label>
                                                <input type="text" v-model="dataUser.password" class="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="errors.length" class="alert alert-danger">
                                        <p class="lead">{{ $t('response.msg.error.empty.fields') }}</p>
                                        <ul>
                                            <li v-bind:key="error" v-for="error in errors">{{ error }}</li>
                                        </ul>
                                    </div>

                                    <div class="form-row text-center">
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
import Controller from './CrtCompany'
import List from './ListCompany'
import Spinner from '../../../components/layout/Spinner'
import Toast from '../../../components/layout/Toast'
import Confirmation from '../../../components/layout/Confirmation'
import Vue from 'vue'
Vue.prototype.$eventHub = new Vue()
export default {
    name: 'Company',
    components: {
        Spinner,
        Toast,
        List,
        Confirmation,
    },
    data() {
        return {
            errors: [],
            addresses: [],
            valuekey: 0,
            newPassword: null,
            titleToast: null,
            messageToast: null,
            messageIdToast: null,
            company: null,
            pageOfItems: [],
            searchBy: null,
            dataUser: {
                status: 'ACTIVE',
                firstName: null,
                lastName: null,
                email: null,
                password: null,
                primaryPhone: null,
                type: 'USER-COMPANY',
                companyUser: {
                    company: null,
                    status: 'ACTIVE',
                    photoURL: 'https://',
                    subtype: 'ADMIN',
                    employedType: null,
                },
            },
            dataCompany: {
                fantasyName: null,
                socialName: null,
                primaryPhone: null,
                document: null,
                hasProjectSensor: null,
            },
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
</style>
