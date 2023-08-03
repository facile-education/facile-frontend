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
        <PentilaCheckbox
          v-model="isDone"
          :label="homework.isDone ? $t('done') : $t('todo')"
          :disabled="isPast"
          :right-display="true"
        />
        <span class="date">{{ dateLabel }}</span>
      </div>
    </header>

    <Content
      v-for="block in homework.blocks"
      :key="block.contentId"
      v-model="block.contentValue"
      :content="block"
    />
  </article>
</template>

<script>
import { getHomeworkTeacherName } from '@utils/commons.util'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { setHomeworkDoneStatus } from '@/api/homework.service'
import Pellet from '@/components/Base/Pellet.vue'

const Content = defineAsyncComponent(() => import('@/components/Course/Content'))

export default {
  name: 'StudentHomework',
  components: { Content, Pellet },
  props: {
    homework: {
      type: Object,
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
      return dayjs(this.homework.publicationDate, 'YYYY-MM-DD HH:mm')
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
      return dayjs(this.homework.toDate, 'YYYY-MM-DD HH:mm').isBefore(dayjs())
    },
    modifiedDate () {
      return dayjs(this.homework.modificationDate, 'YYYY-MM-DD HH:mm')
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

  @extend %dashboard-header-pellet;
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
