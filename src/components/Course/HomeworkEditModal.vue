<template>
  <PentilaWindow
    class="edit-homework-modal"
    :modal="true"
    :draggable="true"
    @close="onClose"
  >
    <template #header>
      <span v-t="'title'" />
    </template>

    <template #body>
      <section class="left">
        <PentilaInput
          v-model="homework.title"
          :placeholder="$t('homeworkTitle')"
        />
        <div class="dropdowns">
          <div class="type">
            <!-- Homework type menu -->
            <label>{{ $t('homeworkType') }}</label>
            <PentilaDropdown
              v-model="homework.homeworkType"
              :list="homeworkTypes"
              :sort="false"
              display-field="name"
            />
          </div>
          <div class="duration">
            <!-- Homework duration -->
            <label>{{ $t('duration') }}</label>
            <PentilaDropdown
              v-model="homework.homeworkDuration"
              :list="homeworkDurations"
              :sort="false"
              display-field="label"
            />
          </div>
        </div>
        <Content
          v-for="block in homework.blocks"
          :key="block.contentId"
          v-model="block.contentValue"
          :content="block"
          :is-edition="true"
        />
        <ContentPicker @add="addContent" />
      </section>
      <section class="right side">
        <PentilaButton
          v-t="'preview'"
          @click="preview"
        />
        <a
          href="#"
          @click="openStudentModal"
        >
          <span
            v-if="homework.isWholeClass"
            v-t="'allStudents'"
          />
          <span
            v-else
            v-t="{ path: 'someStudents', args: { count: homework.selectedStudents.length, total: availableStudents.length } }"
          />
        </a>
        <PentilaRadioButton
          v-model="homework.dateType"
          :label="$t('sessionDate')"
          name="date"
          rb-value="session"
          class="radio"
        />
        <PentilaRadioButton
          v-model="homework.dateType"
          :label="$t('futureDate')"
          name="date"
          rb-value="custom"
          class="radio"
        />
        <PentilaDropdown
          v-model="homework.date"
          :list="nextSessions"
          :sort="false"
          display-field="startDate"
          :disabled="homework.dateType === 'session'"
          @update:model-value="updateTarget"
        />
      </section>
    </template>

    <template #footer>
      <PentilaButton
        v-t="'draft'"
        @click="save(true)"
      />
      <PentilaButton
        v-t="'post'"
        @click="save()"
      />
    </template>
  </PentilaWindow>
  <teleport to="body">
    <StudentListModal
      v-if="displayStudentModal"
      :students="availableStudents"
      @close="onUpdateStudents"
    />
  </teleport>
</template>

<script>
import dayjs from 'dayjs'
import PentilaUtils from 'pentila-utils'
import { defineAsyncComponent } from 'vue'

import { getSessionStudents } from '@/api/course.service'
import { createHomework, updateHomework } from '@/api/homework.service'
import { getNextSessions } from '@/api/schedule.service'
import Content from '@/components/Course/Content.vue'
import ContentPicker from '@/components/Course/ContentPicker.vue'

const StudentListModal = defineAsyncComponent(() => import('@/components/Progression/Assignment/StudentListModal'))

export default {
  name: 'CourseEditModal',
  components: {
    Content,
    ContentPicker,
    StudentListModal
  },
  props: {
    editedHomework: {
      type: Object,
      default: () => { return {} }
    }
  },
  emits: ['close', 'update:modelValue'],
  data () {
    return {
      availableStudents: [],
      displayStudentModal: false,
      homework: {
        blocks: [{ contentId: -1, contentName: '', contentType: 1, contentValue: '' }],
        date: undefined,
        dateType: 'custom',
        homeworkType: undefined,
        homeworkDuration: undefined,
        isWholeClass: true,
        selectedStudents: [],
        toDate: undefined,
        targetSessionId: 0,
        title: ''
      },
      homeworkTypes: [
        { type: 1, name: 'Consigne simple' },
        // { type: 2, name: 'Doc. à compléter' },
        { type: 3, name: 'Doc. à rendre' }
      ],
      homeworkDurations: [
        { label: '15 min', time: '15' },
        { label: '30 min', time: '30' },
        { label: '45 min', time: '45' },
        { label: '1h', time: '60' },
        { label: '1h15', time: '75' },
        { label: '1h30', time: '90' }
      ],
      nextSessions: []
    }
  },
  computed: {
    courseId () {
      return this.$store.state.course.selectedSession.groupId
    },
    isCreation () {
      return this.editedHomework.homeworkId === undefined
    },
    sessionId () {
      return this.$store.state.course.selectedSession.sessionId
    }
  },
  created () {
    // this.$store.dispatch('misc/incrementModalCount')
    if (!this.isCreation) {
      this.homework = PentilaUtils.JSON.deepCopy(this.editedHomework)
      this.homework.dateType = 'custom'
      console.log(this.homework)
    }

    getSessionStudents(this.courseId).then((data) => {
      if (data.success) {
        console.log('students', data)
        this.availableStudents = data.students
      }
    },
    (err) => {
      // TODO toastr
      console.error(err)
    })

    getNextSessions(this.sessionId, dayjs().format('YYYY-MM-DD HH:mm')).then((data) => {
      if (data.success) {
        this.nextSessions = data.nextSessions

        if (!this.isCreation) {
          console.log(this.homework.targetSessionId, this.homework.toDate)
          if (this.homework.targetSessionId !== undefined) {
            this.nextSessions.forEach(session => {
              if (session.sessionId === this.homework.targetSessionId) {
                this.homework.date = session
              }
            })
          }
        } else {
          this.homework.date = this.nextSessions[0]
          this.updateTarget(this.nextSessions[0])
        }
      }
    },
    (err) => {
      // TODO toastr
      console.error(err)
    })
  },
  methods: {
    addContent (content) {
      content.contentId = -1
      this.homework.blocks.push(content)
    },
    onClose () {
      // this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    },
    onUpdateStudents (students, isWholeClass) {
      this.displayStudentModal = false
      // If specific students, keep the selected ones
      this.homework.selectedStudents.length = 0
      if (!isWholeClass) {
        for (let idx = 0; idx < students.length; ++idx) {
          if (students[idx].isSelected) {
            this.homework.selectedStudents.push(students[idx])
          }
        }
      }
      this.homework.isWholeClass = (isWholeClass || this.homework.selectedStudents.length === 0)
    },
    openStudentModal () {
      this.displayStudentModal = true
    },
    preview () {
      console.log('todo')
    },
    save (isDraft = false) {
      if (this.isCreation) {
        createHomework(this.courseId, this.sessionId, this.homework, dayjs(), isDraft).then((data) => {
          if (data.success) {
            this.$store.dispatch('course/updateSessionDetails')
            this.onClose()
          }
        },
        (err) => {
          // TODO toastr
          console.error(err)
        })
      } else {
        updateHomework(this.homework, dayjs(), isDraft).then((data) => {
          if (data.success) {
            this.$store.dispatch('course/updateSessionDetails')
            this.onClose()
          }
        },
        (err) => {
          // TODO toastr
          console.error(err)
        })
      }
    },
    updateTarget (value) {
      // TODO date libre
      this.homework.targetSessionId = value.sessionId
      this.homework.toDate = value.startDate
    }
  }
}
</script>

<style lang="scss">
.edit-homework-modal .window-body {
  display: flex;
  padding: 1.5rem 0rem;
  align-items: flex-start;
  gap: 2rem;
  align-self: stretch;
}
</style>

<style lang="scss" scoped>
@import '@design';

.left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1 0 0;
}

.right {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 19rem;
  padding: 1.5rem;
  align-items: flex-start;
  align-self: stretch;

  border-radius: 0.375rem;
  background: $neutral-20;
}

.dropdowns {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  align-self: stretch;
}

.type, .duration {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;

  .base-dropdown {
    width: 100%;
  }
}

.type {
  flex: 1 0 0;
}

.duration {
  width: 16rem;
}
</style>

<i18n locale="fr">
  {
    "allStudents": "Pour tous les élèves",
    "draft": "Brouillon",
    "duration": "Durée",
    "homeworkTitle": "Titre du travail",
    "homeworkType": "Type de travail",
    "futureDate": "À faire pour le ",
    "post": "Publier",
    "preview": "Aperçu",
    "sessionDate": "À faire pendant la séance",
    "someStudents": "Pour un élève sur {total} | Pour {count} élèves sur {total}",
    "title": "Travail à faire"
  }
</i18n>
