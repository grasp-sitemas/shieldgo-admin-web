<template>
    <div id="wrapper" :key="valuekey">
        <div class="content-page">
            <div class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div class="page-title-box">
                                <h4 class="page-title">{{ $t('string.msg.menu.dashboard.label.title') }}</h4>
                            </div>
                        </div>
                    </div>

                    <div class="card-deck">
                        <div class="form-group col-md-6">
                            <router-link to="#" class="cursor-pointer">
                                <div class="card card-1 dark-card">
                                    <div class="card-body text-center">
                                        <!-- <h5>{{ $t('str.msg.users.label') }}</h5> -->
                                    </div>
                                </div>
                            </router-link>
                        </div>

                        <div class="form-group col-md-6">
                            <router-link to="#" class="cursor-pointer">
                                <div class="card card-1">
                                    <div class="card-body text-center">
                                        <!-- <h5>{{ $t('str.msg.users.label') }}</h5> -->
                                    </div>
                                </div>
                            </router-link>
                        </div>

                        <div class="form-group col-md-6">
                            <router-link to="#" class="cursor-pointer">
                                <div class="card card-1 dark-card">
                                    <div class="card-body text-center">
                                        <!-- <h5>{{ $t('str.msg.users.label') }}</h5> -->
                                    </div>
                                </div>
                            </router-link>
                        </div>

                        <div class="form-group col-md-6">
                            <router-link to="#" class="cursor-pointer">
                                <div class="card card-1">
                                    <div class="card-body text-center">
                                        <!-- <h5>{{ $t('str.msg.users.label') }}</h5> -->
                                    </div>
                                </div>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <Spinner />
            <Toast :title="titleToast" :message="messageToast" :messageId="messageIdToast" />
        </div>
    </div>
</template>

<script>
import Controller from './CrtDashboard'
import Spinner from '../../components/layout/Spinner'
import Toast from '../../components/layout/Toast'
import Collect from './Charts/Collect/Collect.vue'
import Hub from './Charts/Hub/Hub.vue'
import User from './Charts/User/User.vue'
import Deposit from './Charts/Deposit/Deposit.vue'
import Point from './Charts/Point/Point.vue'

export default {
    name: 'Dashboard',
    components: {
        Spinner,
        Toast,
        Collect,
        Hub,
        User,
        Deposit,
        Point,
    },
    data() {
        return {
            errors: [],
            titleToast: null,
            messageToast: null,
            messageIdToast: null,
            data: {},
            user: {},
        }
    },
    methods: Controller.methods,
    created() {},
    mounted() {
        Controller.init(this)
    },
}
</script>

    <style>
</style>
