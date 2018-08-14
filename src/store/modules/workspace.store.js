import workspaceService from '@/api/workspace.service'

export default {
  state: {
    folderContent: undefined
  },
  mutations: {
    updateFolderContent (state, payload) {
      state.folderContent = payload
    }
  },
  actions: {
    selectWorkspaceFolder ({ commit }) {
      return workspaceService.getFolderContent().then(
        (data) => {
          if (data.success) {
            commit('updateFolderContent', data.fileItems)
          }
          // TODO else toastr
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    }
  },
  getters: {
  }
}
