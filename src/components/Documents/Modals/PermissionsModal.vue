<template>
  <PentilaWindow
    :full-screen="mq.phone"
    :modal="true"
    :draggable="true"
    :width="600"
    @close="onClose"
    @keydown.exact.enter.stop=""
    @keydown.exact.backspace.stop=""
    @keydown.exact.delete.stop=""
    @keydown.exact.f2.stop=""
    @keydown.ctrl.stop=""
  >
    <template #header>
      <span v-t="'header'" />
    </template>

    <template #body>
      <div>{{ permissionMatrix }}</div>
    </template>

    <template #footer>
      <PentilaButton
        data-test="submitButton"
        :label="$t('Commons.submit')"
        @click="submit"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import permissionsService from '@/api/documents/permissions.service'

export default {
  name: 'PermissionsModal',
  props: {
    document: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      permissionMatrix: {}
    }
  },
  create () {
    if (this.document.type === 'File') {
      permissionsService.getFilePermissionMatrix(this.document.id).then((data) => {
        if (data.success) {
          this.permissionMatrix = data.permissionMatrix
        }
      })
    } else if (this.document.type === 'Folder') {
      permissionsService.getFolderPermissionMatrix(this.document.id).then((data) => {
        if (data.success) {
          this.permissionMatrix = data.permissionMatrix
        }
      })
    } else {
      console.error('Unknown document type' + this.document.type)
    }
  },
  methods: {
    submit () {
      permissionsService.savePermissionMatrix(this.document.id, this.permissionMatrix).then((data) => {
        if (data.success) {
          this.onClose()
        }
      })
    },
    onClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n locale="fr">
{
  "header": "Gestion des permissions"
}
</i18n>
