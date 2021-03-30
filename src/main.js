import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Snotify, { SnotifyPosition } from 'vue-snotify/vue-snotify.min.js'
import './sass/style.scss'
import '@/assets/css/main.scss'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'
import { LMap, LMarker, LTileLayer, LTooltip, LFeatureGroup } from 'vue2-leaflet'
import { Icon } from 'leaflet'

axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.VUE_APP_BACKEND_URL

const token = store.getters.StateToken
if (token) {
  axios.defaults.headers.common.Authorization = token
}

Vue.config.productionTip = false

Vue.component('l-map', LMap)
Vue.component('l-tile-layer', LTileLayer)
Vue.component('l-marker', LMarker)
Vue.component('l-tooltip', LTooltip)
Vue.component('l-feature-group', LFeatureGroup)

delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

const options = {
  toast: {
    position: SnotifyPosition.rightTop
  }
}

Vue.use(Snotify, options)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
