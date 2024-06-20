<template>
    <div class="background-image">
        <div class="language-selector">
            <span class="flag-icon flag-icon-br" @click="changeLanguage('pt')" title="Português"></span>
            <span class="flag-icon flag-icon-us" @click="changeLanguage('en')" title="English"></span>
        </div>
        <div class="login login-v2 fw-bold">
            <div class="login-container mb-lg-5">
                <div class="login-header">
                    <img src="../../assets/images/logo.png" alt="ShieldGo" width="150" />
                </div>
                <div class="login-content">
                    <form v-on:submit="signIn">
                        <div class="form-floating mb-20px">
                            <input type="text" v-model="data.email" class="form-control fs-13px h-45px border-0" :placeholder="$t('str.title.email.address')" id="emailAddress" />
                            <label for="emailAddress" class="d-flex align-items-center text-gray-600 fs-13px">
                                {{ $t('str.title.email.address') }}
                            </label>
                        </div>
                        <div class="form-floating mb-20px position-relative">
                            <input
                                v-model="data.password"
                                v-bind:type="showPassword ? 'text' : 'password'"
                                class="form-control fs-13px h-45px border-0"
                                :placeholder="$t('str.title.password')"
                                id="passwordField"
                            />
                            <label for="passwordField" class="d-flex align-items-center text-gray-600 fs-13px">
                                {{ $t('str.title.password') }}
                            </label>
                            <span class="password-toggle" v-on:click="togglePassword">
                                <i v-bind:class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                            </span>
                        </div>
                        <div class="mb-20px">
                            <button type="submit" class="btn btn-primary d-block w-100 h-45px btn-lg">
                                <i v-if="loading" class="fas fa-spinner fa-spin" />
                                {{ $t('str.title.signin') }}
                            </button>
                        </div>
                    </form>
                    <div class="text-gray-500 text-center mt-10px">
                        <a v-b-modal.recoveryPassword class="text-white">{{ $t('str.recovery.password') }}</a>
                    </div>
                </div>
            </div>
        </div>
        <RecoveryPassword :email="data.email" />
        <notifications group="top-right" position="top right" :speed="500" />

        <footer class="footer w-100">
            <div class="container align-items-center w-100">
                <div class="row f-content">
                    <div class="col-md-4">
                        <a :href="googlePlayURL" target="_blank">
                            <img src="../../assets/images/googleplay.png" alt="Google play" width="140" />
                        </a>
                    </div>
                    <div class="col-md-4">
                        <p>© {{ new Date().getFullYear() }} {{ $t('str.footer.copy.right') }}. {{ $t('str.footer.all.rights.reserved') }}</p>
                        <p>
                            {{ $t('str.footer.developed.by') }}
                            <a :href="$t('str.footer.link')" target="_blank" class="footer-link"
                                ><strong>{{ $t('str.footer.shield.go') }}</strong></a
                            >
                        </p>
                    </div>
                    <div class="col-md-4">
                        <a href="https://admin.shieldgo.com.br/?#/privacy-policy" target="_blank" class="text-white"> {{ $t('str.footer.privacy.policy') }}</a>
                    </div>
                </div>
            </div>
        </footer>
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
            showPassword: false,
            googlePlayURL: null,
            data: {
                email: null,
                password: null,
                passwordConfirm: null,
                code: null,
                systemUser: null,
            },
        }
    },
    methods: {
        ...Controller.methods,
        togglePassword() {
            this.showPassword = !this.showPassword
        },
        changeLanguage(lang) {
            this.$i18n.locale = lang
        },
    },
}
</script>

<style lang="scss" scoped>
.language-selector {
    position: absolute;
    top: 20px;
    right: 20px;
}
.language-selector .flag-icon {
    font-size: 24px;
    cursor: pointer;
    margin: 0 5px;
}
.background-image {
    background-color: #000 !important;
}
.login-header {
    place-content: center !important;
}

.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #333; /* Ajuste a cor de fundo conforme necessário */
    color: #fff; /* Ajuste a cor do texto conforme necessário */
    height: 60px; /* Ajuste a altura conforme necessário */
    padding-left: 10% !important;
    padding-right: 10% !important;
}

.footer-column {
    flex: 1;
    text-align: center;
}

.footer-column:first-child {
    text-align: left;
}

.footer-column:last-child {
    text-align: right;
}

.footer a {
    color: #fff; /* Ajuste a cor dos links conforme necessário */
    text-decoration: none;
}

.footer a:hover {
    text-decoration: underline;
}

.footer-content {
    margin-top: 20px;
    padding: 10px;
    color: #fff;
    justify-content: space-between;
    align-items: center;
}

.footer-content a {
    text-decoration: none;
    color: #fff;
    margin: 0 10px;
}

.login.login-v2 .login-container {
    background-color: #1d1c20;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    padding: 20px;
}
.position-relative {
    position: relative;
}
.password-toggle {
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    cursor: pointer;
}
.password-toggle i {
    color: #6c757d;
}
.form-floating label {
    transition: color 0.2s, transform 0.2s;
}
.form-floating input:focus ~ label,
.form-floating input:not(:placeholder-shown) ~ label {
    color: #007bff;
    transform: translateY(-10px) scale(0.85);
}
.footer-content {
    margin-top: 20px;
    padding: 10px;
    color: #fff;
    text-align: center;
}
.footer-content a {
    text-decoration: none;
    color: #fff;
    margin: 0 10px;
}
.footer {
    background-color: #1d1c20;
    color: #fff;
    padding: 15px 0;
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;

    p {
        margin: 0;
        font-size: 10px;
    }
}
.footer .container {
    justify-content: space-between;
    align-items: center;
}
.footer p {
    margin: 0;
}
.footer-link {
    color: #fff;
    text-decoration: none;
}
.footer-link:hover {
    text-decoration: underline;
}
.container {
    max-width: 100%;
}
.f-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    a {
        color: #fff;
        text-decoration: none;
    }
}
.mb-lg-5 {
    margin-bottom: 4rem !important;
}
</style>
