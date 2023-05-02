<template>
    <b-modal id="signatureModal" :hide-header="true" :hide-footer="true" size="m" class="modal-message">
        <img v-if="signatureURL && signatureURL !== 'https://'" v-bind:src="`${signatureURL}`" alt="image" class="mw-100 d-block" />
        <div v-else class="text-center">
            <label>{{ $t('str.no.load.image') }}</label>
        </div>
    </b-modal>
</template>

<script>
export default {
    props: ['data'],
    watch: {
        data: function () {
            this.signatureURL = this.data
        },
    },
    data() {
        return {
            signatureURL: {},
        }
    },
}
</script>
<style lang="scss" scoped>
.modal-body {
    text-align: center !important;
}
</style>
