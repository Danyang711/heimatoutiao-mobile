import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '../utils/storages'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录用户，一个对象，包含 token 信息
    user: getItem('user')
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // 为了防止刷新丢失 state 中的 user 状态，把它放到本地存储
      setItem('user', state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
