import axios from 'axios'

const state = {
  user: null,
  token: null
}

const getters = {
  isAuthenticated: (state) => !!state.user,
  StateUser: state => state.user,
  StateToken: state => state.token
}

const actions = {
  async LogIn ({ commit }, user) {
    await axios.post('login', user).then(response => {
      const payload = { token: response.data.token, user: response.data.user }
      commit('setUser', payload)
    })
  },

  async LogOut ({ commit }) {
    const payload = { user: null, token: null }
    commit('logout', payload)
  },

  async GetVehicle () {
    console.log('getting vehicle')
    console.log(this.getters.StateToken)
    const response = await axios.get('vehicle/2', { headers: { Authorization: this.getters.StateToken } })
    console.log(response)
  }
}
const mutations = {
  setUser (state, payload) {
    state.user = payload.user
    state.token = payload.token
  },
  logout (state, payload) {
    state.user = payload.user
    state.token = payload.token
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
