<template>
  <WeprodeWindow
    class="update-diary-event-modal"
    data-test="update-diary-event-modal"
    :modal="true"
    :draggable="true"
    :max-width="1000"
    :full-screen="mq.phone || mq.tablet"
    @close="confirmClosure"
  >
    <template #header>
      <span v-t="isCreation ? 'Dashboard.SaveDiaryEventModal.creationTitle' : 'Dashboard.SaveDiaryEventModal.updateTitle'" />
    </template>

    <template #body>
      <WeprodeSpinner
        v-if="isProcessingSave"
        class="save-spinner"
      />
      <div class="population-selection">
        <WeprodeTagsInput
          v-model="populations"
          :placeholder="$t('Dashboard.SaveDiaryEventModal.populationPlaceholder') + '*'"
          :list="availablePopulationsList"
          :close-on-select="true"
          sort-field="order"
          display-field="populationName"
          :disabled="isLoadingEventDetails"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.populations"
        />
        <WeprodeSpinner v-if="isLoadingEventDetails" />
      </div>

      <div class="dates">
        <div class="start-date">
          <div v-t="'Dashboard.SaveDiaryEventModal.startDateLabel'" />
          <CustomDatePicker
            v-model:selected-date="startDate"
            :min-date="minDate"
            :with-hours="true"
            :is-required="true"
            :minute-increment="15"
            :disabled="isStartDateDisabled"
            @update:selected-date="updateStartDate"
          />
          <WeprodeErrorMessage
            :error-message="formErrorList.startDate"
          />
        </div>
        <div class="end-date">
          <div v-t="'Dashboard.SaveDiaryEventModal.endDateLabel'" />
          <CustomDatePicker
            v-model:selected-date="endDate"
            :min-date="startDate.toDate()"
            :with-hours="true"
            :is-required="true"
            :minute-increment="15"
            :disabled="isEndDateDisabled"
          />
          <WeprodeErrorMessage
            :error-message="formErrorList.endDate"
          />
        </div>
      </div>

      <div class="input">
        <WeprodeInput
          ref="nameInput"
          v-model="title"
          data-test="titleInputEvent"
          :placeholder="$t('Dashboard.SaveDiaryEventModal.namePlaceHolder') + '*'"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.title"
        />
      </div>

      <div class="input">
        <WeprodeInput
          v-model="location"
          data-test="locationInputEvent"
          :placeholder="$t('Dashboard.SaveDiaryEventModal.locationPlaceHolder')"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.location"
        />
      </div>

      <TextContent
        v-if="description !== undefined"
        v-model:content="description"
        class="ck-editor"
        :placeholder="$t('Dashboard.SaveDiaryEventModal.descriptionPlaceHolder')"
      />
      <WeprodeErrorMessage
        :error-message="formErrorList.description"
      />

      <div
        v-if="!isCreation"
        class="unread-checkbox"
      >
        <span v-t="'Dashboard.SaveDiaryEventModal.markAsUnreadForAll'" />
        <WeprodeToggleSwitch
          v-model="markAsUnreadForAll"
        />
        <InformationIcon
          class="info"
          :is-above="true"
          :text="$t('Dashboard.SaveDiaryEventModal.switchHelp')"
        />
      </div>
    </template>

    <template #footer>
      <WeprodeButton
        data-test="submitButton"
        :label="isCreation? $t('Dashboard.SaveDiaryEventModal.creationSubmit') : $t('Dashboard.SaveDiaryEventModal.updateSubmit')"
        @click="submit"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import CustomDatePicker from '@components/Base/CustomDatePicker.vue'
import InformationIcon from '@components/Base/InformationIcon.vue'
import TextContent from '@components/Base/TextContent.vue'
import validators from '@utils/validators'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import dayjs from 'dayjs'

import { createEvent, getEventDetails, modifyEvent } from '@/api/dashboard/agenda.service'
import { getSchoolNewsBroadcastGroups } from '@/api/dashboard/news.service'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import WeprodeTagsInput from '@/components/Base/Weprode/WeprodeTagsInput.vue'
import WeprodeToggleSwitch from '@/components/Base/Weprode/WeprodeToggleSwitch.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import { ckMaxSize } from '@/constants/appConstants'

const inputMaxSize = 75
const isUnderInputMaxSize = (value) => validators.isUnderMaxSize(value, inputMaxSize)
const isUnderCKMaxSize = (value) => validators.isUnderMaxSize(value, ckMaxSize)
const isNotEmpty = (list) => validators.isNotEmpty(list)

export default {
  name: 'SaveDiaryEventModal',
  components: { TextContent, InformationIcon, CustomDatePicker, WeprodeButton, WeprodeErrorMessage, WeprodeInput, WeprodeSpinner, WeprodeTagsInput, WeprodeToggleSwitch, WeprodeWindow },
  inject: ['mq'],
  props: {
    initEvent: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close', 'createEvent', 'updateEvent'],
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      title: '',
      location: '',
      description: '',
      startDate: dayjs(),
      endDate: dayjs(),
      populations: [],
      markAsUnreadForAll: false,

      initialForm: undefined,

      availablePopulationsList: [],
      isLoadingEventDetails: false,
      isProcessingSave: false,
      isMounted: false,
      timer: undefined,
      isStartDateDisabled: false,
      isEndDateDisabled: false
    }
  },
  validations: {
    title: {
      required,
      isUnderInputMaxSize
    },
    location: {
      isUnderInputMaxSize
    },
    description: {
      isUnderCKMaxSize
    },
    populations: {
      isNotEmpty
    },
    startDate: { // Should be in future or today (or whatever if the start date as already began)
      required,
      function (value) {
        return this.isStartDateDisabled ? true : value.diff(dayjs().hour(0)) >= 0
      }
    },
    endDate: { // Should be > startDate
      required,
      function (value) {
        return value.diff(this.startDate) > 0
      }
    }
  },
  computed: {
    isCreation () {
      return this.initEvent === undefined
    },
    minDate () {
      return dayjs().toDate()
    },
    formErrorList () {
      return {
        title: (this.v$.title.$invalid && this.v$.title.$dirty)
          ? (this.v$.title.$errors[0].$validator === 'required' ? this.$t('Commons.required') : this.$t('Dashboard.SaveDiaryEventModal.sizeLimit', { maxSize: inputMaxSize }))
          : '',
        location: (this.v$.location.$invalid && this.v$.location.$dirty)
          ? this.$t('Dashboard.SaveDiaryEventModal.sizeLimit', { maxSize: inputMaxSize })
          : '',
        description: (this.v$.description.$invalid && this.v$.description.$dirty)
          ? this.$t('Dashboard.SaveDiaryEventModal.sizeLimit', { maxSize: ckMaxSize })
          : '',
        populations: (this.v$.populations.$invalid && this.v$.populations.$dirty)
          ? this.$t('Dashboard.SaveDiaryEventModal.selectPopulations')
          : '',
        startDate: (this.v$.startDate.$invalid && this.v$.startDate.$dirty)
          ? this.$t('Dashboard.SaveDiaryEventModal.dateInPast')
          : '',
        endDate: (this.v$.endDate.$invalid && this.v$.endDate.$dirty)
          ? this.$t('Dashboard.SaveDiaryEventModal.dateOrder')
          : ''
      }
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    if (!this.isCreation) {
      this.title = this.initEvent.title
      this.location = this.initEvent.location
      this.startDate = dayjs(this.initEvent.startDate)
      if (this.startDate.isBefore(dayjs().hour(0))) { // If event has already began (for more that one day), cannot modify the start date
        this.isStartDateDisabled = true
      }
      this.endDate = dayjs(this.initEvent.endDate)
      if (this.endDate.isBefore(dayjs().hour(0))) { // If event is already finished (for more that one day), cannot modify the end date
        this.isEndDateDisabled = true
      }
      this.initDetails(this.initEvent.eventId)
    } else {
      this.roundMinutes()
    }
    this.getBroadcastGroups()
    this.setInitialForm()
  },
  mounted () {
    const input = this.$refs.nameInput
    input.focus()
    input.select()
  },
  methods: {
    roundMinutes () {
      // Round startDate to the nearest quarter-hour (to have a compliant behaviour with v-calendar)
      this.startDate = this.startDate.minute(Math.round(this.startDate.minute() / 15) * 15)
      this.endDate = this.startDate.add(1, 'hour')
    },
    setInitialForm () {
      this.initialForm = {
        title: this.title,
        location: this.location,
        description: this.description,
        startDate: this.startDate,
        endDate: this.endDate,
        populations: [...this.populations],
        markAsUnreadForAll: this.markAsUnreadForAll
      }
    },
    updateStartDate (startDate) {
      // Update end date if needed
      if (startDate.isAfter(this.endDate)) {
        this.endDate = startDate.add(1, 'hour')
      }
    },
    initDetails (eventId) {
      this.isLoadingEventDetails = true
      getEventDetails(eventId).then((data) => {
        this.isLoadingEventDetails = false
        if (data.success) {
          this.populations = data.populations
          this.description = data.description
          this.setInitialForm()
        } else {
          console.error('Error')
        }
      })
    },
    getBroadcastGroups () {
      getSchoolNewsBroadcastGroups().then((data) => {
        if (data.success) {
          // Concat all populations of all schools in one list
          this.availablePopulationsList = []

          // Global
          if (data.global) {
            this.availablePopulationsList = [...this.availablePopulationsList, ...data.global]
          }

          const schools = data.schoolsGroups
          schools.forEach((school) => {
            if (school.populations) {
              this.availablePopulationsList = [...this.availablePopulationsList, ...school.populations]
            }
            if (school.classes) {
              school.classes.forEach((schoolClass) => {
                this.availablePopulationsList = [...this.availablePopulationsList, ...schoolClass.populations]
              })
            }
            if (school.volees) {
              school.volees.forEach((schoolVolee) => {
                this.availablePopulationsList = [...this.availablePopulationsList, ...schoolVolee.populations]
              })
            }
          })
        } else {
          console.error('Error')
        }
      })
    },
    submit () {
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else if (this.isCreation) {
        this.createEvent()
      } else {
        this.updateEvent()
      }
    },
    createEvent () {
      this.isProcessingSave = true
      createEvent(this.title, this.description, this.location, this.startDate, this.endDate, this.populations).then((data) => {
        this.handleWSResponse(data, true)
      }, (err) => {
        this.handleWSError(err)
      })
    },
    updateEvent () {
      this.isProcessingSave = true
      modifyEvent(this.initEvent.eventId, this.title, this.description, this.location, this.startDate, this.endDate, this.populations, this.markAsUnreadForAll).then((data) => {
        this.handleWSResponse(data, false)
      }, (err) => {
        this.handleWSError(err)
      })
    },
    handleWSResponse (data, isCreation) {
      this.isProcessingSave = false
      if (data.success) {
        if (this.startDate.isAfter(dayjs())) {
          this.$store.dispatch('popups/pushPopup', { message: this.$t(isCreation ? 'Dashboard.SaveDiaryEventModal.creationSuccess' : 'Dashboard.SaveDiaryEventModal.updateSuccess'), type: 'success' })
        }
        this.$emit(isCreation ? 'createEvent' : 'updateEvent')
        this.onClose()
      } else {
        this.$store.dispatch('popups/pushPopup', { message: this.$t('popupError'), type: 'error' })
      }
    },
    handleWSError (err) {
      this.isProcessingSave = false
      console.error(err)
      this.$store.dispatch('popups/pushPopup', { message: this.$t('popupError'), type: 'error' })
    },
    confirmClosure () {
      const actualForm = {
        title: this.title,
        location: this.location,
        description: this.description,
        startDate: this.startDate,
        endDate: this.endDate,
        populations: this.populations,
        markAsUnreadForAll: this.markAsUnreadForAll
      }

      if (JSON.stringify(actualForm) !== JSON.stringify(this.initialForm)) {
        this.$store.dispatch('warningModal/addWarning', {
          text: this.$t('Dashboard.SaveDiaryEventModal.confirmClosure'),
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
.update-diary-event-modal {
  .ck-editor {
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
</style>

<style lang="scss" scoped>
@import "@design";

.save-spinner {
  z-index: 100;
}

.ck-editor {
  @extend %inline-modal-ck;
}

.population-selection, .input {
  margin-bottom: 20px;
}

.unread-checkbox {
  display: flex;
  align-items: center;
  margin-top: 20px;

  span {
    margin-right: 1em;
  }

  .info {
    margin-left: 1rem;
  }
}

@media screen and (min-width: 700px) {
  .dates {
    display: flex;
  }

  .start-date, .end-date {
    flex: 1;
  }
}

.start-date, .end-date {
  margin-bottom: 15px;
}
</style>
