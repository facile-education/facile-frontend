import workspaceService from '@/api/workspace.service'

export default {
  state: {
    folderContent: undefined,
    groupList: undefined
  },
  mutations: {
    updateFolderContent (state, payload) {
      state.folderContent = payload
    },
    updateWorkspaceGroupList (state, payload) {
      state.groupList = payload
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
    },
    initGroupList ({ commit }) {
      return workspaceService.getGroupList().then(
        (data) => {
          if (data.success) {
            commit('updateWorkspaceGroupList', data.groupList)
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
