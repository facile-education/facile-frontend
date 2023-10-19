<template>
  <WeprodeInput
    ref="nameInput"
    v-model="categoryName"
    :placeholder="!initialName ? $t('newCategory') : undefined"
    @blur="$emit('submitName', categoryName)"
    @keyup.enter.stop="blurInput"
    @keyup.escape="$emit('close')"
  />
</template>

<script>
import { nextTick } from 'vue'

import folderService from '@/api/messaging/folder.service'

export default {
  name: 'AccessCategoryInput',
  props: {
    initialName: {
      type: String,
      default: undefined
    }
  },
  emits: ['close', 'submitName'],
  data () {
    return {
      categoryName: ''
    }
  },
  created () {
    if (this.initialName) {
      this.categoryName = this.initialName
    }
  },
  mounted () {
    const vm = this
    nextTick(function () {
      vm.$refs.nameInput.focus()
    })
  },
  methods: {
    blurInput () {
      const vm = this
      nextTick(function () {
        vm.$refs.nameInput.blur()
      })
    },
    submitName () {
      if (this.currentFolder.folderName.length === 0) {
        this.currentFolder.folderName = this.currentFolderOldName
      } else {
        folderService.renameFolder(this.folder.folderId, this.currentFolder.folderName).then((data) => {
          if (data.success) {
            this.currentFolderOldName = this.currentFolder.folderName
            this.$store.dispatch('messaging/updatePersonalFolder', data.renamedFolder)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n locale="fr">
{
  "newCategory": "Nouvelle catégorie"
}
</i18n>
