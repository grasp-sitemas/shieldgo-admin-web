<template>
    <div class="modal fade" id="modalCode" tabindex="-1" role="dialog" aria-labelledby="modalCode" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-uppercase">{{ $t('shieldgo.company.register.modal.code.title') }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <img src="assets/img/icon-close-black.png" />
                    </button>
                </div>
                <div class="modal-body">
                    <p class="pre-line">
                        {{ $t('shieldgo.company.register.modal.code.description') }}
                    </p>
                    <br />
                    <input type="text" v-model="data.codeOwner" class="form-control" :placeholder="$t('shieldgo.company.register.indication.owner.placeholder')" />
                    <br />
                    <div v-if="errors.length" class="alert-danger">
                        <ul>
                            <li v-bind:key="error" v-for="error in errors">{{ error }}</li>
                        </ul>
                    </div>
                    <div class="form-row">
                        <div class="col-sm-6 col-lg-3 offset-lg-2 text-center mt-4">
                            <button type="submit" @click="$emit('cancel-code')" class="btn btn-primaryGreen btn-lg button-with-image image-on-right">
                                {{ $t('shieldgo.btn.cancel') }}
                                <img src="assets/img/icon-close-white.png" width="24" />
                            </button>
                        </div>
                        <div class="col-sm-6 col-lg-3 offset-lg-2 text-center mt-4">
                            <button type="submit" @click="$emit('confirm-code')" class="btn btn-success btn-lg button-with-image image-on-right">
                                {{ $t('shieldgo.btn.confirm') }}
                                <img src="assets/img/icon-arrow-right-white.png" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['data', 'errors'],
    data() {
        return {
            name: this.data.codeOwner,
        }
    },
}
</script>

