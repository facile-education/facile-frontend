export const state = {
  // current format of action: {name: ""}
  currentActionsList: [],
  isLoadingProgressionDisplayed: false,
  currentUploadingFile: undefined,
  cancelUpload: false,
  listFilesToUpload: [],
  listUploadedFiles: [],
  currentBackgroundActionList: []
}

export const mutations = {
  addAction (state, payload) {
    state.currentActionsList.push(payload)
  },
  removeAction (state, actionName) {
    for (let i = 0; i < state.currentActionsList.length; ++i) {
      if (state.currentActionsList[i].name === actionName) {
        state.currentActionsList.splice(i, 1)
        break
      }
    }
  },
  setDisplayProgressionStatus (state, payload) {
    state.isLoadingProgressionDisplayed = payload
  },
  setCancelUpload (state, payload) {
    state.cancelUpload = payload
  },
  setImportFileList (state, payload) {
    state.listFilesToUpload = payload
  },
  setCurrentUploadFile (state, payload) {
    state.currentUploadingFile = payload
  },
  removeFileToUpload (state, file) {
    for (let i = 0; i < state.listFilesToUpload.length; ++i) {
      if (state.listFilesToUpload[i].name === file.name) {
        state.listFilesToUpload.splice(i, 1)
        break
      }
    }
  },
  addUploadedFile (state, file) {
    state.listUploadedFiles.push(file)
  }
}

export const actions = {
  addAction ({ commit }, action) {
    commit('addAction', action)
  },
  removeAction ({ commit }, action) {
    commit('removeAction', action.name)
  },
  displayUploadProgression ({ commit }) {
    commit('setDisplayProgressionStatus', true)
  },
  hideUploadProgression ({ commit }) {
    commit('setDisplayProgressionStatus', false)
  },
  setCurrentUploadFile ({ commit }, file) {
    commit('setCurrentUploadFile', file)
  },
  removeCurrentUploadFile ({ commit }) {
    commit('setCurrentUploadFile', undefined)
  },
  addUploadedFile ({ commit }, file) {
    // commit('removeFileToUpload', file)
    commit('addUploadedFile', file)
  },
  setImportFileList ({ commit }, fileList) {
    commit('setCancelUpload', false)
    commit('setImportFileList', fileList)
  },
  cancelUpload ({ commit }) {
    commit('setCancelUpload', true)
  }
}

export const getters = {
  areActionsInProgress (state) {
    return state.currentActionsList.length !== 0
  },
  isInProgress: (state) => (actionName) => {
    for (let i = 0; i < state.currentActionsList.length; ++i) {
      if (state.currentActionsList[i].name === actionName) {
        return true
      }
    }
    return false
  }
}
