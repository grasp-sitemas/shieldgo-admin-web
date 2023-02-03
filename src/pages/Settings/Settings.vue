<template>
    <div v-if="!isLoading">
        <ol class="breadcrumb float-xl-end">
            <li class="breadcrumb-item">
                <a href="#/settings">{{ $t('str.breadcrumb.settings') }}</a>
            </li>
        </ol>

        <h1 class="page-header">
            {{ $t('str.form.title.settings') }}
        </h1>

        <panel :title="$t('str.page.settigs')">
            <form>
                <fieldset>
                    <div class="row mt-10px">
                        <div class="col-8 control-label fw-bold">
                            <label class="form-label">{{ $t('str.dark.mode') }}</label>
                            <div class="lh-14">
                                <small class="text-dark opacity-50">{{ $t('str.dark.mode.description') }}</small>
                            </div>
                        </div>
                        <div class="col-4 d-flex">
                            <div class="form-check form-switch ms-auto mb-0">
                                <input type="checkbox" class="form-check-input" name="app-theme-dark-mode" id="appThemeDarkMode" v-on:change="handleSetDarkMode" v-model="darkMode" />
                                <label class="form-check-label" for="appThemeDarkMode">&nbsp;</label>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </form>
        </panel>
    </div>
    <div v-else class="center-spinner">
        <i class="fas fa-spinner fa-spin" />
    </div>
</template>

<script>
import Controller from './CrtSettings.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    name: 'Settings',
    data() {
        return {
            isLoading: true,
            errors: [],
            user: null,
            darkMode: false,
        }
    },
    methods: Controller.methods,
    mounted() {
        Controller.init(this)
    },
}
</script>
