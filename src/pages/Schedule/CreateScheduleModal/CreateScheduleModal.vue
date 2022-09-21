<template>
    <b-modal no-close-on-backdrop id="recoveryPassword" @hide="clearForm" :hide-footer="true" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.modal.recovery.password.title') }}</h4>
            <a class="btn-close cursor_pointer" @click="$bvModal.hide('recoveryPassword')"></a>
        </template>

        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </b-modal>
</template>

<script>
import Controller from './CrtRecoveryPassword.vue'
export default {
    props: {
        date: {
            type: String,
            default: () => '',
        },
        accounts: {
            type: Array,
            default: () => [],
        },
        clients: {
            type: Array,
            default: () => [],
        },
        sites: {
            type: Array,
            default: () => [],
        },
        isSuperAdminMaster: {
            type: Boolean,
            default: false,
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