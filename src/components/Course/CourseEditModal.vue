<template>
  <WeprodeWindow
    class="edit-course-modal"
    :class="{'phone': mq.phone || mq.tablet}"
    :full-screen="mq.phone || mq.tablet"
    :modal="true"
    :draggable="true"
    @close="confirmClosure"
  >
    <template #header>
      <span> {{ formattedTitle }} </span>
    </template>

    <template #body>
      <section class="left">
        <div class="title">
          <WeprodeInput
            ref="titleInput"
            v-model="sessionContent.title"
            :maxlength="250"
            :placeholder="$t('courseTitle')"
          />
          <WeprodeErrorMessage :error-message="formErrorList" />
        </div>

        <CourseContentItem
          v-for="(block, index) in sessionContent.blocks"
          :key="block.contentId"
          v-model="block.contentValue"
          :content="block"
          :is-edition="true"
          class="content-item"
          :focus-on-creation="isCreation && !block.placeholder"
          @delete="deleteContent(index)"
        />
        <ContentPicker @add="addContent" />
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
            v-model:selected-date="publicationDate"
            :min-date="minDate"
            :max-date="maxDate"
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
    v-if="displayPublicationDateModal"
    to="body"
  >
    <ChoosePublicationDateModal
      :initial-date="publicationDate"
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

import { addSessionContent, updateSessionContent } from '@/api/course.service'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import ContentPicker from '@/components/Course/ContentPicker.vue'
import contentTypeConstants from '@/constants/contentTypeConstants'

const CourseContentItem = defineAsyncComponent(() => import('@components/Course/CourseContentItem'))
const CustomDatePicker = defineAsyncComponent(() => import('@components/Base/CustomDatePicker.vue'))
const ChoosePublicationDateModal = defineAsyncComponent(() => import('@components/Course/ChoosePublicationDateModal.vue'))

export default {
  name: 'CourseEditModal',
  components: {
    ChoosePublicationDateModal,
    WeprodeDropdownButton,
    CustomDatePicker,
    CourseContentItem,
    ContentPicker,
    WeprodeErrorMessage,
    WeprodeInput,
    WeprodeWindow
  },
  inject: ['mq'],
  props: {
    editedSession: {
      type: Object,
      required: true
    },
    isInList: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'update-session'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    sessionContent: {
      title: { required }
    }
  },
  data () {
    return {
      isCreation: true,
      initialPublicationOption: undefined,
      sessionContent: { blocks: [], title: '' },
      initialForm: undefined,
      publicationDate: dayjs(),
      displayPublicationDateModal: false,
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
    isScheduled () {
      return this.publicationDate.isAfter(dayjs()) && !this.editedSession.isDraft
    },
    formattedTitle () {
      const sessionStartDate = dayjs(this.editedSession.startDate, 'YYYY/MM/DD HH:mm')
      return this.$t('title', {
        courseName: this.editedSession.groupName,
        day: sessionStartDate.format('DD/MM'),
        hour: sessionStartDate.format('HH:mm')
      })
    },
    formErrorList () {
      const form = this.v$.sessionContent.title
      if (form.$invalid && form.$dirty) {
        return this.$t('required')
      } else {
        return ''
      }
    },
    configuration () {
      return this.$store.state.calendar.configuration
    },
    minDate () {
      return dayjs().startOf('day').toDate()
    },
    maxDate () {
      return this.configuration ? dayjs(this.configuration.schoolYearEndDate, 'YYYY-MM-DD').toDate() : undefined
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')

    if (this.editedSession.sessionContent) {
      this.isCreation = false
      this.sessionContent.title = this.editedSession.sessionContent.title ? this.editedSession.sessionContent.title : ''
      this.sessionContent.blocks = (this.editedSession.sessionContent.blocks && this.editedSession.sessionContent.blocks.length > 0) ? WeprodeUtils.deepCopy(this.editedSession.sessionContent.blocks) : []

      this.publicationDate = dayjs(this.editedSession.sessionContent.publicationDate, 'YYYY-MM-DD HH:mm')

      if (this.editedSession.isDraft) {
        this.initialPublicationOption = this.publicationOptions[2]
      } else if (this.publicationDate.isAfter(dayjs())) {
        this.initialPublicationOption = this.publicationOptions[1]
        if (!this.configuration) {
          this.$store.dispatch('calendar/getConfiguration')
        }
      } else {
        this.initialPublicationOption = this.publicationOptions[0]
      }
      this.publicationOptions[1].title = this.$t('schedule')
    } else { // isCreation = true
      this.sessionContent.blocks.push({
        contentType: 1, contentValue: '', contentName: '', placeholder: this.$t('description')
      })
      this.initialPublicationOption = this.publicationOptions[0]
    }
    this.initialForm = JSON.stringify(this.sessionContent)
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
    addContent (content) {
      content.contentId = -1
      this.sessionContent.blocks.push(content)
    },
    deleteContent (index) {
      this.sessionContent.blocks.splice(index, 1)
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
    removeEmptyTextBlocs () {
      this.sessionContent.blocks = this.sessionContent.blocks.filter(block => block.contentType !== contentTypeConstants.TYPE_TEXT_CONTENT || block.contentValue !== '')
    },
    save (isDraft = false) {
      this.removeEmptyTextBlocs()

      if (this.isCreation) {
        addSessionContent(this.editedSession.groupId, this.editedSession.sessionId, this.sessionContent.title, JSON.stringify(this.sessionContent.blocks), this.publicationDate, isDraft).then((data) => {
          if (data.success) {
            this.$store.dispatch('course/updateSessionContent')
            this.onClose()
          } else {
            console.error('Cannot create session content')
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          }
        }, (err) => {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          console.error(err)
        })
      } else {
        updateSessionContent(this.editedSession.sessionId, this.sessionContent.title, JSON.stringify(this.sessionContent.blocks), this.publicationDate, isDraft).then((data) => {
          if (data.success) {
            if (this.isInList) {
              this.$emit('update-session')
            } else {
              this.$store.dispatch('course/updateSessionContent')
            }
            this.onClose()
          } else {
            console.error('Cannot update session content')
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          }
        }, (err) => {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          console.error(err)
        })
      }
    },
    confirmClosure () {
      if (JSON.stringify(this.sessionContent) !== this.initialForm) {
        this.$store.dispatch('warningModal/addWarning', {
          text: this.$t('confirmClosure'),
          lastAction: { fct: this.onClose }
        })
      } else {
        this.onClose()
      }
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.edit-course-modal .window-body {
  display: flex;
  padding: 1.5rem 0;
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
  width: 19rem;
  padding: 1.5rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  align-self: stretch;

  border-radius: 0.375rem;
  background: $neutral-20;
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
</style>

<i18n locale="fr">
{
  "title": "Support du cours {courseName} - Séance du {day} à {hour}",
  "courseTitle": "Titre du support*",
  "publish": "Publier",
  "schedule": "Programmer",
  "setPublishDate": "Programmer la publication",
  "publishLater": "Enregistrer en brouillon",
  "scheduledOn": "Programmé le",
  "error": "Oups, une erreur est survenue...",
  "previousSession": "Voir la séance précédente",
  "description": "Description",
  "required": "Champ requis",
  "confirmClosure": "Des modifications ne sont pas enregistrées, êtes-vous certain de quitter l’édition et de perdre les modifications ?"
}
</i18n>
