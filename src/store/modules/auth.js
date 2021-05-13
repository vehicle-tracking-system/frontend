import axios from 'axios'
import jwtDecode from 'jwt-decode'

const state = {
  user: null,
  token: null,
  refreshTask: null,
  expiration: 0
}

const getters = {
  isAuthenticated: (state) => !!state.user,
  isExpired: (state) => !(state.expiration > (Date.now() / 1000)),
  StateUser: state => state.user,
  StateToken: state => state.token,
  StateRefreshToken: state => state.refreshTask
}

const actions = {
  async LogIn ({
    commit,
    dispatch
  }, user) {
    await axios.post('/login', user).then(response => {
      const { exp } = jwtDecode(response.data.token)
      console.log('Exp: ' + exp)
      console.log('Now ')
      console.log(Date.now())
      const payload = {
        token: response.data.token,
        user: response.data.user,
        expiration: exp
      }
      commit('setUser', payload)
      axios.defaults.headers.common.Authorization = response.data.token
    })
    dispatch('autoRefresh')
  },

  async LogOut ({ commit }) {
    const payload = {
      user: null,
      token: null
    }
    axios.defaults.headers.common.Authorization = ''
    commit('logout', payload)
  },

  async RefreshToken ({
    commit,
    dispatch
  }) {
    clearTimeout(state.refreshTask)
    await axios.get('/auth/refresh').then(response => {
      const { exp } = jwtDecode(response.data.token)
      const payload = {
        token: response.data.token,
        user: response.data.user,
        expiration: exp
      }
      commit('setUser', payload)
      axios.defaults.headers.common.Authorization = response.data.token
    })
    dispatch('autoRefresh')
  },
  async autoRefresh (context) {
    const {
      state,
      commit,
      dispatch
    } = context
    const accessToken = state.token
    const { exp } = jwtDecode(accessToken)
    // console.log(exp)
    const now = Date.now() / 1000 // exp is represented in seconds since epoch
    let timeUntilRefresh = exp - now
    // console.log(timeUntilRefresh)
    timeUntilRefresh -= (5 * 60) // Refresh 5 minutes before it expires
    const refreshTask = setTimeout(() => dispatch('RefreshToken'), timeUntilRefresh * 1000)
    // const refreshTask = null
    commit('refreshTask', refreshTask) // In case you want to cancel this task on logout
  }
}
const mutations = {
  setUser (state, payload) {
    state.user = payload.user
    state.token = payload.token
    state.expiration = payload.expiration
  },
  logout (state, payload) {
    state.user = null
    state.token = null
    state.refreshTask = null
    state.expiration = 0
    clearTimeout(state.refreshTask)
  },
  refreshTask (state, task) {
    clearTimeout(state.refreshTask)
    state.refreshTask = task
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
