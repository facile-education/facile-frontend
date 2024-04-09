<template>
  <component
    :is="mq.phone ? 'li' : 'tr'"
    class="student-row"
  >
    <component :is="mq.phone ? 'v-fragment' : 'td'">
      <CallStudentHeader :student="student" />
    </component>

    <component
      :is="mq.phone ? 'div' : 'v-fragment'"
      :class="{'phone-buttons': mq.phone}"
    >
      <!-- Presence -->
      <component
        :is="mq.phone ? 'v-fragment' : 'td'"
        :class="{'button-column': !mq.phone}"
      >
        <button
          :disabled="!isInEdition"
          :class="{'green': !student.isAbsent, 'red': student.isAbsent}"
          @click="toggleAbsence"
        >
          <CustomIcon :icon-name="student.isAbsent ? 'icon-no-user' : 'icon-user-16'" />
        </button>
      </component>

      <td v-if="!mq.phone">
        <div class="call-separator" />
      </td>

      <!-- Late -->
      <component
        :is="mq.phone ? 'v-fragment' : 'td'"
        :class="{'button-column': !mq.phone}"
      >
        <button
          :disabled="!isInEdition && !initialLateValue"
          :class="{'orange': student.isLate }"
          @click.stop="isLateFormDisplayed = !isLateFormDisplayed"
        >
          <CustomIcon icon-name="icon-clock" />
        </button>

        <LateTooltip
          v-if="isLateFormDisplayed"
          :initial-value="initialLateValue"
          :is-in-edition="isInEdition"
          @update-value="setLateDuration"
          @close="isLateFormDisplayed=false"
        />
      </component>

      <!-- Firing -->
      <component
        :is="mq.phone ? 'v-fragment' : 'td'"
        :class="{'button-column': !mq.phone}"
      >
        <button
          :class="{'orange': student.isFired }"
          :disabled="!isInEdition"
          @click="toggleFiring"
        >
          <CustomIcon icon-name="icon-out" />
        </button>
      </component>

      <!-- Medical -->
      <component
        :is="mq.phone ? 'v-fragment' : 'td'"
        :class="{'button-column': !mq.phone}"
      >
        <button
          :class="{'orange': student.isMedical }"
          :disabled="!isInEdition"
          @click="toggleMedical"
        >
          <CustomIcon icon-name="icon-soin" />
        </button>
      </component>

      <!-- Comment -->
      <component :is="mq.phone ? 'v-fragment' : 'td'">
        <button
          class="comment-button"
          :class="{'phone': mq.phone}"
          :disabled="!canOpenComment"
          @click.stop="isCommentFormDisplayed = !isCommentFormDisplayed"
        >
          <CustomIcon icon-name="icon-edit" />
          <Pellet
            v-if="student.comment?.length > 0"
            class="pellet theme-border-color"
          />
        </button>

        <CommentTooltip
          v-if="isCommentFormDisplayed"
          :initial-value="student.comment"
          :is-in-edition="isInEdition"
          @update-value="setComment"
          @close="isCommentFormDisplayed=false"
        />
      </component>
    </component>
  </component>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import Pellet from '@components/Base/Pellet.vue'
import VFragment from '@components/Base/VFragment.vue'
import CallStudentHeader from '@components/Call/CallStudentHeader.vue'
import CommentTooltip from '@components/Call/CommentTooltip.vue'
import LateTooltip from '@components/Call/LateTooltip.vue'
export default {
  name: 'CallStudentRow',
  components: {
    VFragment,
    CallStudentHeader,
    Pellet,
    CommentTooltip,
    LateTooltip,
    CustomIcon
  },
  inject: ['mq'],
  props: {
    student: {
      type: Object,
      required: true
    },
    isInEdition: {
      type: Boolean,
      default: false
    }
  },
  emits: ['updateStudent'],
  data () {
    return {
      lateInputValue: undefined,
      commentInputValue: undefined,
      isLateFormDisplayed: false,
      isCommentFormDisplayed: false
    }
  },
  computed: {
    formattedComment () {
      if (this.comment?.length > 30) {
        return this.comment.substring(0, 27) + '...'
      } else {
        return this.comment
      }
    },
    initialLateValue () {
      if (this.student.isLate) {
        return this.student.delay?.lateDuration
      } else {
        // TODO: get the number of minutes since the session start (if session is on going)
        return undefined
      }
    },
    canOpenComment () {
      return (this.student.comment?.length > 0) || (this.isInEdition && (this.student.isAbsent || this.student.isLate || this.student.isFired || this.student.isMedical))
    }
  },
  methods: {
    toggleAbsence () {
      const newStudentValue = { ...this.student, isAbsent: !this.student.isAbsent }

      if (newStudentValue.isAbsent === true) {
        newStudentValue.isFired = false
        newStudentValue.isMedical = false
        newStudentValue.isLate = false
        newStudentValue.lateInputValue = undefined
        newStudentValue.delay = undefined
      }

      this.$emit('updateStudent', newStudentValue)
    },
    toggleFiring () {
      const newStudentValue = { ...this.student, isFired: !this.student.isFired }

      this.$emit('updateStudent', newStudentValue)
    },
    toggleMedical () {
      const newStudentValue = { ...this.student, isMedical: !this.student.isMedical }

      this.$emit('updateStudent', newStudentValue)
    },
    setLateDuration (value) {
      const newStudentValue = { ...this.student, lateDuration: value }
      newStudentValue.isLate = !(!value || value <= 0)
      if (newStudentValue.isLate) {
        newStudentValue.isAbsent = false
        newStudentValue.delay = { lateDuration: value }
      }
      this.$emit('updateStudent', newStudentValue)
    },
    setComment (value) {
      const newStudentValue = { ...this.student, comment: value }

      this.$emit('updateStudent', newStudentValue)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

tr:not(:last-child) {
  border-bottom: 1px solid $neutral-40;
}

li {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @extend %font-regular-m;

  &:not(:last-child) {
    border-bottom: 1px solid $neutral-40;
  }
}

td {
  //border: 1px solid rgb(160 160 160);
  position: relative;
  padding: 16px 0;
  @extend %font-regular-l;
}

.phone-buttons {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.button-column {
  width: 3.5rem;
}

button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  margin: 0 0.75rem;
  cursor: pointer;
  background-color: transparent;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.30);
  @extend %font-regular-l;

  &.green {
    background-color: $success;
  }
  &.orange {
    background-color: $warning;
  }
  &.red {
    background-color: $danger;
  }

  &:hover {
    filter: brightness(115%);
    @include transition(filter, 0.2s, linear);
  }
}

.green, .orange, .red {
  box-shadow: none;
  color: white;
}

.comment-button {
  position: relative;

  &:not(.phone) {
    margin: auto;
  }

  .pellet {
    position: absolute;
    right: -3px;
    top: -2px;
  }
}
</style>
