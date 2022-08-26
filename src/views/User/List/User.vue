<template>
    <div id="wrapper" :key="valuekey">
        <div class="content-page">
            <div class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div class="page-title-box">
                                <h4 class="page-title">{{ $t('string.msg.list.user.label.title') }}</h4>
                            </div>
                        </div>
                    </div>
                    <!-- Form row -->
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card-box">
                                <p class="sub-header">
                                    {{ $t('string.msg.list.user.label.description') }}
                                </p>
                                <form>
                                    <div class="form-row">
                                        <div class="form-group col-md-6">
                                            <label for="inputAddress" class="col-form-label">
                                                {{ $t('string.msg.list.user.label.subtype') }}
                                            </label>
                                            <select v-model="data.companyUser.subtype" class="form-control">
                                                <option :value="null" selected>{{ $t('string.msg.select.selector.item') }}</option>
                                                <option value="ADMIN">{{ $t('string.msg.user.type.admin') }}</option>
                                                <option value="EMPLOYEE">{{ $t('string.msg.user.type.employee') }}</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-md-6" v-if="data.companyUser.subtype == 'EMPLOYEE'">
                                            <label for="inputAddress" class="col-form-label">
                                                {{ $t('string.msg.list.user.label.subtype') }}
                                            </label>
                                            <select v-model="data.companyUser.employedType" class="form-control">
                                                <option :value="null" selected>{{ $t('string.msg.select.selector.item') }}</option>
                                                <option value="TRICYCLE">{{ $t('string.msg.point.employedType.tricycle') }}</option>
                                                <option value="PEV">{{ $t('string.msg.point.employedType.pev') }}</option>
                                                <option value="ROLLON">{{ $t('string.msg.point.employedType.rollon') }}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div v-if="data._id" class="form-row">
                                        <div class="form-group col-md-3">
                                            <label for="inputAddress" class="col-form-label"> <code class="highlighter-rouge">*</code> {{ $t('string.msg.product.brand.label.id') }} </label>
                                            <input type="text" v-model="data._id" class="form-control" />
                                        </div>
                                        <div class="form-group col-md-2">
                                            <br />
                                            <br />
                                            <button v-on:click="confirmArchive" class="text-dark-gray btn btn-warning w-100">{{ $t('string.msg.status.archive') }}</button>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group col-md-6">
                                            <label for="inputAddress" class="col-form-label">
                                                {{ $t('string.msg.list.user.label.name') }}
                                            </label>
                                            <input type="text" v-model="data.firstName" class="form-control" />
                                        </div>

                                        <div class="form-group col-md-6">
                                            <label for="inputAddress" class="col-form-label">
                                                {{ $t('string.msg.list.user.label.lastname') }}
                                            </label>
                                            <input type="text" v-model="data.lastName" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group col-md-6">
                                            <label for="inputAddress" class="col-form-label">
                                                <strong>{{ $t('string.msg.companies.label') }}</strong>
                                            </label>
                                            <multiselect
                                                v-model="data.companyUser.company"
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
                                        <div v-if="data.companyUser.subtype === 'ADMIN'" class="form-group col-md-6">
                                            <label for="inputAddress" class="col-form-label">
                                                {{ $t('string.msg.list.user.label.email') }}
                                            </label>
                                            <input type="email" v-model="data.email" class="form-control" />
                                        </div>
                                        <div v-else class="form-group col-md-6">
                                            <label for="inputAddress" class="col-form-label">
                                                {{ $t('string.msg.list.user.label.phone') }}
                                            </label>
                                            <input type="text" v-model="data.primaryPhone" class="form-control" v-mask="['(##) ####-####', '(##) #####-####']" />
                                        </div>

                                        <div class="form-group col-md-6">
                                            <label for="inputAddress" class="col-form-label">
                                                {{ $t('string.msg.list.user.label.password') }}
                                            </label>
                                            <input type="text" v-model="data.password" class="form-control" />
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
import Controller from './CrtUser'
import List from './ListUser'
import Spinner from '../../../components/layout/Spinner'
import Toast from '../../../components/layout/Toast'
import Confirmation from '../../../components/layout/Confirmation'
import Vue from 'vue'
Vue.prototype.$eventHub = new Vue()
export default {
    name: 'User',
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
            pageOfItems: [],
            companies: [],
            searchBy: null,
            data: {
                status: 'ACTIVE',
                firstName: null,
                lastName: null,
                email: null,
                password: null,
                primaryPhone: null,
                type: 'USER-COMPANY',
                companyUser: {
                    status: 'ACTIVE',
                    photoURL: 'https://',
                    subtype: null,
                    employedType: null,
                    company: null,
                },
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
