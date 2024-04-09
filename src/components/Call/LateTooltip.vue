<template>
  <WeprodeTooltip
    class="late-tooltip"
    :header="$t('Call.late')"
    @close="close"
  >
    <div class="first-line">
      <WeprodeInput
        ref="lateInput"
        v-model="inputValue"
        class="late-input"
        :disabled="!isInEdition"
        type="number"
        :placeholder="$t('Call.lateInputPlaceholder')"
        @keyup.enter="emitNewValue(inputValue)"
      />
      <button
        v-if="isInEdition && initialValue"
        :title="$t('Call.removeLate')"
        :aria-label="$t('Call.removeLate')"
        @click="emitNewValue(undefined)"
      >
        <CustomIcon icon-name="icon-trash" />
      </button>
    </div>
    <WeprodeButton
      v-if="isInEdition"
      :label="$t('Call.submit')"
      @click="emitNewValue(inputValue)"
    />
  </WeprodeTooltip>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import WeprodeInput from '@components/Base/Weprode/WeprodeInput.vue'
import WeprodeTooltip from '@components/Base/Weprode/WeprodeTooltip.vue'
import { nextTick } from 'vue'

export default {
  name: 'LateTooltip',
  components: { CustomIcon, WeprodeInput, WeprodeButton, WeprodeTooltip },
  props: {
    initialValue: {
      type: Number,
      default: undefined
    },
    isInEdition: {
      type: Boolean,
      default: false
    }
  },
  emits: ['updateValue', 'close'],
  data () {
    return {
      inputValue: undefined
    }
  },
  created () {
    this.inputValue = this.initialValue
  },
  mounted () {
    const vm = this
    nextTick(function () {
      vm.$refs.lateInput.focus()
    })
  },
  methods: {
    emitNewValue (lateValue) {
      this.$emit('updateValue', lateValue)
      this.close()
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.late-tooltip {
  width: 300px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
}

.first-line {
  @extend %tooltip-first-line;
}
</style>
