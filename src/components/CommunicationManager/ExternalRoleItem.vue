<template>
  <div class="role">
    <label
      v-t="'Facile.roles.' + role.roleCode"
      class="role-label"
    />
    <WeprodeRadioButton
      v-model="hasRoleExternalRight"
      :name="role.roleCode"
      :label="$t('CommunicationManager.ExternalRoleItem.yes')"
      rb-value="yes"
      class="yes"
    />
    <WeprodeRadioButton
      v-model="hasRoleExternalRight"
      :name="role.roleCode"
      :label="$t('CommunicationManager.ExternalRoleItem.no')"
      rb-value="no"
    />
  </div>
</template>

<script>
import WeprodeRadioButton from '@/components/Base/Weprode/WeprodeRadioButton.vue'
export default {
  name: 'ExternalRoleItem',
  components: { WeprodeRadioButton },
  props: {
    role: {
      type: Object,
      required: true
    },
    current: {
      type: Boolean,
      required: true
    }
  },
  emits: ['input'],
  computed: {
    hasRoleExternalRight: {
      set (newValue) {
        this.$emit('input', { code: this.role.roleCode, value: (newValue === 'yes') })
      },
      get () {
        return this.current ? 'yes' : 'no'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.role {
  margin-bottom: 10px;
}

.role-label {
  display: inline-block;
  width: 330px;
}

.yes {
  margin-right: 10px;
}
</style>
