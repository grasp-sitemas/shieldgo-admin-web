<template>
    <div class="left-side-menu transparent-scroll-view">
        <div class="slimscroll-menu">
            <div id="sidebar-menu" style="height: 680px; overflow: auto; position: relative; display: block">
                <ul class="metismenu" id="side-menu">
                    <li>
                        <router-link to="/dashboard" class="cursor-pointer">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>{{ $t('string.msg.menu.dashboard.label.title') }}</span>
                        </router-link>
                    </li>

                    <li>
                        <router-link to="/schedule" class="cursor-pointer">
                            <i class="fas fa-solid fa-calendar"></i>
                            <span>{{ $t('string.msg.menu.schedules.label.title') }}</span>
                        </router-link>
                    </li>

                    <li>
                        <router-link to="/client" class="cursor-pointer">
                            <i class="fas fa-solid fa-users"></i>
                            <span>{{ $t('string.msg.menu.clients.label.title') }}</span>
                        </router-link>
                    </li>

                    <li class="item-with-submenus product">
                        <a href="javascript: void(0);">
                            <i class="fas fa-solid fa-building"></i>
                            <span>{{ $t('string.msg.menu.company.label.title') }}</span>
                            <span class="menu-arrow"></span>
                        </a>
                        <!-- <ul class="nav-second-level mm-collapse">
                            <li>
                                <router-link to="company-info" class="cursor-pointer">
                                    <i class="dripicons-dot"></i>
                                    <span>{{ $t('string.msg.menu.company.info.title') }}</span>
                                </router-link>
                            </li>

                            <li>
                                <router-link to="/list-company" class="cursor-pointer">
                                    <i class="dripicons-dot"></i>
                                    <span>{{ $t('string.msg.menu.accounts.label.title') }}</span>
                                </router-link>
                            </li>

                            <li>
                                <router-link to="/list-users" class="cursor-pointer">
                                    <i class="dripicons-dot"></i>
                                    <span>{{ $t('string.msg.menu.users.label.title') }}</span>
                                </router-link>
                            </li>

                            <li>
                                <router-link to="/vigilants" class="cursor-pointer">
                                    <i class="dripicons-dot"></i>
                                    <span>{{ $t('string.msg.menu.vigilants.label.title') }}</span>
                                </router-link>
                            </li>

                            <li>
                                <router-link to="/patrol-points" class="cursor-pointer">
                                    <i class="dripicons-dot"></i>
                                    <span>{{ $t('string.msg.menu.patrol.points.label.title') }}</span>
                                </router-link>
                            </li>

                            <li>
                                <router-link to="/incidents" class="cursor-pointer">
                                    <i class="dripicons-dot"></i>
                                    <span>{{ $t('string.msg.menu.incidents.label.title') }}</span>
                                </router-link>
                            </li>

                            <li>
                                <router-link to="/panic-alerts" class="cursor-pointer">
                                    <i class="dripicons-dot"></i>
                                    <span>{{ $t('string.msg.menu.panic.alerts.label.title') }}</span>
                                </router-link>
                            </li>
                        </ul> -->
                    </li>

                    <li>
                        <router-link to="/reports" class="cursor-pointer">
                            <i class="fas fa-solid fa-file"></i>
                            <span>{{ $t('string.msg.menu.reports.label.title') }}</span>
                        </router-link>
                    </li>

                    <li>
                        <router-link to="/logs" class="cursor-pointer">
                            <i class="fas fa-solid fa-file-contract"></i>
                            <span>{{ $t('string.msg.menu.logs.label.title') }}</span>
                        </router-link>
                    </li>
                    <i class="fa-solid fa-file-lines"></i>
                    <!-- <li>
                        <router-link to="/list-user" class="cursor-pointer">
                            <i class="fas fa-user-alt"></i>
                            <span style="margin-left: 10px">{{ $t('string.msg.menu.users.label.title') }}</span>
                        </router-link>
                    </li>

                    <li>
                        <router-link to="/list-company" class="cursor-pointer">
                            <i class="fas fa-building"></i>
                            <span style="margin-left: 10px">{{ $t('string.msg.menu.companies.label.title') }}</span>
                        </router-link>
                    </li> -->

                    <li>
                        <router-link to="/maps" class="cursor-pointer">
                            <i class="fas fa-globe-americas"></i>
                            <span>{{ $t('str.msg.map.label') }}</span>
                        </router-link>
                    </li>

                    <li class="cursor-pointer">
                        <!-- <router-link to="/change-password" class="cursor-pointer"> -->
                        <i class="fas fa-key"></i>
                        <span>{{ $t('str.msg.change.password.label') }}</span>
                        <!-- </router-link> -->
                    </li>

                    <br /><br />
                    <li>
                        <router-link to="/logout" class="cursor-pointer">
                            <i class="dripicons-power cursor-pointer"></i>
                            <span>{{ $t('string.msg.menu.dashboard.label.exit') }}</span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import Controller from './CrtLeftSideBar'

export default {
    name: 'LeftSideBar',
    components: {},
    data() {
        return {
            errors: [],
            titleToast: null,
            messageToast: null,
            messageIdToast: null,
            user: {
                serviceTypes: [],
            },
        }
    },
    methods: Controller.methods,
    created() {
        Controller.init(this)
    },
    mounted() {
        $('.item-with-submenus > a').click(function () {
            $(this).parent().toggleClass('mm-active')
            $(this).parent().children('ul.nav-second-level.mm-collapse').toggleClass('mm-show')
        })
    },
}
</script>

<style scoped></style>
