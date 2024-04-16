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
          class="presence-button"
          :class="{'green': !student.isAbsent && (isDone || isInEdition), 'red': student.isAbsent}"
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
        :is="mq.phone ? 'div' : 'td'"
        class="late-container"
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
      <component
        :is="mq.phone ? 'div' : 'td'"
        :class="{'comment-row': !mq.phone}"
        class="comment-container"
      >
        <button
          class="comment-button"
          :class="{'phone': mq.phone}"
          :disabled="!canOpenComment"
          @click.stop="isCommentFormDisplayed = !isCommentFormDisplayed"
        >
          <CustomIcon
            v-if="mq.phone"
            icon-name="icon-edit"
          />
          <Pellet
            v-if="mq.phone && student.comment?.length > 0"
            class="pellet theme-border-color"
          />
          <span
            v-if="!mq.phone && formattedComment?.length > 0"
            class="comment"
          >{{ formattedComment }}</span>
          <span
            v-else-if="!mq.phone"
            class="no-comment-placeholder"
          >{{ $t(isInEdition && canOpenComment ? 'Call.commentPlaceholder' : '-') }}</span>
        </button>

        <span
          v-if="!mq.phone && !canOpenComment"
          class="disabled-layout"
        />

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
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants.js'
export default {
  name: 'CallStudent',
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
    session: {
      type: Object,
      default: undefined
    },
    isInEdition: {
      type: Boolean,
      default: false
    },
    isDone: {
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
    isCurrentSession () {
      if (this.session) {
        return dayjs().isAfter(dayjs(this.session.startDate, DATE_EXCHANGE_FORMAT)) &&
          dayjs().isBefore(dayjs(this.session.endDate, DATE_EXCHANGE_FORMAT))
      } else {
        return false
      }
    },
    minutesSinceSessionStart () {
      return dayjs().diff(dayjs(this.session.startDate, DATE_EXCHANGE_FORMAT), 'minute')
    },
    formattedComment () {
      return this.student.comment
    },
    initialLateValue () {
      if (this.student.isLate) {
        return this.student.delay?.lateDuration
      } else if (this.isCurrentSession) {
        return this.minutesSinceSessionStart
      } else {
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
      const numberValue = value ? parseInt(value) : undefined
      const newStudentValue = { ...this.student, lateDuration: numberValue }
      newStudentValue.isLate = !(!numberValue || numberValue <= 0)
      if (newStudentValue.isLate) {
        newStudentValue.isAbsent = false
        newStudentValue.delay = { lateDuration: numberValue }
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
  position: relative;
  padding: 16px 0;
  @extend %font-regular-l;

  .presence-button {
    margin: auto;
  }
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

.comment-row {
  max-width: 0;

  .disabled-layout {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    cursor: not-allowed;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.late-container, .comment-container {
  position: relative;
}

.comment-button {
  position: relative;

  &:not(.phone) {
    justify-content: flex-start;
    margin: auto;
    padding-left: 0.75rem;
    width: 100%;
    height: 100%;
    border-radius: 0;
    box-shadow: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pellet {
    position: absolute;
    right: -3px;
    top: -2px;
  }

  .comment {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.no-comment-placeholder {
  color: $neutral-60;
}
</style>
