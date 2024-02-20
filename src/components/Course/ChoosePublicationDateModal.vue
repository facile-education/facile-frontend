<template>
  <WeprodeWindow
    v-if="configuration"
    class="publication-date-modal"
    :width="400"
    :modal="true"
    :draggable="true"
    :full-screen="mq.phone || mq.tablet"
    @close="$emit('close')"
  >
    <template #header>
      <span v-t="'Course.ChoosePublicationDateModal.choosePublicationDate'" />
    </template>

    <template #body>
      <CustomDatePicker
        v-model:selected-date="selectedDate"
        style="width: 100%"
        :min-date="minDate"
        :max-date="maxDate"
        :button-form="false"
        :with-hours="true"
        :is-required="true"
        :minute-increment="15"
      />
    </template>

    <template #footer>
      <WeprodeButton
        v-t="'Course.ChoosePublicationDateModal.schedule'"
        data-test="futurePublication"
        @click="chooseDate"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import CustomDatePicker from '@components/Base/CustomDatePicker.vue'
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import WeprodeWindow from '@components/Base/Weprode/WeprodeWindow.vue'
import dayjs from 'dayjs'

export default {
  name: 'ChoosePublicationDateModal',
  components: { CustomDatePicker, WeprodeButton, WeprodeWindow },
  inject: ['mq'],
  props: {
    initialDate: {
      type: Object,
      default: undefined
    },
    limitDate: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close', 'chooseDate'],
  data () {
    return {
      selectedDate: undefined
    }
  },
  computed: {
    configuration () {
      return this.$store.state.calendar.configuration
    },
    minDate () {
      return dayjs().startOf('day').toDate()
    },
    maxDate () {
      return this.limitDate ? this.limitDate.toDate() : (this.configuration ? dayjs(this.configuration.schoolYearEndDate, 'YYYY-MM-DD').toDate() : undefined)
    }
  },
  created () {
    if (!this.configuration) {
      this.$store.dispatch('calendar/getConfiguration')
    }

    if (this.initialDate) {
      this.selectedDate = this.initialDate
    } else {
      this.selectedDate = dayjs()
    }
  },
  methods: {
    chooseDate () {
      this.$emit('chooseDate', this.selectedDate)
    }
  }
}
</script>
