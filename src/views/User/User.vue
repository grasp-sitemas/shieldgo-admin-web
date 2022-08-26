<template>
    <div class="account-pages w-100 mt-5 mb-5">
        <div class="content">
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-md-8 col-lg-8 col-xl-8">
                        <div class="backgroundColorRed card-radius-top topBorderCard text-center" style="padding: 5px">
                            <router-link to="register-company" class="cursor-pointer" style="margin-top: 10px; margin-left: 10px; float: left">
                                <i class="mdi mdi-keyboard-backspace btn-back" style="color: white"></i>{{ `` }}<span class="btn-back" style="color: white">{{ $t('string.msg.form.btn.goback') }}</span>
                            </router-link>
                            <a class="text-center">
                                <span><img class="mt-1" src="assets/images/shieldgo-logo.jpeg" alt="shieldgo" height="35px" /></span>
                            </a>
                        </div>

                        <div class="card-box">
                            <h4 class="header-title">{{ $t('string.msg.user.label.title') }}</h4>
                            <p class="sub-header">
                                {{ $t('string.msg.user.label.decription') }}
                            </p>

                            <form>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress" class="col-form-label">
                                            <code class="highlighter-rouge">*</code>
                                            {{ $t('string.msg.user.label.name') }}
                                        </label>
                                        <input type="text" v-model="data.firstName" class="form-control" :placeholder="$t('string.msg.user.placeholder.name')" />
                                    </div>

                                    <div class="form-group col-md-6">
                                        <label for="inputAddress" class="col-form-label">
                                            <code class="highlighter-rouge">*</code>
                                            {{ $t('string.msg.user.label.lastname') }}
                                        </label>
                                        <input type="text" v-model="data.lastName" class="form-control" :placeholder="$t('string.msg.user.placeholder.lastname')" />
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress" class="col-form-label">
                                            <code class="highlighter-rouge">*</code>
                                            {{ $t('string.msg.user.label.email') }}
                                        </label>
                                        <input type="text" v-model="data.email" class="form-control" :placeholder="$t('string.msg.user.placeholder.email')" />
                                    </div>

                                    <div class="form-group col-md-6">
                                        <label for="inputAddress" class="col-form-label">
                                            <code v-if="!data._id" class="highlighter-rouge">*</code>
                                            {{ $t('string.msg.user.label.password') }}
                                        </label>
                                        <input type="password" v-model="data.password" class="form-control" :placeholder="$t('string.msg.user.placeholder.password')" />
                                    </div>
                                </div>

                                <br /><br />

                                <div v-if="errors.length" class="alert alert-danger">
                                    <p class="lead">{{ $t('response.msg.error.empty.fields') }}</p>
                                    <ul>
                                        <li v-bind:key="error" v-for="error in errors">{{ error }}</li>
                                    </ul>
                                </div>

                                <!-- Circles which indicates the steps of the form: -->
                                <div style="text-align: center; margin-top: 40px">
                                    <span class="step step-on"></span>
                                    <span class="step step-on"></span>
                                </div>

                                <br />
                                <div class="form-row">
                                    <div class="form-group col-md-12 text-center">
                                        <button @click="checkForm" class="btn btn-primaryGreen w-50">{{ $t('string.msg.form.btn.next') }}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Spinner />
        <Toast :title="titleToast" :message="messageToast" :messageId="messageIdToast" />
        <ModalAddress :addresses="addresses" v-on:select-address="selectAddress" />
    </div>
</template>

<script>
import Controller from './CrtUser'

import Spinner from '../../components/layout/Spinner'
import ModalAddress from './Modal/ModalAddress'
import Toast from '../../components/layout/Toast'

export default {
    name: 'User',
    components: {
        Spinner,
        Toast,
        ModalAddress,
    },
    data() {
        return {
            errors: [],
            addresses: [],
            valuekey: 0,
            titleToast: null,
            messageToast: null,
            messageIdToast: null,
            data: {
                status: 'ACTIVE',
                firstName: null,
                lastName: null,
                email: null,
                password: null,
                type: 'USER-COMPANY',
                companyUser: {
                    subtype: 'ADMIN',
                },
            },
        }
    },
    methods: Controller.methods,
    created() {
        Controller.init(this)
    },
    mounted() {
        this.findAllUser()
    },
}
</script>

<style>
</style>
