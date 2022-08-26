<template>
    <div class="modal fade" id="modalListAddress" tabindex="-1" role="dialog" aria-labelledby="modalListAddress" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-uppercase">{{$t('string.company.register.modal.address.title')}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <img src="assets/img/icon-close-black.png">
                    </button>
                </div>
                <div class="list-group">
                    <a v-bind:key="item.id" v-for="(item, index) in addresses" @click="$emit('select-address', index)" class="list-group-item list-group-item-action cursor-pointer">
                        <span>{{item.formatted}}</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["addresses"]
    }
</script>

