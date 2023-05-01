<template>
    <!-- begin navbar-collapse -->
    <div class="collapse d-md-block me-auto" v-bind:class="{ show: appOptions.appHeaderMegaMenuMobileToggled }">
        <div class="navbar-nav">
            <b-nav-item-dropdown class="navbar-item" toggle-class="navbar-link dropdown-toggle d-flex align-items-center">
                <template slot="button-content">
                    <i class="fa fa-file fa-fw me-1"></i>
                    <span class="d-lg-inline d-md-none">{{ $t('header.megaMenu.reports') }}</span>
                    <b class="caret ms-1"></b>
                </template>

                <b-dropdown-item href="?#/reports/patrols/completed">
                    <span>{{ $t('str.sidebar.menu.reports.completed.patrols') }}</span>
                </b-dropdown-item>
                <b-dropdown-item href="?#/reports/patrols/incompleted">
                    <span>{{ $t('str.sidebar.menu.reports.not.completed.patrols') }}</span>
                </b-dropdown-item>
                <b-dropdown-item href="?#/reports/patrols/not-visited">
                    <span>{{ $t('str.sidebar.menu.reports.patrols.not-visited') }}</span>
                </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>

                <b-dropdown-item href="?#/reports/sos-alert">
                    <span>{{ $t('str.sidebar.menu.reports.sos.alert') }}</span>
                </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>

                <b-dropdown-item href="?#/reports/incident">
                    <span>{{ $t('str.sidebar.menu.reports.incidents') }}</span>
                </b-dropdown-item>
            </b-nav-item-dropdown>
        </div>
    </div>
    <!-- end navbar-collapse -->
</template>

<script>
import AppOptions from '../../config/AppOptions.vue'

export default {
    name: 'HeaderMegaMenu',
    data() {
        return {
            appOptions: AppOptions,
        }
    },
}
</script>
