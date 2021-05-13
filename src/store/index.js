import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import auth from './modules/auth'
import tour from './modules/tour'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    tour
  },
  plugins: [createPersistedState()]
})
