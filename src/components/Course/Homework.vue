<template>
  <article class="homework">
    <header class="title">
      <div
        style="overflow: hidden;
        text-overflow: ellipsis;"
      >
        <div class="header-first-line">
          <h3>{{ homework.title }}</h3>
          <span
            v-if="homework.estimatedTime "
            class="estimated-time"
          >{{ formattedEstimatedTime }}</span>
        </div>
        <span
          v-if="homework.doneStudents"
          class="nb-done theme-text-color"
        >
          {{ formattedDoneStatus }}
        </span>
      </div>
      <div class="right">
        <span class="status">{{ formattedStatus }}</span>
        <button
          v-if="canEdit"
          class="edit-button"
          :aria-label="$t('options')"
          :title="$t('options')"
          @click="toggleContextMenu"
        >
          <img
            height="20"
            width="20"
            :src="require('@/assets/icons/vertical_dots.svg')"
            alt="options"
          >
        </button>
      </div>
    </header>
    <Content
      v-for="block in homework.blocks"
      :key="block.contentId"
      v-model="block.contentValue"
      class="content"
      :content="block"
    />
  </article>
  <teleport to="body">
    <HomeworkEditModal
      v-if="isHomeworkModalDisplayed"
      :edited-homework="homework"
      @close="isHomeworkModalDisplayed = false"
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
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { deleteHomework } from '@/api/homework.service'
import { icons } from '@/constants/icons'

const Content = defineAsyncComponent(() => import('@/components/Course/Content'))
const HomeworkEditModal = defineAsyncComponent(() => import('@/components/Course/HomeworkEditModal'))
const ContextMenu = defineAsyncComponent(() => import('@/components/ContextMenu/ContextMenu'))

export default {
  name: 'Homework',
  components: { ContextMenu, Content, HomeworkEditModal },
  props: {
    homework: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isHomeworkModalDisplayed: false,
      displayMenu: false
    }
  },
  computed: {
    canEdit () {
      return this.$store.state.user.isTeacher
    },
    formattedStatus () {
      if (this.homework.isDraft) {
        return this.$t('draftStatus')
      } else {
        return this.$t('publishedOn') + dayjs(this.homework.publicationDate).format('DD/MM/YYYY')
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
    formattedDoneStatus () {
      return this.$t('doneStatus', { nbDone: this.homework.doneStudents.length, nbStudents: this.homework.selectedStudents.length })
    }
  },
  methods: {
    openHomeworkEditModal () {
      this.isHomeworkModalDisplayed = true
    },
    toggleContextMenu (event) {
      this.displayMenu = true
      this.$store.dispatch('contextMenu/openContextMenu', {
        event: event,
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
  }

  button {
    margin: 0;
    padding: 0;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
}
</style>

<i18n locale="fr">
{
  "delete": "Supprimer",
  "doneStatus": "Réalisé par {nbDone} élèves sur {nbStudents}",
  "edit": "Modifier",
  "hourLabel": "h",
  "minuteLabel": "min",
  "publishedOn": "Publié le ",
  "draftStatus": "Non publié"
}
</i18n>
