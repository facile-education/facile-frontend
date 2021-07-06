import { createStore } from 'vuex'
import modules from './modules'

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules,
  // Enable strict mode in development to get a warning
  // when mutating state outside of a mutation.
  // https://vuex.vuejs.org/guide/strict.html
  strict: process.env.NODE_ENV !== 'production'
})
