<template>
  <div class="role">
    <label
      v-t="'Nero.roles.' + role.roleCode"
      class="role-label"
    />
    <NeroRadioButton
      v-model="hasRoleExternalRight"
      :name="role.roleCode"
      :label="$t('CommunicationManager.ExternalRoleItem.yes')"
      rb-value="yes"
      class="yes"
    />
    <NeroRadioButton
      v-model="hasRoleExternalRight"
      :name="role.roleCode"
      :label="$t('CommunicationManager.ExternalRoleItem.no')"
      rb-value="no"
    />
  </div>
</template>

<script>
import NeroRadioButton from '@/components/Nero/NeroRadioButton'

export default {
  name: 'ExternalRoleItem',
  components: {
    NeroRadioButton
  },
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
