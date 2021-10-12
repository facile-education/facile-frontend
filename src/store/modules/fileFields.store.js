import { defaultFields } from '@/constants/documents'
import i18n from '@/i18n'

function formatOptions (fields) {
  const contextMenuOptions = []
  let i
  for (i = 0; i < fields.length; ++i) {
    const option = {
      name: fields[i].name,
      title: fields[i].label,
      isGrayed: fields[i].isPermanent,
      position: i,
      hasCheckbox: true,
      isSelected: fields[i].isSelected,
      hasSeparator: (i === fields.length - 1)
    }
    contextMenuOptions.push(option)
  }
  contextMenuOptions.push({
    name: 'resetFields',
    title: i18n.global.t('Documents.options.resetFields'),
    position: i,
    hasSeparator: false
  })
  return contextMenuOptions
}

export const state = {
  fields: []
}

export const mutations = {
  updateFields (state, payload) {
    state.fields = [...payload]
    const contextMenuOptions = formatOptions(payload)
    this.dispatch('contextMenu/setContextMenuOptions', contextMenuOptions)
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
