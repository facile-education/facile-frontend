import { createStore } from 'vuex'
import administration from '@/store/modules/administration.store'
import theme from '@/store/modules/theme.store'
import user from '@/store/modules/user.store'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    administration,
    theme,
    user
  }
})
