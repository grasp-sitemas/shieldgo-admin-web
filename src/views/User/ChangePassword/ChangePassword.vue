<template>
    <div id="wrapper" :key="valuekey">
          <div class="content-page">
              <div class="content">
                  <div class="container-fluid">
                      <!-- Form row -->
                      <div class="row">
                        <div class="col-12">
                            <div class="page-title-box">
                                <h4 class="page-title">{{$t('string.msg.user.change.email.label.password.title')}}</h4>
                            </div>
                        </div>
                       </div>
                      <div class="row">
                          <div class="col-md-12">
                              <div class="card-box">
                                  <p class="sub-header">
                                      {{$t('string.msg.user.change.email.label.password.description')}}
                                  </p>
                                      <div class="form-row" >
                                          <div class="form-group col-md-6">
                                              <label for="inputAddress" class="col-form-label">
                                                  {{$t('string.msg.user.change.password.label.password')}}
                                              </label>
                                              <input type="password" v-model="data.password" class="form-control">
                                          </div>
                                      </div>
                                      <div class="form-row" >
                                          <div class="form-group col-md-6">
                                              <label for="inputAddress" class="col-form-label">
                                                  {{$t('string.msg.user.change.password.label.npassword')}}
                                              </label>
                                              <input type="password" v-model="newPassword" class="form-control" :placeholder="$t('string.msg.user.change.password.placeholder.npassword')">
                                          </div>
                                          <div class="form-group col-md-6">
                                              <label for="inputAddress" class="col-form-label">
                                                  {{$t('string.msg.user.change.password.label.cnpassword')}}
                                              </label>
                                              <input type="password" v-model="cfNewPassword" class="form-control" :placeholder="$t('string.msg.user.change.password.placeholder.cnpassword')">
                                          </div>
                                      </div>
                                      <br/>
                                      <div v-if="errors.length" class="alert alert-danger">
                                            <p class="lead">{{$t('response.msg.error.empty.fields')}}</p>
                                            <ul>
                                                <li v-bind:key="error" v-for="error in errors">{{ error }}</li>
                                            </ul>
                                      </div>
                                      <br/>
                                      <div class="form-row text-center">
                                        <div class="form-group col-md-12">
                                            <button @click="checkForm" class="btn btn-primaryGreen w-50">{{$t('string.msg.form.btn.save')}}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                  </div>
              </div>
          </div>
          <Spinner />
          <Toast :title="titleToast" :message="messageToast" :messageId="messageIdToast" />
      </div>
</template>

<script>
import Controller from './CrtChangePassword';
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
        titleToast: null,
        messageToast: null,
        messageIdToast: null,
        newPassword: null,
        cfNewPassword: null,
        currentPassword:null,
        data: {
            email: null,
            password: null,
         
        },
        user: null
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
