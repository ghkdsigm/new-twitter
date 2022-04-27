import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const store = createStore({
  state() {
    return {
      darkmode: false,
    }
  },
  mutations: {
    changeMessage (state, payload) {
        state.darkmode = payload
    }
  },
  actions:{
    toggleDarkMode({ commit }, payload){
        commit('changeMessage', payload)
    }
  },
  plugins: [createPersistedState()],
})

export default store