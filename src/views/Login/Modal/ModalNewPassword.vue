<template>
    <div class="modal fade" id="modalReset" tabindex="-1" role="dialog" aria-labelledby="modalReset" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content card card-radius">
            <div class="backgroundColorRed card-radius-top topBorderCard"></div>
                <div class="modal-header">
                    <h5 class="modal-title text-uppercase">{{$t('string.msg.user.change.email.label.password.title')}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    
                    <form id="form-esqueci-senha">
                    <div class="form-group">
                        <label>{{$t("string.msg.change.password.label.password")}}<span class="color-red">*</span></label>
                        <input type="password" v-model="data.password" class="form-control form-control-lg has-border" :placeholder="$t('string.msg.change.password.placeholder.password')" />
                        
                        <br/><br/>
                        <label>{{$t("string.msg.change.password.label.cfpassword")}}<span class="color-red">*</span></label>
                        <input type="password" v-model="data.passwordConfirm" class="form-control form-control-lg has-border" :placeholder="$t('string.msg.change.password.placeholder.cfpassword')" />
                        <br/>
                        <div v-if="errors.length" class=" alert-danger">
                            <ul>
                                <li v-bind:key="error" v-for="error in errors">{{ error }}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="form-group text-center mt-4">
                        <div class="d-flex bd-highlight mb-3">
                            <button @click="$emit('reset-pass')" class="btn btn-primaryGreen w-20" type="button"> {{$t('string.btn.send')}} </button>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
</template>
<script>
export default {
    props: ["data", "errors"]
}
</script>

