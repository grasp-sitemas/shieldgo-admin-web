<template>
    <div id="wrapper" :key="valuekey">
        <div class="content-page">
            <div class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div class="page-title-box">
                                <h4 class="page-title">{{ $t('str.msg.projects.label') }}</h4>
                            </div>
                        </div>
                    </div>
                    <!-- Form row -->
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card-box">
                                <p class="sub-header">
                                    {{ $t('str.msg.register.projects.label') }}
                                </p>

                                <form>
                                    <div v-if="data._id" class="form-row">
                                        <div class="form-group col-md-3">
                                            <label for="inputAddress" class="col-form-label"> <code class="highlighter-rouge">*</code> {{ $t('string.msg.product.brand.label.id') }} </label>
                                            <input type="text" v-model="data._id" readonly class="form-control" />
                                        </div>
                                        <div class="form-group col-md-2 mt-4">
                                            <button v-on:click="confirmArchive" class="text-dark-gray btn btn-warning w-100">{{ $t('string.msg.status.archive') }}</button>
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group col-md-6 mt-2">
                                            <label>
                                                <code class="highlighter-rouge">*</code>
                                                {{ $t('string.msg.list.user.label.name') }}
                                            </label>
                                            <input type="text" v-model="data.name" class="form-control" :placeholder="$t('string.msg.list.user.label.name')" />
                                        </div>

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

                                    <div v-if="errors.length" class="alert alert-danger">
                                        <p class="lead">{{ $t('response.msg.error.empty.fields') }}</p>
                                        <ul>
                                            <li v-bind:key="error" v-for="error in errors">{{ error }}</li>
                                        </ul>
                                    </div>

                                    <div class="mt-2 form-row text-center">
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
import Controller from './CrtProject'
import List from './ListProject'
import Spinner from '../../components/layout/Spinner'
import Toast from '../../components/layout/Toast'
import Confirmation from '../../components/layout/Confirmation'
import Vue from 'vue'
Vue.prototype.$eventHub = new Vue()

export default {
    name: 'Project',
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
            companies: [],
            valuekey: 0,
            titleToast: null,
            messageToast: null,
            messageIdToast: null,
            data: {
                status: 'ACTIVE',
                name: null,
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

<style>
</style>
