<template>
    <b-modal id="photoModal" :hide-header="true" :hide-footer="true" size="m" class="modal-message">
        <img v-if="photoURL && photoURL !== 'https://'" v-bind:src="`${domain}${photoURL}`" alt="image" class="mw-100 d-block" />
        <div v-else class="text-center">
            <label>{{ $t('str.no.load.image') }}</label>
        </div>
    </b-modal>
</template>

<script>
import Endpoints from '../../../../common/Endpoints.vue'
export default {
    props: ['data'],
    watch: {
        data: function () {
            this.photoURL = this.data?.photoURL
        },
    },
    data() {
        return {
            photoURL: {},
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
