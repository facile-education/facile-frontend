<template>
  <div class="role">
    <span class="role-name">
      {{ $t(role.roleName.split(' ').join('')) }}
    </span>

    <div class="permission view">
      <WeprodeCheckbox
        v-if="role.VIEW !== undefined"
        :model-value="role.VIEW"
        :disabled="!role.editable"
        :label="''"
        @update:model-value="updateMatrix($event, 'VIEW')"
      />
    </div>

    <div
      v-if="type==='Folder'"
      class="permission add"
    >
      <WeprodeCheckbox
        v-if="role.ADD_OBJECT !== undefined"
        :model-value="role.ADD_OBJECT"
        :disabled="!role.editable"
        :label="''"
        @update:model-value="updateMatrix($event, 'ADD_OBJECT')"
      />
    </div>

    <div
      v-if="type==='File'"
      class="permission update"
    >
      <WeprodeCheckbox
        v-if="role.UPDATE !== undefined"
        :model-value="role.UPDATE"
        :disabled="!role.editable"
        :label="''"
        @update:model-value="updateMatrix($event, 'UPDATE')"
      />
    </div>

    <div class="permission delete">
      <WeprodeCheckbox
        v-if="role.DELETE !== undefined"
        :model-value="role.DELETE"
        :disabled="!role.editable"
        :label="''"
        @update:model-value="updateMatrix($event, 'DELETE')"
      />
    </div>

    <div class="permission permissions">
      <WeprodeCheckbox
        v-if="role.PERMISSIONS !== undefined"
        :model-value="role.PERMISSIONS"
        :disabled="!role.editable"
        :label="''"
        @update:model-value="updateMatrix($event, 'PERMISSIONS')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'RolePermissions',
  props: {
    role: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  emits: ['updateMatrix'],
  methods: {
    updateMatrix (event, action) {
      this.$emit('updateMatrix', { actionName: action, value: event })
      if (action === 'VIEW' && !event) { // Unselect other permissions if the view permission is set to "false"
        this.$emit('updateMatrix', { actionName: 'DELETE', value: false })
        this.$emit('updateMatrix', { actionName: 'PERMISSIONS', value: false })
        this.type === 'Folder' ? this.$emit('updateMatrix', { actionName: 'ADD_OBJECT', value: false }) : this.$emit('updateMatrix', { actionName: 'UPDATE', value: false })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.role {
  height: 25px;
  display: flex;

  .role-name {
    width: 250px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .permission {
    display: flex;
    justify-content: center;
    width: 100px;
  }
}
</style>

<i18n locale="fr">
{
  "National_1": "Élève",
  "National_2": "Responsable légal",
  "National_3": "Enseignant·e",
  "National_4": "Directeur·trice",
  "Group_admin": "Admin. ENTA",
  "Assistanttechnique": "Assistant·e technique",
  "Caissiercomptable": "Caissier·ère comptable",
  "Conseillersocial": "Conseiller·ère social·e",
  "Conseillerd'orientation": "Conseiller·ère d'orientation",
  "Doyen": "Doyen·ne",
  "Infirmiere": "Infirmier·ère",
  "Bibliothecaire": "Bibliothécaire",
  "Psychologue": "Psychologue",
  "Secretaire": "Secrétaire",
  "SiteAdministrator": "Admin. de site",
  "SiteOwner": "Créateur·trice de site"
}
</i18n>
