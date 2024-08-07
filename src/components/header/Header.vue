<template>
    <div :key="valuekey">
        <div id="header" class="app-header" v-bind:class="{ 'app-header-inverse': appOptions.appHeaderInverse }">
            <div class="navbar-header">
                <button type="button" class="navbar-mobile-toggler" v-on:click="toggleSidebarEndMobile" v-if="appOptions.appSidebarTwo">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <div class="navbar-brand">
                    <img v-if="darkMode" src="../../assets/images/logo.png" alt="ShieldGo" width="90" />
                    <img v-else src="../../assets/images/logo.png" alt="ShieldGo" width="90" />
                </div>

                <button type="button" class="navbar-mobile-toggler" v-on:click="toggleTopMenuMobile" v-if="appOptions.appTopMenu && appOptions.appSidebarNone">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <button type="button" class="navbar-mobile-toggler" v-on:click="toggleSidebarMobile" v-if="!appOptions.appSidebarNone">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
            </div>
            <div class="navbar-nav">
                <header-mega-menu v-if="appOptions.appHeaderMegaMenu"></header-mega-menu>

                <b-nav-item-dropdown class="navbar-item" menu-class="dropdown-menu media-list" right toggle-class="navbar-link dropdown-toggle icon" no-caret>
                    <template slot="button-content">
                        <i @click="handleEnableSound" class="fa fa-volume-up p-3" v-if="soundEnabled"></i>
                        <i @click="handleEnableSound" class="fa fa-volume-mute p-3" v-else></i>
                    </template>
                </b-nav-item-dropdown>
                <b-nav-item-dropdown class="navbar-item" toggle-class="navbar-link dropdown-toggle" no-caret v-if="appOptions.appHeaderLanguageBar">
                    <template slot="button-content">
                        <span v-if="this.$i18n.locale === 'pt'">
                            <span class="flag-icon flag-icon-br me-1" title="br"></span>
                            <span class="name d-none d-sm-inline me-1">{{ $t('str.language.br') }}</span>
                        </span>
                        <span v-else-if="this.$i18n.locale === 'en'">
                            <span class="flag-icon flag-icon-us me-1" title="usa"></span>
                            <span class="name d-none d-sm-inline me-1">{{ $t('str.language.usa') }}</span>
                        </span>
                        <b class="caret"></b>
                    </template>
                    <b-dropdown-item @click="changeLanguage('pt')"
                        ><span class="flag-icon flag-icon-br"></span> {{ isCurrentLanguage ? $t('str.language.portuguese.br') : $t('str.language.portuguese') }}</b-dropdown-item
                    >
                    <b-dropdown-item @click="changeLanguage('en')"
                        ><span class="flag-icon flag-icon-us"></span> {{ isCurrentLanguage ? $t('str.language.english.en') : $t('str.language.english') }}</b-dropdown-item
                    >
                </b-nav-item-dropdown>
                <b-nav-item-dropdown right menu-class="me-1" class="navbar-item navbar-user dropdown" toggle-class="navbar-link dropdown-toggle d-flex align-items-center" no-caret>
                    <template slot="button-content">
                        <div class="image image-icon bg-gray-800 text-gray-600">
                            <img v-if="this.user?.photoURL && this.user.photoURL !== 'https://'" crossorigin="anonymous" v-bind:src="`${domain}${this.user?.photoURL}`" alt="" />
                            <i v-else class="fa fa-user"></i>
                        </div>
                        <span class="d-none d-md-inline">{{ `${this.user?.firstName} ${this.user?.lastName}` }}</span>
                        <b class="caret"></b>
                    </template>
                    <a href="#/profile" class="dropdown-item">{{ $t('str.header.menu.edit.profile') }}</a>
                    <a href="#/change-password" class="dropdown-item">{{ $t('str.header.menu.change.password') }}</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" v-on:click="logout">{{ $t('str.header.menu.signout') }} </a>
                </b-nav-item-dropdown>
                <div class="navbar-divider d-none d-md-block" v-if="appOptions.appSidebarTwo"></div>
                <div class="navbar-item d-none d-md-block" v-if="appOptions.appSidebarTwo">
                    <a href="javascript:;" v-on:click="toggleSidebarEnd" class="navbar-link icon">
                        <i class="fa fa-th"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AppOptions from '../../config/AppOptions.vue'
import Controller from './CrtHeader.vue'
import HeaderMegaMenu from './HeaderMegaMenu.vue'
import Common from '../../common/Common.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    name: 'Header',
    components: {
        HeaderMegaMenu,
    },
    data() {
        return {
            appOptions: AppOptions,
            user: null,
            valuekey: 0,
            domain: null,
            soundEnabled: true,
            darkMode: false,
        }
    },
    methods: Controller.methods,
    created() {
        const state = this

        state.$registerEvent.$on('updateHeader', function () {
            state.refreshUser(state)
        })

        state.$registerEvent.$on('setDarkMode', function (value) {
            state.darkMode = value
        })

        state.$registerEvent.$on('soundAlert', function () {
            Common.show(state, 'top-right', 'error', state.$t('msg.new.sos.notification'))

            if (!state.soundEnabled) return

            setTimeout(() => {
                var audio = new Audio(require('../../assets/sound/alarm.mp3'))
                audio.play().catch(error => {
                    console.error('Audio play failed:', error)
                })
            }, 1000)
        })
    },
    mounted() {
        Controller.init(this)
    },
}
</script>
