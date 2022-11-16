<template>
    <div class="background-image">
        <div class="login login-v2 fw-bold">
            <div class="login-container">
                <div class="login-header">
                    <img src="../../assets/images/logo.png" alt="ShieldGo" width="150" />
                </div>
                <div class="login-content">
                    <form v-on:submit="signIn">
                        <div class="form-floating mb-20px">
                            <input type="text" v-model="data.email" class="form-control fs-13px h-45px border-0" :placeholder="$t('str.title.email.address')" id="emailAddress" />
                            <label for="emailAddress" class="d-flex align-items-center text-gray-600 fs-13px">{{ $t('str.title.email.address') }}</label>
                        </div>
                        <div class="form-floating mb-20px">
                            <input type="password" v-model="data.password" class="form-control fs-13px h-45px border-0" :placeholder="$t('str.title.password')" />
                            <label for="emailAddress" class="d-flex align-items-center text-gray-600 fs-13px">{{ $t('str.title.password') }}</label>
                        </div>

                        <div class="mb-20px">
                            <button type="submit" class="btn btn-primary d-block w-100 h-45px btn-lg">
                                <i v-if="loading" class="fas fa-spinner fa-spin" />
                                {{ $t('str.title.signin') }}
                            </button>
                        </div>
                    </form>
                    <div class="text-gray-500">
                        {{ $t('str.not.member.yet') + ' ' + $t('str.click') }}
                        <a href="javascript:;" class="text-white">{{ $t('str.here') }}</a> {{ $t('str.to.register') }}
                    </div>
                    <div class="text-gray-500 text-center mt-10px">
                        <a v-b-modal.recoveryPassword class="text-white">{{ $t('str.recovery.password') }}</a>
                    </div>
                </div>
            </div>
        </div>
        <RecoveryPassword :email="data.email" />
        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </div>
</template>

<script>
import AppOptions from '../../config/AppOptions.vue'
import Controller from './CrtLogin.vue'
import RecoveryPassword from './RecoveryPassword/RecoveryPassword.vue'
export default {
    components: {
        RecoveryPassword,
    },
    created() {
        AppOptions.appEmpty = true
        this.data.email = 'dev@grasp.com.br'
        this.data.password = '12345678'
    },
    mounted() {
        Controller.init(this)
    },
    beforeRouteLeave(to, from, next) {
        AppOptions.appEmpty = false
        next()
    },
    data() {
        return {
            loading: false,
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
