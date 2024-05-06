<template>
  <div class="role">
    <span class="role-name">
      <!-- TODO: pass by i18N key -->
      {{ role.roleName }}
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
import WeprodeCheckbox from '@/components/Base/Weprode/WeprodeCheckbox.vue'
export default {
  name: 'RolePermissions',
  components: { WeprodeCheckbox },
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
    updateMatrix (value, action) {
      this.$emit('updateMatrix', { actionName: action, value })
      if (action === 'VIEW' && !value) { // Unselect other permissions if the view permission is set to "false"
        this.$emit('updateMatrix', { actionName: 'DELETE', value: false })
        this.$emit('updateMatrix', { actionName: 'PERMISSIONS', value: false })
        this.type === 'Folder' ? this.$emit('updateMatrix', { actionName: 'ADD_OBJECT', value: false }) : this.$emit('updateMatrix', { actionName: 'UPDATE', value: false })
      } else if (value) { // Other permissions require the VIEW permission to be active
        this.$emit('updateMatrix', { actionName: 'VIEW', value: true })
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
