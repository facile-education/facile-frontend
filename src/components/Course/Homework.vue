<template>
  <article class="homework">
    <header class="title">
      <div
        style="overflow: hidden;
        text-overflow: ellipsis;"
      >
        <div
          v-if="homeworkType"
          class="homework-type-label"
        >
          <CustomIcon
            icon-name="icon-devoirs"
            class="icon-homework theme-text-color"
          />
          {{ homeworkType === 'givenHomework' ? $t('givenHomework', {targetDate: formattedToDate}) : $t(homeworkType) }}
        </div>
        <div class="header-first-line">
          <h3>{{ homework.title }}</h3>
          <span
            v-if="homework.estimatedTime "
            class="estimated-time"
          >{{ formattedEstimatedTime }}</span>
        </div>
        <button
          v-if="homework.doneStudents"
          class="nb-done theme-text-color"
          @click="isDoneInfoModalDisplayed = true"
        >
          {{ formattedDoneStatus }}
        </button>
      </div>
      <div class="right">
        <span
          class="status"
          :class="{'italic': status !== 'published'}"
          :title="status === 'scheduled' ? formattedFuturePublicationDate : ''"
        >{{ formattedStatus }}</span>
        <button
          v-if="canEdit"
          class="edit-button"
          :aria-label="$t('options')"
          :title="$t('options')"
          @click="toggleContextMenu"
        >
          <img
            height="16"
            width="16"
            :src="require('@/assets/icons/vertical_dots.svg')"
            alt="options"
          >
        </button>
      </div>
    </header>
    <CourseContentBlocks
      :content-blocks="homework.blocks"
      class="content"
    />
  </article>
  <teleport
    v-if="isHomeworkModalDisplayed || isDoneInfoModalDisplayed"
    to="body"
  >
    <HomeworkEditModal
      v-if="isHomeworkModalDisplayed"
      :edited-homework="homework"
      :is-in-list="isInList"
      @update-homework="$emit('update-homework')"
      @close="isHomeworkModalDisplayed = false"
    />

    <DoneInfoModal
      v-if="isDoneInfoModalDisplayed"
      :homework="homework"
      @close="isDoneInfoModalDisplayed = false"
    />
  </teleport>
  <teleport
    v-if="displayMenu"
    to="body"
  >
    <ContextMenu
      @choose-option="performChosenOption"
      @close="displayMenu=false"
    />
  </teleport>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { deleteHomework } from '@/api/homework.service'
import { icons } from '@/constants/icons'

const CourseContentBlocks = defineAsyncComponent(() => import('@components/Course/CourseContentBlocks'))
const HomeworkEditModal = defineAsyncComponent(() => import('@/components/Course/HomeworkEditModal'))
const DoneInfoModal = defineAsyncComponent(() => import('@/components/Course/DoneInfoModal'))
const ContextMenu = defineAsyncComponent(() => import('@/components/ContextMenu/ContextMenu'))

export default {
  name: 'Homework',
  components: { CourseContentBlocks, CustomIcon, ContextMenu, HomeworkEditModal, DoneInfoModal },
  props: {
    homework: {
      type: Object,
      required: true
    },
    homeworkType: {
      type: String,
      required: true
    },
    isInList: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update-homework'],
  data () {
    return {
      isHomeworkModalDisplayed: false,
      displayMenu: false,
      isDoneInfoModalDisplayed: false
    }
  },
  computed: {
    canEdit () {
      return this.$store.state.user.isTeacher
    },
    status () {
      const publicationDate = dayjs(this.homework.publicationDate, 'YYYY-MM-DD HH:mm')
      if (this.homework.isDraft) {
        return 'draft'
      } else if (publicationDate.isAfter(dayjs())) {
        return 'scheduled'
      } else {
        return 'published'
      }
    },
    formattedStatus () {
      const publicationDate = dayjs(this.homework.publicationDate, 'YYYY-MM-DD HH:mm')
      if (this.homework.isDraft) {
        return this.$t('draftStatus')
      } else if (publicationDate.isAfter(dayjs())) {
        return this.$t('scheduled')
      } else {
        return this.$t('publishedOn') + publicationDate.format('DD/MM/YYYY')
      }
    },
    formattedEstimatedTime () {
      const nbMinutes = this.homework.estimatedTime
      const nbHour = Math.floor(nbMinutes / 60)
      if (nbHour > 0) {
        return nbHour + this.$t('hourLabel') + nbMinutes % 60
      } else {
        return nbMinutes + ' ' + this.$t('minuteLabel')
      }
    },
    formattedToDate () {
      return dayjs(this.homework.toDate, 'YYYY-MM-DD HH:mm').format('DD/MM')
    },
    formattedFuturePublicationDate () {
      return dayjs(this.homework.publicationDate, 'YYYY-MM-DD HH:mm').format('[' + this.$t('scheduledOn') + '] YYYY-MM-DD [' + this.$t('at') + '] HH:mm')
    },
    formattedDoneStatus () {
      return this.$tc('doneStatus', { nbDone: this.homework.doneStudents.length, nbStudents: this.homework.selectedStudents.length })
    }
  },
  methods: {
    openHomeworkEditModal () {
      this.isHomeworkModalDisplayed = true
    },
    toggleContextMenu (event) {
      this.displayMenu = true
      this.$store.dispatch('contextMenu/openContextMenu', {
        event,
        options: [
          {
            name: 'edit',
            title: this.$t('edit'),
            icon: icons.options.rename,
            position: 1,
            hasSeparator: false
          },
          {
            name: 'delete',
            title: this.$t('delete'),
            icon: icons.options.delete,
            position: 2,
            hasSeparator: false
          }]
      })
    },
    performChosenOption (option) {
      switch (option.name) {
        case 'edit':
          this.openHomeworkEditModal()
          break
        case 'delete':
          deleteHomework(this.homework.homeworkId).then((data) => {
            if (data.success) {
              if (this.isInList) {
                this.$emit('update-homework')
              }
              this.$store.dispatch('course/updateSessionDetails')
            }
          })
          break
        default:
          console.error('no option with name ' + option.name + ' exists')
      }
      this.displayMenu = false
      this.$store.dispatch('contextMenu/closeMenus')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.homework {
  display: flex;
  padding: 1rem;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;

  border-radius: 0.375rem;
  border: 1px solid $neutral-40;
  background: $neutral-10;
}

header {
  display: flex;
  align-items: center;
  align-content: flex-start;
  gap: 1rem 0.25rem;
  align-self: stretch;
  flex-wrap: wrap;
}

.content {
  width: 100%;
}

.homework-type-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 3px;
  @extend %font-regular-s;

  .icon-homework {
    font-size: 1rem;
  }
}

.header-first-line {
  display: flex;
  align-items: center;
  gap: 8px;

  .estimated-time {
    color: $neutral-80;
    @extend %font-regular-s;
  }
}

.nb-done {
  @extend %font-bold-s;
}

h3 {
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  @extend %font-bold-l;
}

.right {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;

  .status {
    @extend %font-regular-xs;

    &.italic {
      font-style: italic;
    }
  }
}

button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
}
</style>

<i18n locale="fr">
{
  "at": "à",
  "delete": "Supprimer",
  "doneStatus": "Réalisé par {nbDone} élève sur {nbStudents} | Réalisé par {nbDone} élève sur {nbStudents} | Réalisé par {nbDone} élèves sur {nbStudents}",
  "edit": "Modifier",
  "hourLabel": "h",
  "minuteLabel": "min",
  "publishedOn": "Publié le ",
  "draftStatus": "Brouillon",
  "toDoHomework": "À faire pour cette séance",
  "sessionHomework": "À faire pendant la séance",
  "scheduled": "Programmé",
  "scheduledOn": "Programmé le",
  "givenHomework": "Pour le {targetDate}"
}
</i18n>
