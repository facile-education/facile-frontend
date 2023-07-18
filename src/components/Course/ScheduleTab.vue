<template>
  <div class="schedule-tab">
    <DailySchedule
      class="daily-schedule"
    />
    <article
      v-if="session"
      class="session-infos"
    >
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <!-- Set 24 to color opacity <=> to add a white background with DD as opacity (FF - DD = 24) -->
        <header :style="`background-color: ${session.color}24; border-color: ${session.color};`">
          <div>
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
              v-if="!hasContent"
              :aria-label="$t('add')"
              :title="$t('add')"
              @click="openCourseEditModal"
            />
            <button
              v-else
              class="edit-button"
              :aria-label="$t('update')"
              :title="$t('update')"
              @click="openCourseEditModal"
            >
              <img
                height="20"
                width="20"
                :src="require('@/assets/icons/vertical_dots.svg')"
                alt="update"
              >
            </button>
          </div>

          <SessionContent :session="session" />
        </section>

        <section class="homeworks">
          <div class="content-title">
            <CustomIcon
              icon-name="icon-devoirs"
              class="icon theme-text-color"
            />
            <h3 v-t="'workToDo'" />
            <CreateButton
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
            :header="$t('givenHomeworkHeader')"
            :placeholder="$t('givenHomeworkPlaceholder')"
            :homework-list="session.givenHomeworks"
          />
        </section>
      </div>

      <section class="notes">
        <h3 v-t="'notes'" />
        <TextContent
          v-model:content="notes"
          class="ck-editor"
          :placeholder="$t('notesPlaceholder')"
        />
      </section>
    </article>
    <div
      v-else
      v-t="'selectSessionPlaceholder'"
      class="select-session-placeholder"
    />
  </div>

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
</template>

<script>
import CreateButton from '@components/Base/CreateButton.vue'
import CustomIcon from '@components/Base/CustomIcon.vue'
import HomeworkList from '@components/Course/HomeworkList.vue'
import TextContent from '@components/Progression/Edit/Contents/TextContent.vue'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { savePrivateNotes } from '@/api/course.service'
import DailySchedule from '@/components/Course/DailySchedule.vue'

const CourseEditModal = defineAsyncComponent(() => import('@/components/Course/CourseEditModal'))
const HomeworkEditModal = defineAsyncComponent(() => import('@/components/Course/HomeworkEditModal'))
const SessionContent = defineAsyncComponent(() => import('@/components/Course/SessionContent'))

export default {
  name: 'ScheduleTab',
  components: {
    CreateButton,
    CustomIcon,
    TextContent,
    HomeworkList,
    CourseEditModal,
    DailySchedule,
    HomeworkEditModal,
    SessionContent
  },
  inject: ['mq'],
  data () {
    return {
      isHomeworkModalDisplayed: false,
      isModalDisplayed: false,
      selectedDate: dayjs(),
      selectedEvent: undefined,
      timeout: 0,
      updatedSession: undefined
    }
  },
  computed: {
    configuration () {
      return this.$store.state.calendar.configuration
    },
    courseTitle () {
      return this.session.title ? this.session.title : this.$t('courseContent')
    },
    dateLabel () {
      return dayjs(this.session.startDate, 'YYYY-MM-DD HH:mm').format('ddd DD/MM')
    },
    eventList () {
      return this.$store.state.course.sessionList
    },
    hasContent () {
      return (this.session.title !== undefined || (this.session.blocks !== undefined && this.session.blocks.length > 0))
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
    },
    session () {
      return this.$store.state.course.selectedSession
    }
  },
  created () {
    if (!this.configuration) {
      this.$store.dispatch('calendar/getConfiguration')
    }

    if (this.$store.state.documentsProperties === undefined) {
      this.$store.dispatch('documents/getGlobalDocumentsProperties')
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
    }
  }
}
</script>

<style lang="scss">
.schedule-tab {
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

.schedule-tab {
  display: flex;
  gap: 50px;
}

.daily-schedule {
  width: 30%;
}

.session-infos {
  width: 70%;
  height: 800px;
  display: flex;
  flex-direction: column;
  gap: 70px;
}

.select-session-placeholder {
  width: 70%;
  margin-top: 30%;
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

  div {
    display: flex;
    flex-direction: column;

    @extend %font-heading-xs;
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
}

.given-homeworks {
  border: 1px black;
}

.notes {
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
  "update": "Modifier",
  "selectSessionPlaceholder": "Veuillez sélectionner une séance pour accéder à son contenu",
  "toDoHomeworkPlaceholder": "Aucun travail à préparer",
  "toDoHomeworkHeader": "Pour cette séance",
  "givenHomeworkPlaceholder": "Aucun travail donné",
  "givenHomeworkHeader": "Pour une prochaine date",
  "courseContent": "SUPPORTS DE COURS",
  "notes": "Note privée",
  "notesPlaceholder": "Ma note privée",
  "workToDo": "TRAVAUX À FAIRE"
}
</i18n>
