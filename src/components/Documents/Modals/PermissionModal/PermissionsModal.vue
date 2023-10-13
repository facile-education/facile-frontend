<template>
  <PentilaWindow
    :full-screen="mq.phone || mq.tablet"
    :modal="true"
    :draggable="true"
    :width="700"
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
      <div class="fields">
        <div
          v-t="('name')"
          class="name"
        />
        <div
          v-t="('view')"
          class="view"
        />
        <div
          v-if="document.type==='File'"
          v-t="('update')"
          class="update"
        />
        <div
          v-if="document.type==='Folder'"
          v-t="('add')"
          class="add"
        />
        <div
          v-t="('delete')"
          class="delete"
        />
        <div
          v-t="('permissions')"
          class="permissions"
        />
      </div>
      <RolePermissions
        v-for="(role, index) in permissionMatrix"
        :key="index"
        :role="role"
        :type="document.type"
        @updateMatrix="updateMatrix($event, role)"
      />
      <PentilaCheckbox
        v-if="document.type==='Folder'"
        :model-value="isRecursive"
        :label="$t('recursiveLabel')"
        @update:modelValue="updateRecursive"
      />
    </template>

    <template #footer>
      <PentilaButton
        v-if="initialPermissionMatrix.length > 0"
        class="reset-button"
        :label="$t('reset')"
        @click="reset"
      />
      <PentilaButton
        data-test="submitButton"
        :label="$t('submit')"
        @click="submit"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import RolePermissions from '@components/Documents/Modals/PermissionModal/RolePermissions'

import permissionsService from '@/api/documents/permissions.service'

export default {
  name: 'PermissionsModal',
  components: { RolePermissions },
  inject: ['mq'],
  props: {
    document: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      initialPermissionMatrix: [],
      permissionMatrix: [],
      isRecursive: false
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    if (this.document.type === 'File') {
      permissionsService.getFilePermissionMatrix(this.document.id).then((data) => {
        if (data.success) {
          this.initialPermissionMatrix = JSON.stringify(data.permissionMatrix)
          this.permissionMatrix = data.permissionMatrix
        }
      })
    } else if (this.document.type === 'Folder') {
      permissionsService.getFolderPermissionMatrix(this.document.id).then((data) => {
        if (data.success) {
          this.initialPermissionMatrix = JSON.stringify(data.permissionMatrix)
          this.permissionMatrix = data.permissionMatrix
        }
      })
    } else {
      console.error('Unknown document type' + this.document.type)
    }
  },
  methods: {
    updateMatrix (action, role) {
      for (let i = 0; i < this.permissionMatrix.length; i++) {
        const row = this.permissionMatrix[i]
        if (row.roleId === role.roleId) {
          row[action.actionName] = action.value
        }
      }
    },
    updateRecursive (value) {
      this.isRecursive = value
    },
    reset () {
      this.permissionMatrix = JSON.parse(this.initialPermissionMatrix)
    },
    submit () {
      if (this.document.type === 'File') {
        permissionsService.saveFilePermissionMatrix(this.document.id, this.permissionMatrix).then((data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('permission-success'), type: 'success' })
            this.onClose()
          }
        })
      } else if (this.document.type === 'Folder') {
        permissionsService.saveFolderPermissionMatrix(this.document.id, this.permissionMatrix, this.isRecursive).then((data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('permission-success'), type: 'success' })
            this.onClose()
          }
        })
      }
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.fields {
  display: flex;
  height: 25px;
  font-weight: 500;
  border-bottom: 1px solid $color-border;
  margin-bottom: 10px;

  .name {
    width: 250px;
  }

  .add, .view, .update, .delete, .permissions {
    display: flex;
    justify-content: center;
    width: 100px;
  }
}

.reset-button {
  margin-right: 20px;
}

</style>

<i18n locale="fr">
{
  "header": "Gestion des permissions",
  "reset": "Réinitialiser",
  "add": "Ajouter",
  "view": "Voir",
  "update": "Modifier",
  "delete": "Supprimer",
  "permissions": "Permissions",
  "recursiveLabel": "Appliquer ces permissions à tous les éléments contenus dans le dossier",
  "name": "Rôle",
  "submit": "Valider",
  "permission-success": "Permissions enregistrées"
}
</i18n>
