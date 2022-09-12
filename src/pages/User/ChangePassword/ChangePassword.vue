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
                            <input
                                v-model="data.password"
                                class="form-control"
                                v-bind:class="checkRequiredField('password') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('password')"
                                type="password"
                                key="passwordField"
                                :placeholder="$t('str.change.password.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.change.password.required') }}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="newPasswordField">{{ $t('str.change.password.new.field') }}</label>
                            <input
                                v-model="newPassword"
                                class="form-control"
                                v-bind:class="checkRequiredField('newPassword') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('newPassword')"
                                type="password"
                                key="newPasswordField"
                                :placeholder="$t('str.change.password.new.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.change.password.new.required') }}</div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="confirmNewPasswordField">{{ $t('str.change.password.confirm.field') }}</label>
                            <input
                                v-model="confirmNewPassword"
                                class="form-control"
                                v-bind:class="checkRequiredField('confirmNewPassword') ? 'is-invalid' : ''"
                                @focus="removeRequiredField('confirmNewPassword')"
                                type="password"
                                key="confirmNewPasswordField"
                                :placeholder="$t('str.change.password.confirm.placeholder')"
                            />
                            <div class="invalid-feedback">{{ $t('str.change.password.confirm.required') }}</div>
                        </div>
                    </div>

                    <div v-if="hasShowErrors()" class="alert alert-danger">
                        <ul>
                            <li v-for="error in errors" :key="error">
                                <p v-if="error !== 'password' && error !== 'newPassword' && error !== 'confirmNewPassword'">{{ $t(error) }}</p>
                            </li>
                        </ul>
                    </div>

                    <div class="btn-center mt-4 mb-2">
                        <button v-on:click="checkForm" type="submit" class="btn btn-primary w-200px me-10px is-loading">
                            <i v-if="isLoading === true" class="fas fa-spinner fa-pulse"></i>
                            {{ $t('str.btn.save') }}
                        </button>
                        <button @click="clearForm" type="submit" class="btn btn-default w-200px">{{ $t('str.btn.new.form') }}</button>
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
            newPassword: null,
            confirmNewPassword: null,
            currentPassword: null,
            data: {
                email: null,
                password: null,
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
