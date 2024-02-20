<template>
  <div data-test="time-selection">
    <div class="input-section">
      <slot />
      <!--      <span> {{ ` ${$t('NotUsualSlotManager.TimeSelection.the')} ${startTime.format('dddd')}s ${$t('NotUsualSlotManager.TimeSelection.at')} ` }}</span>-->
      <div>
        <WeprodeInput
          v-model="inputStartHour"
          class="input start"
          :placeholder="'hh:mm'"
          :labelled="false"
          @blur="update"
        />
        <WeprodeErrorMessage :error-message="formErrorList.startHour" />
      </div>
      <span v-t="'NotUsualSlotManager.TimeSelection.to'" />
      <div>
        <WeprodeInput
          v-model="inputEndHour"
          class="input end"
          :placeholder="'hh:mm'"
          :labelled="false"
          @blur="update"
        />
        <WeprodeErrorMessage
          v-if="formErrorList.startHour === ''"
          :error-message="formErrorList.endHour"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'

dayjs.extend(customParseFormat)

export default {
  name: 'TimeSelection',
  components: { WeprodeErrorMessage, WeprodeInput },
  props: {
    range: {
      type: Object,
      required: true
    }
  },
  emits: ['update:range'],
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      inputStartHour: '',
      inputEndHour: ''
    }
  },
  validations: {
    inputStartHour: {
      required,
      function () {
        return this.startTime.isValid()
      }
    },
    inputEndHour: { // Should be > startDate
      required,
      function () {
        return this.startTime.isValid() && this.endTime.diff(this.startTime) >= 0
      }
    }
  },
  computed: {
    startTime () {
      const today = dayjs().format('YYYY/MM/DD')
      return dayjs(today + ' ' + this.inputStartHour, 'YYYY/MM/DD HH:mm', true)
    },
    endTime () {
      const today = dayjs().format('YYYY/MM/DD')
      return dayjs(today + ' ' + this.inputEndHour, 'YYYY/MM/DD HH:mm', true)
    },
    formErrorList () {
      return {
        startHour: (this.v$.inputStartHour.$invalid && this.v$.inputStartHour.$dirty)
          ? (this.v$.inputEndHour.$errors[0].$validator === 'required' ? this.$t('NotUsualSlotManager.TimeSelection.required') : this.$t('NotUsualSlotManager.TimeSelection.invalidDateFormat'))
          : '',
        endHour: (this.v$.inputEndHour.$invalid && this.v$.inputEndHour.$dirty)
          ? (this.v$.inputEndHour.$errors[0].$validator === 'required' ? this.$t('NotUsualSlotManager.TimeSelection.required') : this.$t('NotUsualSlotManager.TimeSelection.afterStartDate'))
          : ''
      }
    }
  },
  created () {
    this.inputStartHour = this.range.start
    this.inputEndHour = this.range.end
  },
  methods: {
    update () {
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.$emit('update:range', {
          start: this.inputStartHour,
          end: this.inputEndHour
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.input-section {
  display: flex;
  align-items: center;

  span {
    margin: 0 6px;
  }
}

.input {
  max-width: 62px;
  padding-left: 8px;
  padding-right: 8px;
}

.from-date {
  font-size: 0.85em;
  font-style: italic;
  margin-bottom: 20px;
}
</style>
