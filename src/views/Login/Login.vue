<template>
    <div class="account-pages mt-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-6 col-xl-5">
                    <div class="cardLogin card-radius">
                        <div class="card-body p-4 form-controlLogin">
                            <div class="text-center mb-4">
                                <a>
                                    <span><img src="assets/img/logo.png" alt="ShieldGo" width="180px" /></span>
                                </a>
                            </div>
                            <form action="#" class="pt-2">
                                <div class="form-group mb-3">
                                    <input class="input-text form-control" v-model="data.email" type="email" required="" :placeholder="$t('string.msg.login.placeholder.email')" />
                                </div>
                                <div class="form-group mb-3">
                                    <input
                                        class="input-text form-control"
                                        v-model="data.password"
                                        v-on:keyup.enter="submit"
                                        type="password"
                                        required=""
                                        :placeholder="$t('string.msg.login.placeholder.password')"
                                    />
                                </div>
                                <br />
                                <div class="container-fluid">
                                    <div class="col-sm-12 text-center">
                                        <input type="button" @click="submit" class="btn btn-primaryGreen btn-login" :value="$t('string.msg.login.btn.login')" />
                                    </div>
                                </div>
                            </form>
                            <br />

                            <!-- <div class="text-center mb-4">
                                <a @click="checkForgotPassword()" class="cursor-pointer">
                                    <a  class="text-muted underline"> <small style="color:white">{{$t('string.login.forgot.password')}}</small></a>
                                </a>
                            </div> 
                         -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Spinner />
        <Toast :title="titleToast" :message="messageToast" :messageId="messageIdToast" />
        <ModalForgotPassword v-on:check-code="checkCode" :data="data" :errors="errors" />
        <ModalNewPassword v-on:reset-pass="resetPass" :data="data" :errors="errors" />
    </div>
</template>

<script>
import Controller from './CrtLogin'
import Spinner from '../../components/layout/Spinner'
import Toast from '../../components/layout/Toast'
import ModalForgotPassword from './Modal/ModalForgotPassword'
import ModalNewPassword from './Modal/ModalNewPassword'
import OneSignalVue from 'onesignal-vue'

export default {
    name: 'Home',
    components: {
        Spinner,
        Toast,
        ModalForgotPassword,
        ModalNewPassword,
    },
    data() {
        return {
            errors: [],
            titleToast: null,
            messageToast: null,
            messageIdToast: null,
            data: {
                email: null,
                password: null,
                passwordConfirm: null,
                code: null,
                systemUser: null,
            },
            user: null,
        }
    },
    methods: Controller.methods,
    beforeCreate() {
        this.$OneSignal.showSlidedownPrompt()
    },
    created() {
        Controller.init(this)
        // this.data.email = 'dev@grasp.com.br'
        // this.data.password = '12345678'
    },
}
</script>

