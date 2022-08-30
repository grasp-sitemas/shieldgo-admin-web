<template>
    <div class="background-image">
        <div class="login login-v2 fw-bold">
            <div class="login-container">
                <div class="login-header">
                    <img src="../../assets/images/logo.png" alt="ShieldGo" width="150" />
                </div>
                <div class="login-content">
                    <form v-on:submit="signIn" method="GET">
                        <div class="form-floating mb-20px">
                            <input type="text" v-model="data.email" class="form-control fs-13px h-45px border-0" :placeholder="$t('str.title.email.address')" id="emailAddress" />
                            <label for="emailAddress" class="d-flex align-items-center text-gray-600 fs-13px">{{ $t('str.title.email.address') }}</label>
                        </div>
                        <div class="form-floating mb-20px">
                            <input type="password" v-model="data.password" class="form-control fs-13px h-45px border-0" :placeholder="$t('str.title.password')" />
                            <label for="emailAddress" class="d-flex align-items-center text-gray-600 fs-13px">{{ $t('str.title.password') }}</label>
                        </div>

                        <div class="mb-20px">
                            <button type="submit" class="btn btn-primary d-block w-100 h-45px btn-lg">{{ $t('str.title.signin') }}</button>
                        </div>
                        <div class="text-gray-500">
                            {{ $t('str.not.member.yet') + ' ' + $t('str.click') }}
                            <a href="javascript:;" class="text-white">{{ $t('str.here') }}</a> {{ $t('str.to.register') }}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AppOptions from '../../config/AppOptions.vue'
import Controller from './CrtLogin.vue'
export default {
    created() {
        AppOptions.appEmpty = true
        Controller.init(this)
        this.data.email = 'dev@grasp.com.br'
        this.data.password = '12345678'
    },
    beforeRouteLeave(to, from, next) {
        AppOptions.appEmpty = false
        next()
    },
    data() {
        return {
            data: {
                email: null,
                password: null,
                passwordConfirm: null,
                code: null,
                systemUser: null,
            },
        }
    },
    methods: Controller.methods,
    beforeCreate() {
        // this.$OneSignal.showSlidedownPrompt()
    },
}
</script>
<style lang="scss" scoped>
.background-image {
    background-image: url('../../assets/images/bg-glass.png') !important;
}
.login-header {
    place-content: center !important;
}
</style>