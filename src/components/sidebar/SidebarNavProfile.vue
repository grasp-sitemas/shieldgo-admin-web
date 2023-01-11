<template>
    <div class="menu" :key="valuekey">
        <div class="menu-profile">
            <a href="javascript:;" class="menu-profile-link" v-on:click="expand()">
                <div :style="{ 'background-image': `url(${`${domain}${user?.company?.logoURL || user?.account?.logoURL}`})` }" class="with-shadow menu-profile-cover"></div>
                <div class="menu-profile-image"></div>
                <div class="menu-profile-info">
                    <div class="d-flex align-items-center">
                        <div class="flex-grow-1">{{ getCompanyName() }}</div>
                        <div v-if="role !== 'OPERATOR'" class="menu-caret ms-auto"></div>
                    </div>
                    <small>{{ $t(this?.user?.companyUser?.subtype) }}</small>
                </div>
            </a>
        </div>

        <div id="appSidebarProfileMenu" class="collapse" v-bind:class="{ 'd-block': this.stat == 'expand' && !this.appOptions.pageSidebarMinified, 'd-none': this.stat == 'collapse' }">
            <div class="menu-item pt-5px" v-for="(menu, index) in companyMenus" :key="index">
                <a :href="menu.path" class="menu-link">
                    <div class="menu-icon"><i :class="menu.icon"></i></div>
                    <div class="menu-text">{{ $t(menu.title) }}</div>
                </a>
            </div>

            <!-- <a href="#/settings" class="menu-link">
                    <div class="menu-icon"><i class="fa fa-cog"></i></div>
                    <div class="menu-text">{{ $t('str.sidebar.menu.settings') }}</div>
                </a>
            </div>
            <div class="menu-item">
                <a href="#/register-data" class="menu-link">
                    <div class="menu-icon"><i class="fa fa-pencil-alt"></i></div>
                    <div class="menu-text">{{ $t('str.sidebar.menu.register.data') }}</div>
                </a>
            </div>
            <div class="menu-item">
                <a href="#/actions-log" class="menu-link">
                    <div class="menu-icon"><i class="fa fa-file-contract"></i></div>
                    <div class="menu-text">{{ $t('str.sidebar.menu.actions.log') }}</div>
                </a>
            </div> -->
            <!-- <div class="menu-item pb-5px">
                <a href="javascript:;" class="menu-link">
                    <div class="menu-icon"><i class="fa fa-question-circle"></i></div>
                    <div class="menu-text">Helps</div>
                </a>
            </div> -->
            <div class="menu-divider m-0"></div>
        </div>
    </div>
</template>

<script>
import AppOptions from '../../config/AppOptions.vue'
import Controller from './CrtSidebar.vue'
import { COMPANY_MENU } from '../../utils/menus.js'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    name: 'SidebarNavProfile',
    data() {
        return {
            appOptions: AppOptions,
            domain: null,
            user: null,
            role: null,
            valuekey: 0,
            stat: '',
            companyMenus: [],
            companyMenuOptions: COMPANY_MENU,
        }
    },
    methods: Controller.methods,
    created() {
        const state = this
        state.$registerEvent.$on('updateMenu', function () {
            state.refreshUser(state)
        })
    },
    mounted() {
        Controller.init(this)
        this.applyCompanyMenuRole(this)
    },
}
</script>
