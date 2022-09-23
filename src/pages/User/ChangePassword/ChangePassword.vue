<template>
    <div>
        <ol class="breadcrumb float-xl-end">
            <li class="breadcrumb-item">
                <a href="#/change-password">{{ $t('str.breadcrumb.change.password') }}</a>
            </li>
        </ol>

        <h1 class="page-header">
            {{ $t('str.form.title.change.password') }}
        </h1>

        <panel :title="$t('str.form.title')">
            <form>
                <fieldset>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="emailField">{{ $t('str.change.password.email.field') }}</label>
                            <input disabled v-model="data.email" class="form-control" type="text" key="emailField" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="passwordField">{{ $t('str.change.password.field') }}</label>
                            <div class="input-group">
                                <input
                                    v-model="data.password"
                                    class="form-control"
                                    v-bind:class="checkRequiredField('password') ? 'is-invalid' : ''"
                                    @focus="removeRequiredField('password')"
                                    key="passwordField"
                                    v-bind:type="showPassword ? 'text' : 'password'"
                                    :placeholder="$t('str.change.password.placeholder')"
                                />
                                <span class="input-group-text" v-on:click="showPassword = !showPassword">
                                    <i v-bind:class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                                </span>
                                <div class="invalid-feedback">{{ $t('str.change.password.required') }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="newPasswordField">{{ $t('str.change.password.new.field') }}</label>
                            <div class="input-group">
                                <input
                                    v-model="newPassword"
                                    class="form-control"
                                    v-bind:class="checkRequiredField('newPassword') ? 'is-invalid' : ''"
                                    @focus="removeRequiredField('newPassword')"
                                    key="newPasswordField"
                                    v-bind:type="showNewPassword ? 'text' : 'password'"
                                    autocomplete="off"
                                    :placeholder="$t('str.change.password.new.placeholder')"
                                />
                                <span class="input-group-text" v-on:click="showNewPassword = !showNewPassword">
                                    <i v-bind:class="showNewPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                                </span>
                                <div class="invalid-feedback">{{ $t('str.change.password.new.required') }}</div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="confirmNewPasswordField">{{ $t('str.change.password.confirm.field') }}</label>
                            <div class="input-group">
                                <input
                                    v-model="confirmNewPassword"
                                    class="form-control"
                                    v-bind:class="checkRequiredField('confirmNewPassword') ? 'is-invalid' : ''"
                                    @focus="removeRequiredField('confirmNewPassword')"
                                    key="confirmNewPasswordField"
                                    v-bind:type="showConfirmNewPassword ? 'text' : 'password'"
                                    autocomplete="off"
                                    :placeholder="$t('str.change.password.confirm.placeholder')"
                                />
                                <span class="input-group-text" v-on:click="showConfirmNewPassword = !showConfirmNewPassword">
                                    <i v-bind:class="showConfirmNewPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                                </span>
                            </div>
                            <div class="invalid-feedback">{{ $t('str.change.password.confirm.required') }}</div>
                        </div>
                    </div>

                    <div class="btn-center mt-4 mb-2">
                        <button :disabled="checkEnableButton()" v-on:click="checkForm" type="submit" class="btn btn-primary w-200px me-10px is-loading">
                            <i v-if="isLoading === true" class="fas fa-spinner fa-pulse"></i>
                            {{ $t('str.btn.save') }}
                        </button>
                    </div>
                </fieldset>
            </form>
        </panel>
        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </div>
</template>

<script>
import Controller from './CrtChangePassword.vue'

export default {
    data() {
        return {
            isLoading: false,
            errors: [],
            showPassword: false,
            showNewPassword: false,
            showConfirmNewPassword: false,
            newPassword: '',
            confirmNewPassword: '',
            data: {
                email: '',
                password: '',
            },
        }
    },
    methods: Controller.methods,
    created() {},
    mounted() {
        Controller.init(this)
    },
}
</script>
