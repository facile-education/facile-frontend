<template>
  <WeprodeTooltip
    class="comment-tooltip"
    :header="$t('Call.comment')"
    right="0"
    @close="close"
  >
    <div class="first-line">
      <textarea
        ref="commentInput"
        v-model="inputValue"
        class="comment-input"
        :disabled="!isInEdition"
        @keyup.enter="emitNewValue(inputValue)"
      />
      <button
        v-if="isInEdition && initialValue"
        :title="$t('Call.removeComment')"
        :aria-label="$t('Call.removeComment')"
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
import WeprodeTooltip from '@components/Base/Weprode/WeprodeTooltip.vue'
import { nextTick } from 'vue'

export default {
  name: 'CommentTooltip',
  components: { CustomIcon, WeprodeButton, WeprodeTooltip },
  props: {
    initialValue: {
      type: String,
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
      vm.$refs.commentInput.focus()
    })
  },
  methods: {
    emitNewValue (commentValue) {
      if (!commentValue) {
        commentValue = ''
      }
      this.$emit('updateValue', commentValue)
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

.comment-tooltip {
  width: 300px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
}

textarea {
  min-height: 6rem;
}

.first-line {
  @extend %tooltip-first-line;
}
</style>
