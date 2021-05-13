const state = {
  mainTour: true,
  liveTour: true,
  historyTour: true
}

const getters = {
  showTour: state => state.mainTour,
  showLiveTour: state => state.liveTour,
  showHistoryTour: state => state.historyTour
}

const actions = {
  async HideTour ({ commit }) {
    commit('hideTour')
  },
  async ShowTour ({ commit }) {
    commit('showTour')
  },
  async HideLiveTour ({ commit }) {
    commit('hideLiveTour')
  },
  async ShowLiveTour ({ commit }) {
    commit('showLiveTour')
  },
  async HideHistoryTour ({ commit }) {
    commit('hideHistoryTour')
  },
  async ShowHistoryTour ({ commit }) {
    commit('showHistoryTour')
  }
}
const mutations = {
  hideTour (state) {
    state.mainTour = false
  },
  showTour (state) {
    state.mainTour = true
  },
  hideLiveTour (state) {
    state.liveTour = false
  },
  showLiveTour (state) {
    state.liveTour = true
  },
  hideHistoryTour (state) {
    state.historyTour = false
  },
  showHistoryTour (state) {
    state.historyTour = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
