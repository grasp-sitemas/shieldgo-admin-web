<template>
    <div id="wrapper" :key="valuekey">
          <div class="content-page">
              <div class="content">
                  <div class="container-fluid">
                      <!-- Form row -->
                      <div class="row">
                        <div class="col-12">
                            <div class="page-title-box">
                                <h4 class="page-title">{{$t('string.msg.user.change.email.label.email.title')}}</h4>

                            </div>
                        </div>
                       </div>
                      <div class="row">
                          <div class="col-md-12">
                              <div class="card-box">
                                  <p class="sub-header">
                                      {{$t('string.msg.user.change.email.label.email.description')}}
                                  </p>
                                      <div class="form-row" >
                                          <div class="form-group col-md-6">
                                              <label for="inputAddress" class="col-form-label">
                                                  {{$t('string.msg.user.change.email.label.email')}}
                                              </label>
                                              <input type="text" v-model="data.email" class="form-control" readonly=“true” >
                                          </div>
                                          <div class="form-group col-md-6">
                                              <label for="inputAddress" class="col-form-label">
                                                  {{$t('string.msg.user.change.email.label.nemail')}}
                                              </label>
                                              <input type="text" v-model="newEmail" class="form-control" :placeholder="$t('string.msg.user.change.email.placeholder.nemail')">
                                          </div>
                                      </div>
                                      <div class="text-right justify-content-between bd-highlight mb-3">
                                        <button v-on:click="checkForm" class="btn btn-primaryGreen w-20">{{$t('string.msg.form.btn.save')}}</button>
                                      </div>
                                      <br/>
                                      <div v-if="errors.length" class="alert alert-danger">
                                            <p class="lead">{{$t('response.msg.error.empty.fields')}}</p>
                                            <ul>
                                                <li v-bind:key="error" v-for="error in errors">{{ error }}</li>
                                            </ul>
                                      </div>
                                </div>
                            </div>
                        </div>
                  </div>
              </div>
          </div>
          <Spinner />
          <Toast :title="titleToast" :message="messageToast" :messageId="messageIdToast" />
          <Confirmation :title="titleToast" :message="messageToast" :cancelText="cancelText" :yesText="yesText" v-on:confirmation-return="save"/>
      </div>
</template>

<script>
import Controller from './CrtChangeEmail';
import Spinner from '../../../components/layout/Spinner';
import Toast from '../../../components/layout/Toast';

export default {
  name: 'ChangeEmail',
  components: {
    Spinner,
    Toast,
  },
  data() {
      return {
        errors: [],
        valuekey: 0,
        addresses: [],
        titleToast: null,
        messageToast: null,
        messageIdToast: null,
        newEmail: null,
        systemUser:[],
        data: {
            status: "ACTIVE",
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            type: "USER-COMPANY",
            companyUser:{
               subtype: "ADMIN"
            }
               
            }
        }
    },
    methods: Controller.methods,
    created() {
     Controller.init(this);
    },
    mounted(){
  }
}
</script>


<style>
</style>
