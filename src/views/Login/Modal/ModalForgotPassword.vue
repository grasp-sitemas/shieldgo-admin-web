<template>
    <div class="modal fade" id="modalEsqueciSenha" tabindex="-1" role="dialog" aria-labelledby="modalEsqueciSenha" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="card card-radius">
                <div class="backgroundColorRed card-radius-top topBorderCard text-center">
                    <img src="assets/images/shieldgo-logo.jpeg" alt="shieldgo" height="60px" />
                </div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-uppercase">{{ $t('string.login.forgot.password') }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>
                            {{ $t('string.msg.change.password.message') }}
                        </p>
                        <form id="form-esqueci-senha">
                            <div class="form-group">
                                <input type="text" v-model="data.code" class="form-control form-control-lg has-border" :placeholder="$t('string.msg.change.password.placeholder.code')" />
                                <br />
                                <div v-if="errors.length" class="alert-danger">
                                    <ul>
                                        <li v-bind:key="error" v-for="error in errors">{{ error }}</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="d-flex bd-highlight mb-3">
                                <button @click="$emit('check-code')" class="btn btn-primaryGreen w-20" type="button">{{ $t('string.btn.send') }}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['data', 'errors'],
}
</script>

