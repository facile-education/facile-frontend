<template>
  <div
    class="homework"
    :style="`border-color: ${homework.color}; background-color: ${homework.color}22;`"
  >
    <Pellet
      v-if="!homework.isDone && !isPast"
      class="pellet"
    />
    <header>
      <section class="left">
        <span class="subject">{{ homework.subject }} · {{ homework.cours }} · {{ teacherName }}</span>
        <span class="title">
          {{ homework.title }}
          <!-- <span class="tag">{{ homework.tag }}</span> -->
        </span>
      </section>
      <section class="right">
        <PentilaCheckbox
          v-model="isDone"
          :label="homework.isDone ? $t('done') : $t('todo')"
          :disabled="isPast"
        />
        <span class="date">{{ dateLabel }}</span>
      </section>
    </header>

    <Content
      v-for="block in homework.blocks"
      :key="block.contentId"
      v-model="block.contentValue"
      :content="block"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

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
        this.$store.dispatch('course/setHomeworkDone', { homeworkId: this.homework.homeworkId, isDone })
      }
    },
    isPast () {
      return dayjs(this.homework.toDate, 'YYYY-MM-DD HH:mm').isBefore(dayjs())
    },
    modifiedDate () {
      return dayjs(this.homework.modificationDate, 'YYYY-MM-DD HH:mm')
    },
    teacherName () {
      return this.homework.teacher !== undefined ? this.homework.teacher.firstName.substring(0, 1) + '. ' + this.homework.teacher.lastName : ''
    }
  },
  methods: {
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
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;

  border-radius: 6px;
  border-left: 8px solid;
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
  gap: 1rem;
  align-self: stretch;
}

.left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1875rem;
  flex: 1 0 0;
}

.subject {
  @extend %font-regular-xs;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @extend %font-bold-l;
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

.right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 0.5rem;
}

.date {
  text-align: right;

  @extend %font-regular-xs;
}
</style>

<i18n locale="fr">
{
  done: "Fait",
  given: "Donné le {date}",
  modified: "modifié le {date}",
  todo: "À faire"
}
</i18n>
