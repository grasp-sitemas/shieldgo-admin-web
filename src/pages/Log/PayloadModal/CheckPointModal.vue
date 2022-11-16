<template>
    <b-modal id="payloadModal" :hide-footer="true" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.modal.logs.payload.title') }}</h4>
            <a class="btn-close cursor_pointer" @click="$bvModal.hide('payloadModal')"></a>
        </template>
    </b-modal>
</template>

<script>
export default {
    props: {
        payload: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {}
    },
    methods: Controller.methods,
}
</script>
