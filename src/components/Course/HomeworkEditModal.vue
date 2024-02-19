<template>
  <WeprodeWindow
    class="edit-homework-modal"
    :class="{'phone': mq.phone|| mq.tablet}"
    :modal="true"
    :draggable="true"
    :full-screen="mq.phone || mq.tablet"
    @close="confirmClosure"
  >
    <template #header>
      <span v-t="isCreation ? 'creationTitle' : 'updateTitle'" />
    </template>

    <template #body>
      <section class="left">
        <div class="title">
          <WeprodeInput
            ref="titleInput"
            v-model="homework.title"
            :maxlength="250"
            :placeholder="$t('homeworkTitle')"
          />
          <WeprodeErrorMessage :error-message="formErrorList" />
        </div>
        <div class="dropdowns">
          <div class="type">
            <!-- Homework type menu -->
            <label>{{ $t('homeworkType') }}</label>
            <WeprodeDropdown
              v-model="homework.homeworkType"
              :list="homeworkTypes"
              :sort="false"
              display-field="name"
            />
          </div>
          <div class="duration">
            <!-- Homework duration -->
            <label>{{ $t('duration') }}</label>
            <WeprodeDropdown
              v-model="homework.homeworkDuration"
              :list="homeworkDurations"
              :placeholder="$t('select')"
              :sort="false"
              :filtered="false"
              display-field="label"
            />
          </div>
        </div>
        <CourseContentItem
          v-for="(block, index) in homework.blocks"
          :key="block.contentId"
          v-model="block.contentValue"
          :content="block"
          :is-edition="true"
          :data-test="'contentItem_'+index"
          :focus-on-creation="isCreation && !block.placeholder"
          @delete="deleteContent(index)"
        />
        <ContentPicker @add="addContent" />
      </section>
      <section class="right">
        <button
          class="work-load-button"
          @click="displayWorkLoadModal = true"
        >
          <img
            src="@/assets/icons/stats.svg"
            alt=""
          >
          <span v-t="'workLoad'" />
        </button>
        <div class="target-students">
          <label v-t="'for'" />
          <button
            class="target-students-button"
            @click="openStudentModal"
          >
            <span v-t="homework.isWholeClass ? 'allStudents' : { path: 'someStudents', args: { count: homework.selectedStudents.length, total: availableStudents.length } }" />
            <img
              src="@assets/icons/chevron_right2.svg"
              alt=""
            >
          </button>
        </div>

        <div class="target-session">
          <WeprodeRadioButton
            v-model="homework.dateType"
            :label="$t('sessionDate')"
            :disabled="isInList"
            name="date"
            rb-value="session"
            class="radio"
            @update:model-value="updateTarget({sessionId: selectedSession.sessionId, startDate: selectedSession.startDate})"
          />
          <WeprodeRadioButton
            v-model="homework.dateType"
            :label="$t('futureDate')"
            name="date"
            :disabled="nextSessions.length===0 || (homework.dateType === 'session' && isInList)"
            rb-value="custom"
            class="radio future-date"
          />
          <WeprodeDropdown
            v-if="nextSessions.length > 0"
            v-model="homework.date"
            :list="nextSessions"
            :sort="false"
            class="next-sessions-dropdown"
            display-field="formattedStartDate"
            :disabled="homework.dateType === 'session'"
            @update:model-value="updateTarget"
          />
        </div>
      </section>
    </template>

    <template #footer>
      <div :class="mq.phone || mq.tablet ? 'footer-phone' : 'footer-desktop'">
        <div
          v-if="isScheduled"
          class="update-scheduled-date"
        >
          <span v-t="'scheduledOn'" />
          <CustomDatePicker
            v-if="selectedTargetDate"
            v-model:selected-date="publicationDate"
            :min-date="minDate"
            :max-date="selectedTargetDate.toDate()"
            :with-hours="true"
            :is-required="true"
            :minute-increment="15"
          />
        </div>

        <WeprodeDropdownButton
          :options="publicationOptions"
          :initial-option="initialPublicationOption"
          @click="handlePublishOption"
        />
      </div>
    </template>
  </WeprodeWindow>
  <teleport
    v-if="displayStudentModal || displayWorkLoadModal || displayPublicationDateModal"
    to="body"
  >
    <StudentListModal
      v-if="displayStudentModal"
      :student-list="availableStudents"
      :initial-state="{isWholeClass: homework.isWholeClass, selectedStudents: homework.selectedStudents}"
      @close="onUpdateStudents"
    />
    <WorkLoadModal
      v-if="displayWorkLoadModal"
      :course-id="courseId"
      :course-name="courseName"
      :selected-students="homework.isWholeClass ? [] : homework.selectedStudents"
      :homework-date="selectedTargetDate"
      @close="displayWorkLoadModal = false"
    />
    <ChoosePublicationDateModal
      v-if="displayPublicationDateModal"
      :initial-date="publicationDate"
      :limit-date="selectedTargetDate"
      @choose-date="schedulePublication"
      @close="displayPublicationDateModal = false"
    />
  </teleport>
</template>

<script>
import WeprodeDropdownButton from '@components/Base/Weprode/WeprodeDropdownButton.vue'
import WeprodeUtils from '@utils/weprode.utils'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import dayjs from 'dayjs'
import { defineAsyncComponent, nextTick } from 'vue'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import { getSessionStudents } from '@/api/course.service'
import { createHomework, updateHomework } from '@/api/homework.service'
import { getNextSessions } from '@/api/schedule.service'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeRadioButton from '@/components/Base/Weprode/WeprodeRadioButton.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import ContentPicker from '@/components/Course/ContentPicker.vue'
import contentTypeConstants from '@/constants/contentTypeConstants'

const StudentListModal = defineAsyncComponent(() => import('@components/Course/StudentListModal.vue'))
const WorkLoadModal = defineAsyncComponent(() => import('@components/Course/WorkLoad/WorkLoadModal.vue'))
const CustomDatePicker = defineAsyncComponent(() => import('@components/Base/CustomDatePicker.vue'))
const ChoosePublicationDateModal = defineAsyncComponent(() => import('@components/Course/ChoosePublicationDateModal.vue'))
const CourseContentItem = defineAsyncComponent(() => import('@components/Course/CourseContentItem'))

export default {
  name: 'HomeworkEditModal',
  components: {
    CustomDatePicker,
    ChoosePublicationDateModal,
    WeprodeDropdownButton,
    WorkLoadModal,
    CourseContentItem,
    ContentPicker,
    StudentListModal,
    WeprodeDropdown,
    WeprodeErrorMessage,
    WeprodeInput,
    WeprodeRadioButton,
    WeprodeWindow
  },
  inject: ['mq'],
  props: {
    editedHomework: {
      type: Object,
      default: undefined
    },
    isInList: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'update-homework'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    homework: {
      title: { required }
    }
  },
  data () {
    return {
      availableStudents: [],
      displayStudentModal: false,
      displayWorkLoadModal: false,
      displayPublicationDateModal: false,
      initialPublicationOption: undefined,
      homework: {
        blocks: [{ contentId: -1, contentName: '', contentType: 1, contentValue: '', placeholder: this.$t('instructions') }],
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
      initialForm: undefined,
      homeworkTypes: [
        { type: contentTypeConstants.TYPE_HOMEWORK_BASIC_INSTRUCTION, name: this.$t('basicInstruction') }
        // { type: contentTypeConstants.TYPE_HOMEWORK_DOC_TO_COMPLETE, name: this.$t('docToComplete') },
        // { type: contentTypeConstants.TYPE_HOMEWORK_DOC_TO_RETURN, name: this.$t('docToReturn') }
      ],
      homeworkDurations: [
        { label: '15 min', time: '15' },
        { label: '30 min', time: '30' },
        { label: '45 min', time: '45' },
        { label: '1h', time: '60' },
        { label: '1h15', time: '75' },
        { label: '1h30', time: '90' }
      ],
      nextSessions: [],
      publicationDate: dayjs(),
      publicationOptions: [
        {
          name: 'publish',
          title: this.$t('publish')
        },
        {
          name: 'setPublishDate',
          title: this.$t('setPublishDate')
        },
        {
          name: 'publishLater',
          title: this.$t('publishLater')
        }
      ]
    }
  },
  computed: {
    formErrorList () {
      const form = this.v$.homework.title
      if (form.$invalid && form.$dirty) {
        return this.$t('required')
      } else {
        return ''
      }
    },
    isCreation () {
      return this.editedHomework === undefined
    },
    isScheduled () {
      return this.publicationDate.isAfter(dayjs()) && !this.homework.isDraft
    },
    selectedSession () {
      return this.isInList ? undefined : this.$store.state.course.selectedSession
    },
    courseId () {
      return this.isCreation ? this.selectedSession.groupId : this.editedHomework.courseId
    },
    courseName () {
      return this.isCreation ? this.selectedSession.groupName : this.editedHomework.cours
    },
    selectedTargetDate () {
      return this.homework.toDate ? dayjs(this.homework.toDate, DATE_EXCHANGE_FORMAT) : undefined
    },
    configuration () {
      return this.$store.state.calendar.configuration
    },
    minDate () {
      return dayjs().startOf('day').toDate()
    }
  },
  created () {
    if (!this.isCreation) {
      this.homework = WeprodeUtils.deepCopy(this.editedHomework)
      this.publicationOptions[1].title = this.$t('schedule')
      this.initHomeworkType()
      this.initEstimatedTimeDropdown()
      this.initPublicationOption()
    } else {
      this.publicationDate = dayjs()
      this.initialPublicationOption = this.publicationOptions[0]
    }

    this.getSessionStudents()

    this.getNextSessions()
  },
  mounted () {
    if (this.isCreation) {
      const vm = this
      nextTick(function () {
        vm.$refs.titleInput.focus()
      })
    }
  },
  methods: {
    initHomeworkType () {
      if (this.homework.targetSessionId === this.homework.sourceSessionId) {
        this.homework.dateType = 'session'
      } else {
        this.homework.dateType = 'custom'
      }
    },
    initEstimatedTimeDropdown () {
      if (this.homework.estimatedTime) {
        const index = this.homeworkDurations.map(object => object.time).indexOf(this.homework.estimatedTime.toString())
        if (index !== -1) {
          this.homework.homeworkDuration = this.homeworkDurations[index]
        } else {
          console.error('cannot init estimate duration')
        }
      }
    },
    initPublicationOption () {
      this.publicationDate = dayjs(this.homework.publicationDate, DATE_EXCHANGE_FORMAT)

      if (this.homework.isDraft) {
        this.initialPublicationOption = this.publicationOptions[2]
      } else if (this.publicationDate.isAfter(dayjs())) {
        this.initialPublicationOption = this.publicationOptions[1]
        if (!this.configuration) {
          this.$store.dispatch('calendar/getConfiguration')
        }
      } else {
        this.initialPublicationOption = this.publicationOptions[0]
      }
    },
    addContent (content) {
      content.contentId = -1
      this.homework.blocks.push(content)
    },
    deleteContent (index) {
      this.homework.blocks.splice(index, 1)
    },
    onUpdateStudents (isWholeClass, selectedStudents) {
      this.displayStudentModal = false

      this.homework.isWholeClass = isWholeClass
      this.homework.selectedStudents = selectedStudents
    },
    openStudentModal () {
      this.displayStudentModal = true
    },
    preview () {
      console.log('todo')
    },
    handlePublishOption (optionClicked) {
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        switch (optionClicked.name) {
          case 'publish':
            this.publicationDate = dayjs()
            this.save()
            break
          case 'setPublishDate':
            if (this.isScheduled) {
              this.save()
            } else {
              this.displayPublicationDateModal = true
            }
            break
          case 'publishLater':
            this.publicationDate = dayjs()
            this.save(true)
            break
          default:
            console.error('unknown option', optionClicked)
        }
      }
    },
    schedulePublication (date) {
      this.publicationDate = date
      this.save()
    },
    save (isDraft = false) {
      // Remove empty text blocks
      this.homework.blocks = this.homework.blocks.filter(block => block.contentType !== contentTypeConstants.TYPE_TEXT_CONTENT || block.contentValue !== '')

      if (this.isCreation) {
        createHomework(this.courseId, this.selectedSession.sessionId, this.homework, this.publicationDate, isDraft).then((data) => {
          if (data.success) {
            this.$store.dispatch('course/updateSessionDetails')
            this.onClose()
          } else {
            console.error('Cannot create homework')
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          }
        }, (err) => {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          console.error(err)
        })
      } else {
        updateHomework(this.homework, this.publicationDate, isDraft).then((data) => {
          if (data.success) {
            if (this.isInList) {
              this.$emit('update-homework')
            }
            this.$store.dispatch('course/updateSessionDetails')
            this.onClose()
          } else {
            console.error('Cannot update homework')
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          }
        }, (err) => {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          console.error(err)
        })
      }
    },
    getSessionStudents () {
      getSessionStudents(this.courseId).then((data) => {
        if (data.success) {
          this.availableStudents = data.students
        } else {
          this.availableStudents = []
          console.error('Cannot retrieve student list')
        }
      }, (err) => {
        this.availableStudents = []
        console.error(err)
      })
    },
    getNextSessions () {
      getNextSessions(this.isCreation ? this.selectedSession.sessionId : this.homework.sourceSessionId).then((data) => {
        if (data.success) {
          this.nextSessions = data.nextSessions
          this.nextSessions.forEach(session => {
            session.formattedStartDate = dayjs(session.startDate).format('dddd DD MMM YYYY à HH:mm')

            if (!this.isCreation && this.homework.targetSessionId !== undefined && session.sessionId === this.homework.targetSessionId) {
              this.homework.date = session
            }
          })

          if (this.isCreation && this.nextSessions.length > 0) {
            this.homework.date = this.nextSessions[0]
            this.updateTarget(this.nextSessions[0])
          } else if (this.isCreation) {
            this.homework.dateType = 'session'
            this.updateTarget({ sessionId: this.selectedSession.sessionId, startDate: this.selectedSession.startDate })
          }

          this.initialForm = JSON.stringify(this.homework)
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('getNextSessionsError'), type: 'error' })
          console.error('error on homework date initialisation')
        }
      }, (err) => {
        this.$store.dispatch('popups/pushPopup', { message: this.$t('getNextSessionsError'), type: 'error' })
        console.error(err)
      })
    },
    updateTarget (value) {
      this.homework.targetSessionId = value.sessionId
      this.homework.toDate = value.startDate
    },
    confirmClosure () {
      if (JSON.stringify(this.homework) !== this.initialForm) {
        this.$store.dispatch('warningModal/addWarning', {
          text: this.$t('confirmClosure'),
          lastAction: { fct: this.onClose }
        })
      } else {
        this.onClose()
      }
    },
    onClose () {
      // this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
@import '@design';

.edit-homework-modal .window-body {
  display: flex;
  flex-wrap: wrap;
  padding: 1.5rem 0;
  align-items: flex-start;
  gap: 2rem;
  align-self: stretch;
}

.edit-homework-modal {
  &:not(.phone) {
    .window-body {
      max-height: 70vh !important;
      min-height: 65vh !important;
    }
  }
}

.next-sessions-dropdown {
  button {
    border-radius: 6px !important;
    border: 1px solid $neutral-60 !important;
    background: $neutral-10 !important;
  }
}
</style>

<style lang="scss" scoped>
@import '@design';

.left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 2;
  min-width: 19rem;
}

.right {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 19rem;
  padding: 1.5rem;
  align-items: flex-start;
  align-self: stretch;

  border-radius: 0.375rem;
  background: $neutral-20;
}

.dropdowns {
  display: flex;
  gap: 1.5rem;
}

.type, .duration {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  white-space: nowrap;
  flex: 1;

  .base-dropdown {
    width: 100%;
  }
}

label {
  display: block;
  margin-bottom: 4px;
  @extend %font-regular-m;
}

.target-students {
  width: 100%;
}
.target-students-button, .work-load-button {
  white-space: nowrap;
  display: flex;
  height: 32px;
  width: 100%;
  padding: 8px 16px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  cursor: pointer;
  border-radius: 6px;
  border: 1px solid $neutral-60;
  background: $neutral-10;

  &:hover {
    filter: brightness(115%);
    -webkit-transition: .2s filter linear;
    -moz-transition: .2s filter linear;
    -ms-transition: .2s filter linear;
    -o-transition: .2s filter linear;
    transition: .2s filter linear;
  }
}

.target-students-button {
  text-align: left;

  span {
    flex: 1;
  }

  img {
    transform: rotate(90deg);
  }
}

.future-date {
  margin: 8px 0;
}

.footer-phone {
  .update-scheduled-date {
    margin-bottom: 1rem;
  }
}

.footer-desktop, .update-scheduled-date {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
}

.next-sessions-dropdown {
  white-space: nowrap;
  margin-bottom: 5rem;
}
</style>

<i18n locale="fr">
{
  "allStudents": "Tous les élèves",
  "basicInstruction": "Consigne simple",
  "confirmClosure": "Des modifications ne sont pas enregistrées, êtes-vous certain de quitter l’édition et de perdre les modifications ?",
  "docToComplete": "Doc. à compléter",
  "docToReturn": "Doc. à rendre",
  "error": "Oups, une erreur est survenue...",
  "for": "Pour",
  "getNextSessionsError": "Une erreur est survenue lors de la récupération des prochaines séances",
  "instructions": "Consigne",
  "duration": "Durée estimée",
  "homeworkTitle": "Titre du travail*",
  "homeworkType": "Type de travail",
  "futureDate": "À faire pour le ",
  "publish": "Publier",
  "schedule": "Programmer",
  "setPublishDate": "Programmer la publication",
  "publishLater": "Enregistrer en brouillon",
  "preview": "Aperçu",
  "required": "Champ requis",
  "scheduledOn": "Programmé le",
  "select": "Sélectionner",
  "sessionDate": "À faire pendant la séance",
  "someStudents": "Un élève sur {total} | {count} élèves sur {total}",
  "creationTitle": "Donner du travail",
  "updateTitle": "Modifier un travail",
  "workLoad": "Charge de travail"
}
</i18n>
