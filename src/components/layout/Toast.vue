<template>
    <div class="modal " id="toast" tabindex="-1" role="dialog" aria-labelledby="toast" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered d-flex justify-content-center" role="document">
            <div class="modal-content">
                <div class="toast-header">
                    <strong class="mr-auto">{{title}}</strong>
                    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close" v-on:click="close()">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="toast-body">
                    <p v-html="message"></p>
                    <small v-if="messageId">ID: {{messageId}}</small>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["title", "message", "messageId"],
        methods:{
            close: ()=>{
                $('#toast').modal('hide');
            }
        }
    }
</script>