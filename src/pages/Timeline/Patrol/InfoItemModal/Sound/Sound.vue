<template>
    <b-modal body-class="soundModal" id="soundModal" :hide-header="true" :hide-footer="true" size="l" class="modal-message">
        <audio controls autoplay class="audio">
            <source v-if="soundURL" v-bind:src="`${domain}${soundURL}`" type="audio/mpeg" />
            {{ $t('str.browser.not.support.audio') }}
        </audio>
    </b-modal>
</template>

<script>
import Endpoints from '../../../../../common/Endpoints.vue'
export default {
    props: ['data'],
    watch: {
        data: function () {
            this.soundURL = this.data?.row?.medias?.sound
        },
    },
    data() {
        return {
            soundURL: {},
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
