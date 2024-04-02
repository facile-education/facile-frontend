<template>
  <WeprodeWindow
    v-if="configuration"
    class="edit-entries-modal"
    data-test="edit-entries-modal"
    :class="{'phone': mq.phone || mq.tablet}"
    :full-screen="mq.phone || mq.tablet"
    :modal="true"
    :draggable="true"
    @close="confirmClosure"
  >
    <template #header>
      <span
        v-t="'Logbook.entriesEditModal.modalTitle'"
      />
    </template>

    <template
      v-if="maxDate"
      #body
    >
      <WeprodeTagsInput
        v-model="populations"
        :placeholder="$t('Logbook.entriesEditModal.populationPlaceholder')"
        :is-tag-clickable="(item) => item.type === contactTypeUser"
        :list="populationsList"
        :close-on-select="true"
        display-field="populationName"
      />
      <WeprodeErrorMessage
        :error-message="formErrorList.populations"
      />

      <WeprodeInput
        id="create-message-subject-input"
        ref="createMessageSubjectInput"
        v-model="title"
        class="subject"
        data-test="entry-title"
        :placeholder="$t('Logbook.entriesEditModal.titlePlaceholder')"
      />
      <WeprodeErrorMessage
        :error-message="formErrorList.title"
      />

      <TextContent
        v-if="content !== undefined"
        v-model:content="content"
        class="ck-editor"
        :placeholder="$t('Logbook.entriesEditModal.contentPlaceholder')"
      />

      <div class="entries-type">
        <WeprodeRadioButton
          v-model="entryType"
          :label="$t('Logbook.entriesEditModal.signingLabel')"
          name="date"
          data-test="signing"
          rb-value="signing"
          class="radio"
        />
        <WeprodeRadioButton
          v-model="entryType"
          :label="$t('Logbook.entriesEditModal.authorizationLabel')"
          name="date"
          data-test="authorization"
          rb-value="authorization"
          class="radio"
        />
      </div>
      <div class="max-date">
        <p>{{ $t('Logbook.entriesEditModal.maxDateLabel') }}</p>
        <CustomDatePicker
          v-model:selected-date="maxDate"
          :min-date="minDate"
          :with-hours="true"
          :is-required="true"
          :minute-increment="15"
          class="max-date-button"
        />
      </div>
    </template>

    <template #footer>
      <div
        class="footer"
      >
        <WeprodeButton
          data-test="submitButton"
          class="dark"
          :label="isCreation ? $t('Logbook.entriesEditModal.createSubmit') : $t('Logbook.entriesEditModal.editSubmit')"
          @click="submit"
        />
      </div>
    </template>
  </WeprodeWindow>
</template>

<script>
import CustomDatePicker from '@components/Base/CustomDatePicker.vue'
import TextContent from '@components/Base/TextContent.vue'
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import { addContactFieldsToContactList } from '@utils/contacts.utils'
import validators from '@utils/validators'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import dayjs from 'dayjs'

import messageService from '@/api/messaging/message.service'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeRadioButton from '@/components/Base/Weprode/WeprodeRadioButton.vue'
import WeprodeTagsInput from '@/components/Base/Weprode/WeprodeTagsInput.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import { ckMaxSize } from '@/constants/appConstants'
import constants from '@/constants/messagingConstants'

import { createEntries, getLogbookBroadcastPopulations, updateEntry } from '../../api/logbook.service'

const inputMaxSize = 75
const isUnderInputMaxSize = (value) => validators.isUnderMaxSize(value, inputMaxSize)
const isUnderCKMaxSize = (value) => validators.isUnderMaxSize(value, ckMaxSize)
const isNotEmpty = (list) => validators.isNotEmpty(list)

let timeout

export default {
  name: 'EntriesEditModal',
  components: {
    WeprodeWindow,
    WeprodeTagsInput,
    WeprodeButton,
    WeprodeInput,
    TextContent,
    WeprodeRadioButton,
    CustomDatePicker,
    WeprodeErrorMessage
  },
  inject: ['mq'],
  props: {
    initEntry: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close', 'entryCreated', 'entryEdited'],
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      populations: [],
      populationsFormate: {
        classes: [],
        students: []
      },
      populationsList: [],
      title: '',
      content: '',
      entryType: 'signing'
    }
  },
  validations: {
    title: {
      required,
      isUnderInputMaxSize
    },
    content: {
      isUnderCKMaxSize
    },
    populations: {
      isNotEmpty
    }
  },
  computed: {
    minDate () {
      return dayjs().toDate()
    },
    maxDate () {
      return this.configuration ? dayjs(this.configuration.schoolYearEndDate, 'YYYY-MM-DD') : dayjs()
    },
    formErrorList () {
      return {
        title: (this.v$.title.$invalid && this.v$.title.$dirty)
          ? (this.v$.title.$errors[0].$validator === 'required' ? this.$t('Commons.required') : this.$t('Dashboard.SaveNewsModal.sizeLimit', { maxSize: inputMaxSize }))
          : '',
        content: (this.v$.content.$invalid && this.v$.content.$dirty)
          ? this.$t('Dashboard.SaveNewsModal.sizeLimit', { maxSize: ckMaxSize })
          : '',
        populations: (this.v$.populations.$invalid && this.v$.populations.$dirty)
          ? this.$t('Dashboard.SaveNewsModal.selectPopulations')
          : ''
      }
    },
    isTeacher () {
      return this.$store.state.user.isTeacher
    },
    isCreation () {
      return this.initEntry === undefined
    },
    contactTypeUser () {
      return constants.CONTACT_TYPE_USER
    },
    configuration () {
      return this.$store.state.calendar.configuration
    }
  },
  created () {
    if (!this.configuration) {
      this.$store.dispatch('calendar/getConfiguration')
    }
    this.$store.dispatch('misc/incrementModalCount')
    getLogbookBroadcastPopulations().then(data => {
      data.populations.classes.forEach(classItem => {
        this.populationsList.push({
          populationName: classItem.className,
          orgId: classItem.orgId,
          type: 2
        })
      })
      if (this.isTeacher) {
        data.populations.students.forEach(student => {
          this.populationsList.push({
            populationName: student.firstName + ' ' + student.lastName,
            userId: student.userId,
            type: 1
          })
        })
      }
    }, err => {
      console.log(err)
    })
    if (!this.isCreation) {
      this.title = this.initEntry.title
      this.content = this.initEntry.content
      this.entryType = this.initEntry.isAuthorization ? 'authorization' : 'signing'
      this.maxDate = dayjs(this.initEntry.limitDate)
      this.initEntry.populations.classes.forEach(classItem => {
        this.populations.push({
          populationName: classItem.orgName,
          orgId: classItem.orgId,
          type: 2
        })
      })
      this.initEntry.populations.students.forEach(student => {
        this.populations.push({
          populationName: student.firstName + ' ' + student.lastName,
          userId: student.userId,
          type: 1
        })
      })
    }
    this.setInitialForm()
  },
  methods: {
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    },
    setInitialForm () {
      this.initialForm = {
        title: this.title,
        content: this.content,
        populations: [...this.populations]
      }
    },
    searchTimeOut () {
      this.autocompleteItems = []
      clearTimeout(timeout)
      // Make a new timeout set to go off in 800ms
      timeout = setTimeout(() => {
        if (this.$refs.tagsinput.inputValue.length >= 2) {
          this.getCompletion(this.$refs.tagsinput.inputValue)
        }
      }, 300)
    },
    getCompletion (query) {
      messageService.getUsersCompletion(query).then((data) => {
        if (data.success) {
          this.autocompleteItems = data.results
          addContactFieldsToContactList(data.results)
        } else {
          console.error('Error while getting users', data.error)
        }
      })
    },
    submit () {
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else if (this.isCreation) {
        this.createEntries()
      } else {
        this.updateEntry()
      }
    },
    createEntries () {
      this.formatePopulations()
      createEntries(this.title, this.content, this.populationsFormate, this.entryType === 'authorization', false, this.maxDate).then(data => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: 'Mot créé avec succès', type: 'success' })
          this.$emit('entryCreated')
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('popupError'), type: 'error' })
        }
      })
    },
    updateEntry () {
      this.formatePopulations()
      updateEntry(this.initEntry.logbookEntryId, this.title, this.content, this.populationsFormate, this.entryType === 'authorization', this.maxDate).then(data => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: 'Mot modifié avec succès', type: 'success' })
          this.$emit('entryEdited')
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('popupError'), type: 'error' })
        }
      })
    },
    formatePopulations () {
      this.populations.forEach(population => {
        if (population.type === 1) {
          this.populationsFormate.students.push(population.userId)
        } else if (population.type === 2) {
          this.populationsFormate.classes.push(population.orgId)
        }
      })
    },
    confirmClosure () {
      const actualForm = {
        title: this.title,
        content: this.content,
        populations: [...this.populations]
      }
      if (JSON.stringify(actualForm) !== JSON.stringify(this.initialForm)) {
        this.$store.dispatch('warningModal/addWarning', {
          text: this.$t('Dashboard.SaveDiaryEventModal.confirmClosure'),
          lastAction: { fct: this.onClose }
        })
      } else {
        this.onClose()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.edit-entries-modal {
  .subject{
    margin-top: 20px;
  }
  .ck-editor {
    border: 1px solid #666 !important;
    max-height: 30vh;
    overflow-y: auto;
    margin-top: 20px;
    p {
      margin: 5px 0;
      line-height: 1.25rem;
    }
  }

  .ck-editor__editable {
    min-height: 15rem;
  }

  &.phone .ck-editor__editable {
    min-height: 12rem;
  }
}

.entries-type{
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 10px;
  label{
    width: fit-content;
  }
}

.max-date{
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  width: fit-content;
  p{
    margin: 0;
    @extend %font-regular-l;
  }
}
</style>
