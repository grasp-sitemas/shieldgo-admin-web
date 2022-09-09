<template>
    <div class="theme-panel" v-bind:class="{ active: expand }">
        <a href="javascript:;" v-on:click="toggleThemePanel" class="theme-collapse-btn"><i class="fa fa-cog"></i></a>
        <div class="theme-panel-content" data-scrollbar="true" data-height="100%">
            <h5>App Settings</h5>

            <!-- BEGIN theme-list -->
            <div class="theme-list">
                <div class="theme-list-item" v-bind:class="{ active: theme === appOptions.appTheme }" v-for="theme in themes" v-bind:key="theme">
                    <a href="javascript:;" v-bind:class="'theme-list-link bg-' + theme" v-on:click="toggleTheme(theme)">&nbsp;</a>
                </div>
            </div>
            <!-- END theme-list -->

            <div class="theme-panel-divider"></div>

            <div class="row mt-10px">
                <div class="col-8 control-label text-dark fw-bold">
                    <div>Dark Mode <span class="badge bg-primary ms-1 py-2px position-relative" style="top: -1px">NEW</span></div>
                    <div class="lh-14">
                        <small class="text-dark opacity-50"> Adjust the appearance to reduce glare and give your eyes a break. </small>
                    </div>
                </div>
                <div class="col-4 d-flex">
                    <div class="form-check form-switch ms-auto mb-0">
                        <input type="checkbox" class="form-check-input" name="app-theme-dark-mode" id="appThemeDarkMode" v-on:change="toggleDarkMode" value="1" />
                        <label class="form-check-label" for="appThemeDarkMode">&nbsp;</label>
                    </div>
                </div>
            </div>

            <div class="theme-panel-divider"></div>

            <!-- BEGIN theme-switch -->
            <div class="row mt-10px align-items-center">
                <div class="col-8 control-label text-dark fw-bold">Header Fixed</div>
                <div class="col-4 d-flex">
                    <div class="form-check form-switch ms-auto mb-0">
                        <input type="checkbox" class="form-check-input" name="app-header-fixed" id="appHeaderFixed" value="1" v-on:change="toggleHeaderFixed" v-model="appOptions.appHeaderFixed" />
                        <label class="form-check-label" for="appHeaderFixed">&nbsp;</label>
                    </div>
                </div>
            </div>
            <div class="row mt-10px align-items-center">
                <div class="col-8 control-label text-dark fw-bold">Header Inverse</div>
                <div class="col-4 d-flex">
                    <div class="form-check form-switch ms-auto mb-0">
                        <input type="checkbox" class="form-check-input" name="app-header-inverse" id="appHeaderInverse" value="1" v-on:change="toggleHeaderInverse" v-model="appOptions.appHeaderInverse" />
                        <label class="form-check-label" for="appHeaderInverse">&nbsp;</label>
                    </div>
                </div>
            </div>
            <div class="row mt-10px align-items-center">
                <div class="col-8 control-label text-dark fw-bold">Sidebar Fixed</div>
                <div class="col-4 d-flex">
                    <div class="form-check form-switch ms-auto mb-0">
                        <input type="checkbox" class="form-check-input" name="app-sidebar-fixed" id="appSidebarFixed" value="1" v-on:change="toggleSidebarFixed" v-model="appOptions.appSidebarFixed" />
                        <label class="form-check-label" for="appSidebarFixed">&nbsp;</label>
                    </div>
                </div>
            </div>
            <div class="row mt-10px align-items-center">
                <div class="col-8 control-label text-dark fw-bold">Sidebar Grid</div>
                <div class="col-4 d-flex">
                    <div class="form-check form-switch ms-auto mb-0">
                        <input type="checkbox" class="form-check-input" name="app-sidebar-grid" id="appSidebarGrid" value="1" v-on:change="toggleSidebarGrid" v-model="appOptions.appSidebarGrid" />
                        <label class="form-check-label" for="appSidebarGrid">&nbsp;</label>
                    </div>
                </div>
            </div>
            <div class="row mt-10px align-items-center">
                <div class="col-md-8 control-label text-dark fw-bold">Gradient Enabled</div>
                <div class="col-md-4 d-flex">
                    <div class="form-check form-switch ms-auto mb-0">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            name="app-gradient-enabled"
                            id="appGradientEnabled"
                            value="1"
                            v-on:change="toggleGradientEnabled"
                            v-model="appOptions.appGradientEnabled"
                        />
                        <label class="form-check-label" for="appGradientEnabled">&nbsp;</label>
                    </div>
                </div>
            </div>
            <!-- END theme-switch -->

            <div class="theme-panel-divider"></div>

            <a href="https://seantheme.com/color-admin/documentation/" class="btn btn-dark d-block w-100 rounded-pill mb-10px" target="_blank"><b>Documentation</b></a>
            <a href="javascript:;" class="btn btn-default d-block w-100 rounded-pill" data-toggle="reset-local-storage"><b>Reset Local Storage</b></a>
        </div>
    </div>
</template>

<script>
import AppOptions from '../../config/AppOptions.vue'

export default {
    name: 'ThemePanel',
    data() {
        return {
            appOptions: AppOptions,
            expand: false,
            themes: ['red', 'pink', 'orange', 'yellow', 'lime', 'green', 'teal', 'cyan', 'blue', 'purple', 'indigo', 'dark'],
        }
    },
    methods: {
        toggleThemePanel: function () {
            this.expand = !this.expand
        },
        toggleTheme: function (theme) {
            this.appOptions.appTheme = theme
            this.$emit('change-theme')
        },
        toggleDarkMode: function (e) {
            this.appOptions.appDarkMode = e.target.checked
            this.$emit('change-theme')
        },
        toggleHeaderFixed: function (e) {
            if (this.appOptions.appSidebarFixed && !e.target.checked) {
                alert('Default Header with Fixed Sidebar option is not supported. Proceed with Default Header with Default Sidebar.')
                this.appOptions.appSidebarFixed = e.target.checked
            }
            this.appOptions.appHeaderFixed = e.target.checked
        },
        toggleHeaderInverse: function (e) {
            this.appOptions.appHeaderInverse = e.target.checked
        },
        toggleSidebarFixed: function (e) {
            if (!this.appOptions.appHeaderFixed && e.target.checked) {
                alert('Default Header with Fixed Sidebar option is not supported. Proceed with Fixed Header with Fixed Sidebar.')
                this.appOptions.appHeaderFixed = e.target.checked
            }
            this.appOptions.appSidebarFixed = e.target.checked
        },
        toggleSidebarGrid: function (e) {
            this.appOptions.appSidebarGrid = e.target.checked
        },
        toggleGradientEnabled: function (e) {
            this.appOptions.appGradientEnabled = e.target.checked
        },
    },
}
</script>
