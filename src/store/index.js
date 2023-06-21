import { createStore } from 'vuex'

import { modules } from './modules'

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: modules,
  // Enable strict mode in development to get a warning
  // when mutating state outside of a mutation.
  // https://vuex.vuejs.org/guide/strict.html
  strict: import.meta.env.NODE_ENV !== 'production'
})
