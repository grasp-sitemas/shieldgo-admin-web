import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import VueTheMask from 'vue-the-mask'//https://vuejs-tips.github.io/vue-the-mask/
import money from 'v-money'
import VueSimpleAlert from "vue-simple-alert"
import BootstrapVue from 'bootstrap-vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import crono from 'vue-crono'
import JwPagination from 'jw-vue-pagination'
import Multiselect from 'vue-multiselect'
import VTooltip from 'v-tooltip'
import OneSignalVue from 'onesignal-vue'

Vue.use(VTooltip)
Vue.use(crono)
Vue.component('jw-pagination', JwPagination)
Vue.component('multiselect', Multiselect)
Vue.use(BootstrapVue)
Vue.use(VueTheMask)
Vue.use(VueSimpleAlert)
Vue.use(money, { precision: 2 })
Vue.use(OneSignalVue)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAK0UC-aEr68h1RX7BT6jvM1dQXZHQMq8g',
    libraries: 'places',
  }
})
Vue.config.productionTip = false
Vue.config.silent = true

new Vue({
  router,
  i18n,
  render: h => h(App),
  beforeMount() {
    this.$OneSignal.init({ appId: '92a6fc17-75ce-4b77-b397-bd33dbcf7c67' });
  }
}).$mount('#app')
