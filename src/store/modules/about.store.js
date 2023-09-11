import dayjs from 'dayjs'

import aboutService from '@/api/about.service'
import i18n from '@/i18n'

export const state = {
  versionNotesList: undefined,
  isLoadingVersionNotesList: false,
  versionNotesListError: false,
  selectedNote: undefined,
  versionNoteDetails: undefined,
  isLoadingVersionNoteDetails: false,
  versionNoteDetailsError: false
}

export const mutations = {
  setVersionNotesList (state, payload) {
    state.versionNotesList = payload
  },
  setIsLoadingVersionNotesList (state, payload) {
    this.isLoadingVersionNotesList = payload
  },
  setVersionNotesListError (state, payload) {
    this.versionNotesListError = payload
  },
  setSelectedNote (state, payload) {
    state.selectedNote = payload
  },
  setVersionNoteDetails (state, payload) {
    state.versionNoteDetails = payload
  },
  setIsLoadingVersionNoteDetails (state, payload) {
    this.isLoadingVersionNoteDetails = payload
  },
  setVersionNoteDetailsError (state, payload) {
    this.versionNoteDetailsError = payload
  }
}

export const actions = {
  getVersionNotesList ({ commit }) {
    commit('setIsLoadingVersionNotesList', true)
    aboutService.getVersionNotesList().then((data) => {
      commit('setIsLoadingVersionNotesList', false)
      if (data.success) {
        commit('setVersionNotesListError', false)
        data.versions.forEach(versionNote => {
          versionNote.versionNoteLabel = i18n.global.t('VersionNotes.updateOf') + dayjs(versionNote.creationDate, '').format('DD MMMM YYYY')
        })
        commit('setVersionNotesList', data.versions)
        this.dispatch('about/setSelectedNote', data.versions[0])
      } else {
        console.error('Cannot get notes versions list')
        commit('setVersionNotesListError', true)
      }
    }, (err) => {
      console.error(err)
      commit('setVersionNotesListError', err)
      commit('setIsLoadingVersionNotesList', false)
    })
  },
  setSelectedNote ({ commit }, note) {
    commit('setSelectedNote', note)
    this.dispatch('about/getVersionNoteDetails', note)
  },
  getVersionNoteDetails ({ commit }, note) {
    commit('setIsLoadingVersionNoteDetails', true)
    aboutService.getVersionNoteDetails(note.versionId).then((data) => {
      commit('setIsLoadingVersionNoteDetails', false)
      if (data.success) {
        commit('setVersionNoteDetailsError', false)
        commit('setVersionNoteDetails', data.versionDetails)
      } else {
        commit('setVersionNoteDetailsError', true)
        console.error('Cannot get versionNote details for versionNote', note)
      }
    }, (err) => {
      console.error(err)
      commit('setVersionNoteDetailsError', err)
      commit('setIsLoadingVersionNoteDetails', false)
    })
  }
}
