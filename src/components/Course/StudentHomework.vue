<template>
  <article
    class="homework"
    :class="{'done': isDone}"
    :style="isDone ? '' : `border-color: ${homework.color}22; border-left-color: ${homework.color}; background-color: ${homework.color}22;`"
  >
    <Pellet
      v-if="!homework.isDone && !isPast"
      class="pellet"
    />
    <header>
      <div class="left">
        <span class="subject">{{ homework.subject }} · {{ homework.cours }} · {{ teacherName }} · {{ 'P' + homework.targetSlotNumber }}</span>
        <div class="title">
          <h3>{{ homework.title }}</h3>
          <span
            v-if="homework.estimatedTime"
            class="estimated-time"
          > {{ formattedEstimatedTime }}</span>
        </div>
      </div>
      <div class="right">
        <WeprodeCheckbox
          v-if="canUpdateStatus"
          v-model="isDone"
          data-test="toggleDoneUndone"
          :label="homework.isDone ? $t('done') : $t('todo')"
          :disabled="isPast"
          :right-display="true"
        />
        <span
          v-else
          v-t="homework.isDone ? 'done' : 'todo'"
        />
        <span class="date">{{ dateLabel }}</span>
      </div>
    </header>

    <CourseContentBlocks :content-blocks="homework.blocks" />
  </article>
</template>

<script>
import { getHomeworkTeacherName } from '@utils/commons.util'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import { setHomeworkDoneStatus } from '@/api/homework.service'
import Pellet from '@/components/Base/Pellet.vue'
import WeprodeCheckbox from '@/components/Base/Weprode/WeprodeCheckbox.vue'

const CourseContentBlocks = defineAsyncComponent(() => import('@components/Course/CourseContentBlocks'))

export default {
  name: 'StudentHomework',
  components: { CourseContentBlocks, Pellet, WeprodeCheckbox },
  props: {
    homework: {
      type: Object,
      required: true
    },
    canUpdateStatus: {
      type: Boolean,
      required: true
    }
  },
  emits: ['change-done-status'],
  computed: {
    dateLabel () {
      let label = this.$t('given', { date: this.givenDate.format('DD MMMM') })
      if (this.givenDate.isBefore(this.modifiedDate)) {
        label += `(${this.$t('modified', { date: this.modifiedDate.format('DD MMMM à HH:mm') })})`
      }

      return label
    },
    givenDate () {
      return dayjs(this.homework.publicationDate, DATE_EXCHANGE_FORMAT)
    },
    isDone: {
      get () {
        return this.homework.isDone
      },
      set (isDone) {
        setHomeworkDoneStatus(this.homework.homeworkId, isDone).then(
          (data) => {
            if (data.success) {
              this.$emit('change-done-status', isDone)
            } else {
              console.error('Cannot update done status')
              this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
            }
          },
          (err) => {
            console.error(err)
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          })
      }
    },
    isPast () {
      return dayjs(this.homework.toDate, DATE_EXCHANGE_FORMAT).isBefore(dayjs())
    },
    modifiedDate () {
      return dayjs(this.homework.modificationDate, DATE_EXCHANGE_FORMAT)
    },
    teacherName () {
      return getHomeworkTeacherName(this.homework)
    },
    formattedEstimatedTime () {
      const nbMinutes = this.homework.estimatedTime
      const nbHour = Math.floor(nbMinutes / 60)
      if (nbHour > 0) {
        return nbHour + this.$t('hourLabel') + nbMinutes % 60
      } else {
        return nbMinutes + ' ' + this.$t('minuteLabel')
      }
    }
  },
  mounted () {
    if (this.$route.query.homeworkId && (this.$route.query.homeworkId === this.homework.homeworkId.toString())) {
      this.$el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.homework {
  position:relative;
  display: flex;
  padding: 1rem 1.5rem;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-self: stretch;

  border-radius: 6px;
  border: 1px solid;
  border-left: 8px solid;

  &.done {
    border: 1px solid $neutral-40;
    padding-left: calc(1.5rem + 7px);
  }
}

.pellet {
  position: absolute;
  right: -8px;
  top: -8px;
  border: 3px solid $neutral-10;

  margin-left: 10px;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left {
  overflow: hidden;
  text-overflow: ellipsis;
}

.subject {
  @extend %font-regular-xs;
}

.title {
  margin-top: 3px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @extend %font-bold-l;

  h3 {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.tag {
  display: flex;
  padding: 0.125rem 0.5rem;
  justify-content: center;
  align-items: center;

  border-radius: 6px;
  background: $neutral-10;

  color: $neutral-80;

  @extend %font-regular-xs;
}

.estimated-time {
  @extend %font-regular-s;
  color: $neutral-80;
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 0.5rem;
  white-space: nowrap;
}

.date {
  text-align: right;

  @extend %font-regular-xs;
}
</style>

<i18n locale="fr">
{
  "done": "Fait",
  "error": "Oups, une erreur est survenue...",
  "given": "Donné le {date}",
  "modified": "modifié le {date}",
  "todo": "À faire",
  "hourLabel": "h",
  "minuteLabel": "minutes"
}
</i18n>
