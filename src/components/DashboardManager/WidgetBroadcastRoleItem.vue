<template>
  <div>
    <label class="label">
      {{ label }}
    </label>

    <PentilaToggleSwitch
      :value="isBroadcasted"
      class="toggle"
      @input="onInputBroadcast"
    />

    <PentilaCheckbox
      :value="isMandatory"
      :label="$t('DashboardManager.WidgetBroadcastRoleItem.mandatoryCheckboxLabel')"
      class="mandatory"
      @input="onInputMandatory"
    />
  </div>
</template>

<script>
export default {
  name: 'WidgetBroadcastRoleItem',
  props: {
    isBroadcasted: {
      type: Boolean,
      required: true
    },
    isMandatory: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      required: true
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
