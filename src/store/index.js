import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const store = createStore({
  state() {
    return {
      darkmode: false,
      user: ''
    }
  },
  mutations: {
    changeMessage (state, payload) {
        state.darkmode = payload
    },
    SET_USER(state, user){
      state.user = user
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