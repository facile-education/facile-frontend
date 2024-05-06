<template>
  <WeprodeWindow
    v-if="configuration"
    class="edit-entries-modal"
    data-test="edit-entries-modal"
    :class="{ 'phone': mq.phone || mq.tablet }"
    :full-screen="mq.phone || mq.tablet"
    :modal="true"
    :draggable="true"
    @close="confirmClosure"
  >
    <template #header>
      <span>
        {{ modalTitle }}
      </span>
    </template>

    <template #body>
      <div v-if="limitDate">
        <WeprodeTagsInput
          v-model="populations"
          :placeholder="$t('Logbook.entriesEditModal.populationPlaceholder')"
          :is-tag-clickable="(item) => item.type === contactTypeUser"
          :list="populationsList"
          :close-on-select="true"
          display-field="populationName"
        />
        <WeprodeErrorMessage :error-message="formErrorList.populations" />

        <WeprodeInput
          id="create-message-subject-input"
          ref="createMessageSubjectInput"
          v-model="title"
          class="subject"
          data-test="entry-title"
          :placeholder="$t('Logbook.entriesEditModal.titlePlaceholder')"
        />
        <WeprodeErrorMessage :error-message="formErrorList.title" />

        <TextContent
          v-if="content !== undefined"
          v-model:content="content"
          class="ck-editor"
          :placeholder="$t('Logbook.entriesEditModal.contentPlaceholder')"
        />
        <div
          v-if="entryType === 2"
          class="max-date"
        >
          <p>{{ $t('Logbook.entriesEditModal.maxDateLabel') }}</p>
          <CustomDatePicker
            v-model:selected-date="limitDate"
            :min-date="minDate"
            :with-hours="true"
            :is-required="true"
            :minute-increment="15"
            class="max-date-button"
          />
        </div>
      </div>
      <WeprodeSpinner v-else />
    </template>

    <template #footer>
      <div class="footer">
        <p><span><CustomIcon icon-name="icon-warning" /></span>{{ $t('Logbook.entriesEditModal.warningCreateEntryMessage') }}</p>
        <WeprodeButton
          data-test="submitButton"
          class="dark"
          :label="$t('Logbook.entriesEditModal.createSubmit')"
          @click="submit"
        />
      </div>
    </template>
  </WeprodeWindow>
</template>

<script>
import CustomDatePicker from '@components/Base/CustomDatePicker.vue'
import CustomIcon from '@components/Base/CustomIcon.vue'
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
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import WeprodeTagsInput from '@/components/Base/Weprode/WeprodeTagsInput.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import { ckMaxSize } from '@/constants/appConstants'
import logbookConstants from '@/constants/logbookConstants'
import constants from '@/constants/messagingConstants'

import { createEntries, getLogbookBroadcastPopulations } from '../../api/logbook.service'

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
    CustomDatePicker,
    WeprodeErrorMessage,
    WeprodeSpinner,
    CustomIcon
  },
  inject: ['mq'],
  props: {
    initEntry: {
      type: Object,
      default: undefined
    },
    entryType: {
      type: Number,
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
      limitDate: undefined
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
    contactTypeUser () {
      return constants.CONTACT_TYPE_USER
    },
    configuration () {
      return this.$store.state.calendar.configuration
    },
    modalTitle () {
      if (this.entryType === logbookConstants.ENTRY_TYPE_INFORMATION) {
        return this.$t('Logbook.entriesEditModal.modalTitle', { entryType: this.$t('Logbook.entriesItem.entryTypeInformation') })
      } else if (this.entryType === logbookConstants.ENTRY_TYPE_AUTHORIZATION) {
        return this.$t('Logbook.entriesEditModal.modalTitle', { entryType: this.$t('Logbook.entriesItem.entryTypeAuthorization') })
      } else {
        return this.$t('Logbook.entriesEditModal.modalTitle', { entryType: this.$t('Logbook.entriesItem.entryTypeObservation') })
      }
    }
  },
  created () {
    this.$store.dispatch('logbook/addFilter', logbookConstants.NONE_FILTERS)
    this.$store.dispatch('logbook/handleLoadAuthorEntries', true)
    if (this.configuration) {
      this.limitDate = dayjs(this.configuration.schoolYearEndDate, 'YYYY-MM-DD')
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
      } else {
        this.createEntries()
      }
    },
    createEntries () {
      this.formatePopulations()
      createEntries(this.title, this.content, this.populationsFormate, this.entryType, false, this.limitDate).then(data => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Logbook.successCreateEntry'), type: 'success' })
          this.$emit('entryCreated')
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
  .subject {
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

.max-date {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  width: fit-content;

  p {
    margin: 0;
    @extend %font-regular-l;
  }
}

.footer p {
  @extend %font-regular-m;
  span{
    margin-right: 5px;
  }
}
</style>
