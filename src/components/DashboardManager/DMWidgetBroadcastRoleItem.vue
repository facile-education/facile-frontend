<template>
  <div>
    <label class="label">{{ label }}</label>

    <NeroToggleSwitch
      :value="isBroadcasted"
      class="toggle"
      @input="onInputBroadcast"/>

    <NeroCheckbox
      v-if="isAdministrator"
      :value="isMandatory"
      :label="$t('DashboardManager.DMWidgetBroadcastRoleItem.mandatoryCheckboxLabel')"
      class="mandatory"
      @input="onInputMandatory"/>
  </div>
</template>

<script>
import NeroCheckbox from '@/components/NeroCheckbox'
import NeroToggleSwitch from '@/components/NeroToggleSwitch'

export default {
  name: 'DMWidgetBroadcastRoleItem',
  components: {
    NeroCheckbox,
    NeroToggleSwitch
  },
  props: {
    isBroadcasted: {
      type: Boolean,
      required: true
    },
    isMandatory: {
      type: Boolean,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.currentUser.isAdministrator
    }
  },
  methods: {
    onInputBroadcast (value) {
      this.$emit('update:isBroadcasted', value)
    },
    onInputMandatory (value) {
      this.$emit('update:isMandatory', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.label {
  display: inline-block;
  width: 50%;
}

.toggle {
  vertical-align: text-top;
}

.mandatory {
  display: inline-block;
}
</style>
