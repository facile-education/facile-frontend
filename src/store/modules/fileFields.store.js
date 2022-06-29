import { defaultFields } from '@/constants/documents'

export const state = {
  fields: []
}

export const mutations = {
  updateFields (state, payload) {
    state.fields = [...payload]
  }
}

export const actions = {
  initFields ({ commit }) {
    // initialise fields with defaults values
    this.dispatch('fileFields/resetFields')
  },
  resetFields ({ commit }) {
    const fields = [...defaultFields]
    for (let i = 0; i < fields.length; ++i) {
      fields[i].isSelected = fields[i].defaultDisplay
    }
    commit('updateFields', fields)
  },
  updateFields ({ commit }, fields) {
    for (let i = 0; i < fields.length; ++i) {
      fields[i].isSelected = fields[i].defaultDisplay
    }
    commit('updateFields', fields)
  },
  updateOption ({ commit }, option) {
    const fields = [...this.state.fileFields.fields]
    let find = false
    for (let i = 0; i < fields.length; ++i) {
      if (fields[i].name === option) {
        find = true
        fields[i].isSelected = !fields[i].isSelected
        commit('updateFields', fields)
        break
      }
    }
    if (!find) { console.error('unknown option', option, 'in', this.state.fileFields.fields) }
  }
}
