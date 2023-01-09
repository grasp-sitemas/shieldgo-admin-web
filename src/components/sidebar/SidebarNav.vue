<template>
    <!-- begin sidebar nav -->
    <div class="menu" v-if="menus">
        <div class="menu-search mb-n3" v-if="appOptions.appSidebarSearch">
            <input type="text" v-on:keyup="handleSidebarFilter" class="form-control" placeholder="Sidebar menu filter..." />
        </div>
        <div class="menu-header">{{ $t('str.sidebar.menu.navigation.title') }}</div>
        <template v-for="menu in menus">
            <sidebar-nav-list
                ref="sidebarNavList"
                v-bind:menu="menu"
                v-bind:scrollTop="scrollTop"
                v-bind:key="menu.path"
                v-bind:status="menu.status"
                v-on:collapse-other="handleCollapseOther(menu)"
                v-on:show-float-submenu="handleShowFloatSubmenu"
                v-on:hide-float-submenu="handleHideFloatSubmenu"
            ></sidebar-nav-list>
        </template>

        <!-- BEGIN minify-button -->
        <div class="menu-item d-flex">
            <a href="javascript:;" class="app-sidebar-minify-btn ms-auto" v-on:click="handleSidebarMinify()"><i class="fa fa-angle-double-left"></i></a>
        </div>
        <!-- END minify-button -->
    </div>
    <!-- end sidebar nav -->
</template>

<script>
import SidebarMenu from './SidebarMenu.vue'
import SidebarNavList from './SidebarNavList.vue'
import AppOptions from '../../config/AppOptions.vue'
import Controller from './CrtSidebar.vue'

export default {
    name: 'SidebarNav',
    props: ['scrollTop'],
    components: {
        SidebarNavList,
    },
    data() {
        return {
            menus: SidebarMenu,
            appOptions: AppOptions,
            user: null,
        }
    },
    beforeCreate() {},
    created() {
        Controller.init(this)
        Controller.methods.applyMenuRole(this)
    },
    methods: Controller.methods,
}
</script>
