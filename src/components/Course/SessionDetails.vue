<template>
  <article
    v-if="session"
    class="session-infos"
    :class="{'list': isInList}"
  >
    <div class="first-flex-section">
      <!-- Set 24 to color opacity <=> to add a white background with DD as opacity (FF - DD = 24) -->
      <header
        :class="{'list-header': isInList}"
        :style="isInList ? '' : `background-color: ${session.color}24; border-color: ${session.color};`"
      >
        <h2 v-if="isInList">
          {{ listDateLabel }}
        </h2>
        <div
          v-else
          class="label"
        >
          <label>{{ session.subject }} - {{ session.groupName }}</label>
          <label class="date-label">{{ dateLabel }} P* or room ?</label>
        </div>
      </header>

      <section class="session-content">
        <div class="content-title">
          <CustomIcon
            icon-name="icon-seance"
            class="icon theme-text-color"
          />
          <h3>{{ courseTitle }}</h3>
          <CreateButton
            v-if="canEdit && !hasContent"
            :aria-label="$t('add')"
            :title="$t('add')"
            @click="openCourseEditModal"
          />
          <div
            v-else-if="canEdit"
            class="right"
          >
            <span class="status">{{ formattedStatus }}</span>
            <button
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
        </div>

        <SessionContent :session-content="session.sessionContent" />
      </section>

      <section class="homeworks">
        <div class="content-title">
          <CustomIcon
            icon-name="icon-devoirs"
            class="icon theme-text-color"
          />
          <h3 v-t="'workToDo'" />
          <CreateButton
            v-if="canEdit"
            :aria-label="$t('add')"
            :title="$t('add')"
            @click="openHomeworkEditModal"
          />
        </div>

        <HomeworkList
          :header="$t('toDoHomeworkHeader')"
          :placeholder="$t('toDoHomeworkPlaceholder')"
          :homework-list="session.toDoHomeworks"
        />
        <HomeworkList
          :header="$t('sessionHomeworkHeader')"
          :placeholder="$t('sessionHomeworkPlaceholder')"
          :homework-list="session.sessionHomeworks"
        />
        <HomeworkList
          :header="$t('givenHomeworkHeader')"
          :placeholder="$t('givenHomeworkPlaceholder')"
          :homework-list="session.givenHomeworks"
        />
      </section>
    </div>

    <section
      v-if="session.privateNotes"
      class="notes"
    >
      <h3 v-t="'notes'" />
      <TextContent
        v-model:content="notes"
        class="ck-editor"
        :placeholder="$t('notesPlaceholder')"
      />
    </section>

    <teleport to="body">
      <CourseEditModal
        v-if="isModalDisplayed"
        :edited-session="session"
        @close="isModalDisplayed = false"
      />
      <HomeworkEditModal
        v-if="isHomeworkModalDisplayed"
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
  </article>
  <div
    v-else
    v-t="'selectSessionPlaceholder'"
    class="select-session-placeholder"
  />
</template>

<script>
import CreateButton from '@components/Base/CreateButton.vue'
import CustomIcon from '@components/Base/CustomIcon.vue'
import HomeworkList from '@components/Course/HomeworkList.vue'
import TextContent from '@components/Progression/Edit/Contents/TextContent.vue'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { savePrivateNotes } from '@/api/course.service'
import { icons } from '@/constants/icons'

const CourseEditModal = defineAsyncComponent(() => import('@/components/Course/CourseEditModal'))
const HomeworkEditModal = defineAsyncComponent(() => import('@/components/Course/HomeworkEditModal'))
const SessionContent = defineAsyncComponent(() => import('@/components/Course/SessionContent'))
const ContextMenu = defineAsyncComponent(() => import('@/components/ContextMenu/ContextMenu'))

export default {
  name: 'SessionDetails',
  components: {
    ContextMenu,
    CreateButton,
    CustomIcon,
    TextContent,
    HomeworkList,
    CourseEditModal,
    HomeworkEditModal,
    SessionContent
  },
  inject: ['mq'],
  props: {
    session: {
      type: [Object, undefined],
      default: undefined
    },
    isInList: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isHomeworkModalDisplayed: false,
      isModalDisplayed: false,
      selectedDate: dayjs(),
      selectedEvent: undefined,
      timeout: 0,
      updatedSession: undefined,
      displayMenu: false
    }
  },
  computed: {
    canEdit () {
      return this.$store.state.user.isTeacher
    },
    formattedStatus () {
      if (this.session.sessionContent.isDraft) {
        return this.$t('draftStatus')
      } else {
        return this.$t('publishedOn') + dayjs(this.session.sessionContent.publicationDate).format('DD/MM/YYYY')
      }
    },
    courseTitle () {
      return this.session.sessionContent.title ? this.session.sessionContent.title : this.$t('courseContent')
    },
    dateLabel () {
      return dayjs(this.session.startDate, 'YYYY-MM-DD HH:mm').format('ddd DD/MM')
    },
    listDateLabel () {
      return this.$t('sessionOf') + dayjs(this.session.startDate, 'YYYY-MM-DD HH:mm').format('DD MMMM')
    },
    eventList () {
      return this.$store.state.course.sessionList
    },
    hasContent () {
      return (this.session.sessionContent.title !== undefined || (this.session.sessionContent.blocks !== undefined && this.session.sessionContent.blocks.length > 0))
    },
    notes: {
      get () {
        return this.session.privateNotes
      },
      set (value) {
        if (value !== this.session.privateNotes) {
          this.saveNotes(value)
        }
      }
    }
  },
  methods: {
    openCourseEditModal () {
      this.isModalDisplayed = true
    },
    openHomeworkEditModal () {
      this.isHomeworkModalDisplayed = true
    },
    saveNotes (value) {
      // Trigger a countdown before the search
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        clearTimeout(this.timeout)

        savePrivateNotes(this.session.sessionId, value).then((data) => {
          if (data.success) {
            // TODO update selectedDetails ? / toaster?
          }
        },
        (err) => {
          // TODO toastr
          console.error(err)
        })
      }, 500)
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
          this.openCourseEditModal()
          break
        case 'delete':
          this.$store.dispatch('course/deleteSessionContent')
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

<style lang="scss">
.session-infos {
  .notes {
    .ck-editor {
      p {
        margin: 5px 0;
        line-height: 1.25rem;
      }
    }

    .ck-editor__editable {
      min-height: 8rem;
    }
  }
}
</style>

<style lang="scss" scoped>
@import '@design';

.session-infos {
  display: flex;
  flex-direction: column;
  gap: 70px;

  .first-flex-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &.list {
    .session-content, .homeworks, .notes {
      margin-left: 1.5rem;
    }

    .first-flex-section {
       gap: 1rem;
    }
  }

}

.select-session-placeholder {
  padding-top: 25vh;
  text-align: center;
  @extend %font-bold-l;
}

header {
  display: flex;
  padding: 1rem 1.5rem;
  align-items: center;
  align-self: stretch;

  border-radius: 0.375rem;
  border-left: 8px solid;

  label {
    display: flex;
    flex-direction: column;

    @extend %font-heading-xs;
  }

  &.list-header {
    width: 100%;
    padding: 0 0 8px 0;
    display: block;
    border-radius: 0;
    border-bottom: 1px solid $neutral-40;
    border-left: 0;

    h2 {
      margin: 0;
      @extend %font-bold-l;
    }
  }
}

.date-label {
  text-transform: capitalize;
}

.content-title {
  display: flex;
  align-items: center;
  height: 48px;

  .icon {
    font-size: 1.5rem;
    margin-right: 8px;
  }

  h3 {
    flex: 1;
    margin: 0;
    @extend %font-bold-l;
  }

  .right {
    display: flex;
    align-items: center;
  }

  .status {
    margin: 0 1rem;
    @extend %font-regular-xs
  }
}

.given-homeworks {
  border: 1px black;
}

.notes {
  padding-bottom: 2rem;

  .ck-editor{
    //border: 1px solid rgba(0, 0, 0, 0.15);
    background-color: $neutral-20;
  }

  h3 {
    margin: 0 0 1rem 0;
    @extend %font-heading-xs;
  }
}

.edit-button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
}
</style>

<i18n locale="fr">
{
  "add": "Ajouter",
  "options": "Options",
  "delete": "Supprimer",
  "draftStatus": "Non publié",
  "edit": "Modifier",
  "selectSessionPlaceholder": "Veuillez sélectionner une séance pour accéder à son contenu",
  "toDoHomeworkPlaceholder": "Aucun travail à préparer",
  "toDoHomeworkHeader": "Pour cette séance",
  "givenHomeworkPlaceholder": "Aucun travail donné",
  "givenHomeworkHeader": "Pour une prochaine date",
  "sessionHomeworkPlaceholder": "Aucun travail à faire",
  "sessionHomeworkHeader": "Pendant la séance",
  "sessionOf": "Session du ",
  "courseContent": "SUPPORTS DE COURS",
  "notes": "Note privée",
  "notesPlaceholder": "Ma note privée",
  "publishedOn": "Publié le ",
  "workToDo": "TRAVAUX À FAIRE"
}
</i18n>