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
          <label class="date-label">{{ dateLabel }}</label>
        </div>
      </header>

      <section
        v-if="(isInList && hasContent) || (!isInList && canEdit)"
        class="session-content"
        :class="{'phone': mq.phone}"
      >
        <div class="content-title">
          <CustomIcon
            icon-name="icon-seance"
            class="icon theme-text-color"
          />
          <h3>{{ courseTitle }}</h3>
          <CreateButton
            v-if="canEdit && !hasContent && !isInList"
            :aria-label="$t('add')"
            :title="$t('add')"
            @click="openCourseEditModal"
          />
          <div
            v-else-if="canEdit && hasContent"
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

        <SessionContent
          v-if="hasContent"
          :session-content="session.sessionContent"
        />
        <div
          v-else-if="!isInList"
          v-t="'courseContentPlaceholder'"
          class="placeholder"
        />
      </section>

      <section
        v-if="hasHomeworks || (!isInList && canEdit)"
        class="homeworks"
        :class="{'phone': mq.phone}"
      >
        <div
          v-if="!isInList"
          class="content-title"
        >
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

        <div
          v-if="session.toDoHomeworks.length + session.sessionHomeworks.length + session.givenHomeworks.length === 0"
          v-t="'noHomeworksPlaceholder'"
          class="placeholder"
        />
        <HomeworkList
          :homework-type="'toDoHomework'"
          :homework-list="session.toDoHomeworks"
          @update-homework="$emit('update-session')"
        />
        <HomeworkList
          :homework-type="'sessionHomework'"
          :homework-list="session.sessionHomeworks"
          @update-homework="$emit('update-session')"
        />
        <HomeworkList
          :homework-type="'givenHomework'"
          :homework-list="session.givenHomeworks"
          @update-homework="$emit('update-session')"
        />
      </section>
    </div>

    <section
      v-if="canEdit && !isInList"
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
        :is-in-list="isInList"
        @update-session="$emit('update-session')"
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
        class="context-menu-with-padding"
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
import TextContent from '@components/Base/TextContent.vue'
import HomeworkList from '@components/Course/HomeworkList.vue'
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
  emits: ['update-session'],
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
      return (this.session.sessionContent && this.session.sessionContent.title) ? this.session.sessionContent.title : this.$t('courseContent')
    },
    dateLabel () {
      return dayjs(this.session.startDate, 'YYYY-MM-DD HH:mm').format('dddd DD MMMM') + (this.session.slotNumber ? ' - P' + this.session.slotNumber : '')
    },
    listDateLabel () {
      return this.$t('sessionOf') + dayjs(this.session.startDate, 'YYYY-MM-DD HH:mm').format('DD MMMM') + (this.session.slotNumber ? ' - P' + this.session.slotNumber : '')
    },
    eventList () {
      return this.$store.state.course.sessionList
    },
    hasContent () {
      return this.session.sessionContent && (this.session.sessionContent.title !== undefined || (this.session.sessionContent.blocks !== undefined && this.session.sessionContent.blocks.length > 0))
    },
    hasHomeworks () {
      return this.session.toDoHomeworks.length + this.session.sessionHomeworks.length + this.session.givenHomeworks.length > 0
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
  mounted () {
    if (
      this.session &&
      this.isInList &&
      (this.$route.query.toDate === dayjs(this.session.startDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD-HH:mm'))
    ) {
      this.$el.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
          if (!data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
            console.error('Cannot save private notes')
          }
        },
        (err) => {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          console.error(err)
        })
      }, 500)
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
          this.openCourseEditModal()
          break
        case 'delete':
          if (this.isInList) {
            this.$emit('update-session')
          } else {
            this.$store.dispatch('course/deleteSessionContent')
          }
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

.placeholder {
  @extend %content-placeholder;
}
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
      margin-left: 2rem;
      margin-right: 2rem;

      &.phone {
        margin-left: 1rem;
        margin-right: 1rem;
      }
    }

    .first-flex-section {
       gap: 1.5rem;
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
    padding: 1rem 0 0.5rem 0;
    display: block;
    position: sticky;
    top: 0;
    border-radius: 0;
    border-top: 1px solid $neutral-80;
    border-left: 0;
    background-color: $neutral-10;

    h2 {
      margin: 0;
      @extend %font-heading-xs;
      text-transform: uppercase;
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
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    margin: 0;
    //text-transform: uppercase;
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
.homeworks {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.context-menu-with-padding {
  padding: 10px 0;
}
</style>

<i18n locale="fr">
{
  "add": "Ajouter",
  "options": "Options",
  "delete": "Supprimer",
  "draftStatus": "Non publié",
  "edit": "Modifier",
  "error": "Oups, une erreur est survenue...",
  "selectSessionPlaceholder": "Veuillez sélectionner une séance pour accéder à son contenu",
  "noHomeworksPlaceholder": "Aucun travail",
  "sessionOf": "Séance du ",
  "courseContent": "Support de cours",
  "notes": "Note privée",
  "notesPlaceholder": "Ma note privée",
  "publishedOn": "Publié le ",
  "workToDo": "Travaux à faire",
  "courseContentPlaceholder": "Aucun support de cours enregistré"
}
</i18n>
