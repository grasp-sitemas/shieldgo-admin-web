<template>
    <b-modal id="signatureModal" :hide-header="true" :hide-footer="true" size="m" class="modal-message">
        <img v-if="signature && signature !== 'https://'" v-bind:src="`${domain}${signature}`" alt="image" class="mw-100 d-block" />
        <div v-else class="text-center">
            <label>{{ $t('str.no.load.image') }}</label>
        </div>
    </b-modal>
</template>

<script>
import Endpoints from '../../../../common/Endpoints.vue'
export default {
    props: ['signatureURL'],
    watch: {
        signatureURL: function () {
            this.signature = this?.signatureURL
        },
    },
    data() {
        return {
            signature: null,
            domain: Endpoints.domain,
        }
    },
}
</script>
<style lang="scss" scoped>
.modal-body {
    text-align: center !important;
}
</style>
