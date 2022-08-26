<template>
    <div id="wrapper" :key="valuekey">
          <div class="content-page">
              <div class="content">
                  <div class="container-fluid">
                      <!-- Form row -->
                      <div class="row">
                        <div class="col-12">
                            <div class="page-title-box">
                                <h4 class="page-title">{{$t('string.msg.list.user.label.title')}}</h4>

                            </div>
                        </div>
                       </div>
                      <div class="row">
                          <div class="col-md-12">
                              <div class="card-box">
                                
                                <div class="form-row" >
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress" class="col-form-label">
                                            {{$t('string.msg.menu.crud.user.label.access.email')}}
                                        </label>
                                        <input type="text" v-model="data.email" class="form-control" readonly=“true”>
                                    </div>
                                </div>

                                <div>
                                    <button v-if="!formCrud" @click="addUser" class="btn btn-warning w-20 text-dark-gray">{{$t('string.msg.form.btn.add.new.user')}}</button>
                                    <br><br> 
                                    <div v-show="formCrud== 'show'" class="form=row">
                                        <div class="form-row" >
                                            <div class="form-group col-md-6">
                                                <label for="inputAddress" class="col-form-label">
                                                     <code v-if="!newData._id" class="highlighter-rouge">*</code>
                                                    {{$t('string.msg.form.crud.user.label.name')}}
                                                </label>
                                                <input type="text" v-model="newData.firstName" :placeholder="$t('string.msg.form.crud.user.placeholder.name')" class="form-control">
                                            </div>
                                            <div class="form-group col-md-6">
                                                <label for="inputAddress" class="col-form-label">
                                                     <code v-if="!newData._id" class="highlighter-rouge">*</code>
                                                    {{$t('string.msg.form.crud.user.label.lastname')}}
                                                </label>
                                                <input type="text" v-model="newData.lastName" :placeholder="$t('string.msg.form.crud.user.placeholder.lastname')" class="form-control">
                                            </div>
                                        </div>
                                        <div class="form-row" >
                                            <div class="form-group col-md-6">
                                                <label for="inputAddress" class="col-form-label">
                                                    {{$t('string.msg.form.crud.user.label.email')}}
                                                </label>
                                                <input type="text" v-model="newData.email" :placeholder="$t('string.msg.form.crud.user.placeholder.email')" class="form-control">
                                            </div>
                                            <div class="form-group col-md-6">
                                                <label for="inputAddress" class="col-form-label">
                                                     <code v-if="!newData._id" class="highlighter-rouge">*</code>
                                                    {{$t('string.msg.form.crud.user.label.password')}}
                                                </label>
                                                <input type="password" v-model="newData.password" :placeholder="$t('string.msg.form.crud.user.placeholder.password')" class="form-control">
                                            </div>
                                        </div> 
                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="inputAddress" class="col-form-label">
                                                    <code class="highlighter-rouge">*</code>
                                                    {{$t('string.msg.table.list.user.label.access.level')}}
                                                </label>
                                                <select id="companyType" v-model="newData.companyUser.subtype" class="form-control">
                                                    <option :value="null" selected>{{$t('string.msg.select.selector.item')}}</option>
                                                    <option value="ADMIN" selected>{{$t('string.msg.user.type.admin')}}</option>
                                                    <option value="SIMPLE">{{$t('string.msg.user.type.simple')}}</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="form-row">
                                            <div class="form-group col-md-12">
                                                <label for="inputAddress" class="col-form-label">
                                                    <code class="highlighter-rouge">*</code>
                                                    {{$t('string.msg.user.platforms.with.access.label')}}
                                                </label>
                                                <div class="d-flex flex-wrap">
                                                    <div class="container-switch" v-bind:key="item.id" v-for="item in services">
                                                        <label class="switch">
                                                            <input 
                                                                v-model="newData.companyUser.userPlatforms" 
                                                                type="checkbox"
                                                                :id="item._id" 
                                                                :value="item._id"
                                                                :true-value="item._id"
                                                                :false-value="null"
                                                                >
                                                            <span class="slider round"></span>
                                                        </label>
                                                        <span class="label-swith">{{camelize(item.name)}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="d-flex justify-content-between bd-highlight">
                                            <button @click="cancelAdd" class="btn btn-secondary w-20">{{$t('string.msg.btn.cancel.add.user')}}</button>
                                            <button @click="checkForm" class="btn btn-primaryGreen w-20">{{$t('string.msg.form.btn.save')}}</button>
                                        </div>
                                    </div>
                                    <br>
                                    <div class="table-responsive" v-if="users && users.length > 0">
                                        <p class="sub-header">
                                            {{$t('string.msg.list.company.user.label.description')}}
                                        </p>
                                        <table class="table table-centered table-hover mb-0"> 
                                            <thead class="thead-dark">
                                                <tr>
                                                    <th scope="col">{{$t('string.msg.menu.crud.user.table.label.name')}}</th>
                                                    <th scope="col">{{$t('string.msg.menu.crud.user.table.label.email')}}</th>
                                                    <th scope="col">{{$t('string.msg.user.user.level.label')}}</th>
                                                    <th scope="col">{{$t('string.msg.user.table.label.platforms')}}</th>
                                                </tr>
                                            </thead>
                                                <tbody v-bind:key="item._id" v-for="item in users" class="cursor-pointer">
                                                    <tr v-if="item.status == 'ACTIVE'" @click="selectItem(item)">
                                                        <td>
                                                            <span v-if="item.firstName && item.lastName">
                                                                {{toUpperCase(item.firstName) + ' ' + toUpperCase(item.lastName) }}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span v-if="item.email">
                                                                {{item.email}}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span v-if="item.companyUser && item.companyUser.subtype">
                                                                {{camelize($t(item.companyUser.subtype))}}
                                                            </span>
                                                        </td>
                                                        <td >
                                                            <span v-if="item.companyUser && item.companyUser.userPlatforms && item.companyUser.userPlatforms.length > 0">
                                                                <span  v-bind:key="platform" v-for="platform in item.companyUser.userPlatforms">   
                                                                    <label v-if="platform.name" >{{camelize($t(platform.name))}}</label><br/> 
                                                                </span>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                    </div>
                                </div>

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
import Controller from './CrtUser';
import Spinner from '../../../components/layout/Spinner';
import Toast from '../../../components/layout/Toast';

export default {
    name: 'User',
    props: ["valuekey"],
    watch:{
        'valuekey'(){
        }
    },
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
        formCrud: null,
        items: null,
        users:[],
        services:[],
        newData: {
            status: "ACTIVE",
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            isAcceptGeneralTerms: true,
            type: "USER-COMPANY",
            companyUser:{
                company: null,
                status: "ACTIVE",
                photoURL: "https://",
                userPlatforms:[],
                subtype: null
            }
        },
        data: {
            status: "ACTIVE",
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            isAcceptGeneralTerms: true,
            type: "USER-COMPANY",
            companyUser:{
                company: null,
                status: "ACTIVE",
                photoURL: "https://",
                userPlatforms:[],
                subtype: null
            }
        },
        filters: {
            name: "",
            company: null,
            status: "ACTIVE"
        },
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
