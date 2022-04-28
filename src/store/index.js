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
    SET_CHANGEMODE:  (state, payload) => {
      state.darkmode = payload
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    // SET_BACKGROUND_IMAGE: (state, image) => {
    //   state.user.background_image_url = image
    // },
    // SET_PROFILE_IMAGE: (state, image) => {
    //   state.user.profile_image_url = image
    // },
    // SET_FOLLOW: (state, uid) => {
    //   state.user.followings.push(uid)
    // },
    // SET_UN_FOLLOW: (state, uid) => {
    //   state.user.followings = state.user.followings.filter((u) => u !== uid)
    // },
  },
  actions:{
    toggleDarkMode({ commit }, payload){
        commit('SET_CHANGEMODE', payload)
    }
  },
  plugins: [createPersistedState()],
})

export default store