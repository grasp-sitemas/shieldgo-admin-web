<template>
    <b-modal body-class="soundModal" id="soundModal" :hide-header="true" :hide-footer="true" size="l" class="modal-message">
        <audio controls autoplay class="audio">
            <source v-if="sound" v-bind:src="`${domain}${sound}`" type="audio/mpeg" />
            {{ $t('str.browser.not.support.audio') }}
        </audio>
    </b-modal>
</template>

<script>
import Endpoints from '../../../../common/Endpoints.vue'
export default {
    props: ['soundURL'],
    watch: {
        soundURL: function () {
            this.sound = this?.soundURL
        },
    },
    data() {
        return {
            sound: null,
            domain: Endpoints.domain,
        }
    },
}
</script>
<style lang="scss" scoped>
.audio {
    width: -webkit-fill-available !important;
}
</style>
