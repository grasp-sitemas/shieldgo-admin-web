<template>
    <b-modal no-close-on-backdrop id="recoveryPassword" @hide="clearForm" :hide-footer="true" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.modal.recovery.password.title') }}</h4>
            <a class="btn-close cursor_pointer" @click="$bvModal.hide('recoveryPassword')"></a>
        </template>

        <div class="nav-wizards-container">
            <nav class="nav nav-wizards-1 mb-2">
                <div class="nav-item col">
                    <a class="nav-link" v-bind:class="{ active: step === 1, completed: step === 2 || step === 3, disabled: step === 3 }">
                        <div class="nav-no">1</div>
                        <div class="nav-text">{{ $t('str.modal.email.step') }}</div>
                    </a>
                </div>

                <div class="nav-item col">
                    <a class="nav-link" v-bind:class="{ active: step === 2, completed: step > 2, disabled: step < 2 }">
                        <div class="nav-no">2</div>
                        <div class="nav-text">{{ $t('str.modal.check.code.step') }}</div>
                    </a>
                </div>

                <div class="nav-item col">
                    <a class="nav-link" v-bind:class="{ active: step === 3, disabled: step === 1 || step === 2 }">
                        <div class="nav-no">3</div>
                        <div class="nav-text">{{ $t('str.modal.finished.step') }}</div>
                    </a>
                </div>
            </nav>
        </div>

        <div class="card- transparent">
            <div class="card-body">
                <div v-if="step === 1">
                    <div class="col-md-12">
                        <label class="form-label">{{ $t('str.recovery.password.email.field') }}</label>
                        <input class="form-control" v-model="data.email" type="text" :placeholder="$t('str.recovery.password.email.placeholder')" />
                    </div>
                    <div class="text-center mt-20px">
                        <button :disabled="!isValidEmail(data.email)" @click="handleGenerateCodePassword" type="submit" class="btn btn-primary w-200px me-10px is-loading">
                            <i v-if="isLoading === true" class="fas fa-spinner fa-pulse"></i>
                            {{ $t('str.btn.next') }}
                        </button>
                    </div>
                </div>
                <div v-if="step === 2" class="row">
                    <div class="col-md-12 mb-3">
                        <label class="form-label" for="codeField">{{ $t('str.recovery.password.code.field') }}</label>
                        <input type="text" id="codeField" v-mask="'XXXXXXXX'" @input="transformUpperCase" v-model="data.code" class="form-control" :placeholder="$t('str.recovery.password.code.placeholder')" />
                    </div>
                    <div class="col-md-12 mb-3">
                        <label class="form-label">{{ $t('str.recovery.password.newpassword.field') }}</label>
                        <div class="input-group">
                            <input
                                class="form-control"
                                autocomplete="off"
                                v-model="data.password"
                                v-bind:type="showPassword ? 'text' : 'password'"
                                :placeholder="$t('str.recovery.password.newpassword.placeholder')"
                            />
                            <span class="input-group-text" v-on:click="showPassword = !showPassword">
                                <i v-bind:class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                            </span>
                        </div>
                    </div>
                    <div class="col-md-12 mb-4">
                        <label class="form-label">{{ $t('str.recovery.password.confirm.newpassword.field') }}</label>
                        <div class="input-group">
                            <input
                                class="form-control"
                                v-model="data.passwordConfirm"
                                autocomplete="off"
                                v-bind:type="showConfirmPassword ? 'text' : 'password'"
                                :placeholder="$t('str.recovery.password.newpassword.placeholder')"
                            />
                            <span class="input-group-text" v-on:click="showConfirmPassword = !showConfirmPassword">
                                <i v-bind:class="showConfirmPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                            </span>
                        </div>
                    </div>
                    <div class="text-center">
                        <button :disabled="checkEnableButton()" v-on:click="checkPasswordStep" type="submit" class="btn btn-primary w-200px me-10px is-loading">
                            <i v-if="isLoading === true" class="fas fa-spinner fa-pulse"></i>
                            {{ $t('str.btn.next') }}
                        </button>
                    </div>
                </div>
                <div v-if="step === 3" class="text-center">
                    <h5 class="mt-40px mb-5 text-center">{{ $t('str.password.success.changed') }}</h5>
                    <button v-on:click="$bvModal.hide('recoveryPassword')" type="submit" class="btn btn-primary w-200px me-10px is-loading">
                        <i v-if="isLoading === true" class="fas fa-spinner fa-pulse"></i>
                        {{ $t('str.btn.close') }}
                    </button>
                </div>
            </div>
        </div>
        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </b-modal>
</template>

<script>
import Controller from './CrtRecoveryPassword.vue'
export default {
    props: {
        email: {
            type: String,
            default: () => '',
        },
    },
    data() {
        return {
            isLoading: false,
            isCheckEmail: false,
            step: 1,
            showPassword: false,
            showConfirmPassword: false,
            data: {
                email: '',
                password: '',
                passwordConfirm: '',
                code: '',
                systemUser: '',
            },
        }
    },
    methods: Controller.methods,
}
</script>

<style>
</style>