<template>
    <div class="navbar-custom">
        <ul class="list-unstyled topnav-menu float-right mb-0">
            <li class="dropdown notification-list">
                <!-- Mobile menu toggle-->
                <a class="navbar-toggle nav-link">
                    <div class="lines">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </a>
                <!-- End mobile menu toggle-->
            </li>

            <li class="dropdown notification-list show">
                <a class="nav-link dropdown-toggle nav-user mr-0 waves-effect waves-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="true">
                    <!-- <img v-if="user.companyUser && user.companyUser.photoURL != 'https://'" v-bind:src="`${domain}${user.companyUser.photoURL}`" alt="user-image" class="rounded-circle" height="55" width="55" />
                    <i v-else class="far fa-user noti-icon rounded-circle" color="white" alt="user-image" height="55" width="55"></i> -->
                    <span class="pro-user-name ml-1"> {{ user.firstName + user.lastName + ' ' }} <i class="mdi mdi-chevron-down"></i> </span>
                </a>
                <div
                    class="dropdown-menu dropdown-menu-right profile-dropdown"
                    x-placement="bottom-end"
                    style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-38px, 70px, 0px)"
                >
                    <a href="javascript:void(0);" class="dropdown-item notify-item cursor-pointer">
                        <router-link to="/change-password" style="color: gray">
                            <i class="fas fa-key cursor-pointer"></i>
                            <label class="cursor-pointer"> {{ $t('string.msg.menu.change.password.label.title') }}</label>
                        </router-link>
                    </a>

                    <div class="dropdown-divider"></div>

                    <!-- item-->
                    <a href="javascript:void(0);" class="dropdown-item notify-item">
                        <router-link to="/logout" style="color: gray">
                            <i class="dripicons-power cursor-pointer"></i>
                            <span>{{ $t('string.msg.menu.dashboard.label.exit') }}</span>
                        </router-link>
                    </a>
                </div>
            </li>
        </ul>

        <ul class="list-unstyled menu-left mb-0">
            <li class="float-left">
                <a class="logo cursor-pointer">
                    <span class="logo-lg">
                        <img src="assets/img/logo.png" alt="" height="65" />
                    </span>
                    <span class="logo-sm">
                        <img src="assets/img/logo.png" alt="" height="25" />
                    </span>
                </a>
            </li>
            <li class="float-left">
                <a class="button-menu-mobile navbar-toggle">
                    <div class="lines">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import Controller from './CrtHeader'
import Endpoints from '../../common/Endpoints'
export default {
    name: 'Header',
    components: {},
    data() {
        return {
            errors: [],
            titleToast: null,
            messageToast: null,
            messageIdToast: null,
            domain: Endpoints.domain,
            user: {
                firstName: '',
            },
        }
    },
    methods: Controller.methods,
    created() {},
    mounted() {
        Controller.init(this)
        this.loadUserInfos()
    },
}
</script>

<style scoped>
</style>