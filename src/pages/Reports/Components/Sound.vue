<template>
    <b-modal body-class="soundModal" id="soundModal" :hide-header="true" :hide-footer="true" size="l" class="modal-message">
        <audio controls autoplay class="audio">
            <source v-if="soundURL" v-bind:src="`${soundURL}`" type="audio/mpeg" />
            {{ $t('str.browser.not.support.audio') }}
        </audio>
    </b-modal>
</template>

<script>
export default {
    props: ['data'],
    watch: {
        data: function () {
            this.soundURL = this.data
        },
    },
    data() {
        return {
            soundURL: {},
        }
    },
}
</script>
<style lang="scss" scoped>
.audio {
    width: -webkit-fill-available !important;
}
</style>
