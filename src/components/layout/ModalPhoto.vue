<template>
    <div class="modal fade" id="modalPhoto" tabindex="-1" role="dialog" aria-labelledby="modalPhoto" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <div class="modal-body">
                    <div class="d-flex justify-content-center">
                        <img v-bind:src="`${domain}${photoURL}`" alt="image" height="500" width="650">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="$emit('confirmation-return', 0)">{{$t('string.msg.term.btn.cancel')}}</button>
                    </div>
            </div>
        </div>
    </div>
    </div>
</template>
<script>    
import Endpoints from '../../components/common/Endpoints';
    export default {
        props: ["photoURL"],
        data() {
            return {
                errors: [],
                titleToast: null,
                messageToast: null,
                messageIdToast: null,
                domain: Endpoints.domain,
            }
        },
        created(){
            const el = document.body;
            el.removeAttribute("class");
            $('.modal').modal('hide');
        },
        mounted(){

        }
    }
</script>

