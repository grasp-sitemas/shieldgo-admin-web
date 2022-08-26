<template>
    <div class="modal fade" id="confirmationModal" tabindex="-1" role="dialog" aria-labelledby="confirmationModallLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="confirmationModalLabel">{{title}}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p v-html="message"></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary w-20" data-dismiss="modal" v-on:click="$emit('confirmation-return', 1)">{{yesText}}</button>
                <button type="button" class="btn btn-secondary w-20" data-dismiss="modal" v-on:click="$emit('confirmation-return', 0)">{{cancelText}}</button>
            </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["title", "message", "cancelText", "yesText"],
        methods:{
        }
    }
</script>