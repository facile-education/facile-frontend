<template>
  <div class="role">
    <label
      v-t="'nero.roles.' + role.roleCode"
      class="role-label"/>
    <NeroRadioButton
      v-model="hasRoleExternalRight"
      :name="role.roleCode"
      :label="$t('CommunicationManager.CMExternalRoleItem.yes')"
      rb-value="yes"
      class="yes"/>
    <NeroRadioButton
      v-model="hasRoleExternalRight"
      :name="role.roleCode"
      :label="$t('CommunicationManager.CMExternalRoleItem.no')"
      rb-value="no"/>
  </div>
</template>

<script>
import NeroRadioButton from '@/components/NeroRadioButton'

export default {
  name: 'CMExternalRoleItem',
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
        this.$emit('input', {code: this.role.roleCode, value: (newValue === 'yes')})
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
