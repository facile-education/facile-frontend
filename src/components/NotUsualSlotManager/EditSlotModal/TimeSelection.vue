<template>
  <div data-test="time-selection">
    <div class="input-section">
      <span>{{ 'Tous les ' + momentStartTime.format('dddd') + 's de ' }}</span>
      <PentilaInput
        v-model="inputStartHour"
        class="input"
        :placeholder="'hh:mm'"
      />
      à
      <PentilaInput
        v-model="inputEndHour"
        class="input"
        :placeholder="'hh:mm'"
      />
    </div>
    <PentilaErrorMessage
      v-if="error !== ''"
      :error-message="error"
    />
    <div class="from-date">
      {{ 'À partir du ' + momentStartTime.format('dddd DD MMMM YYYY') }}
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'TimeSelection',
  props: {
    start: {
      type: [String, Date],
      required: true
    },
    end: {
      type: [String, Date],
      required: true
    }
  },
  emits: ['update:start', 'update:end', 'error'],
  data () {
    return {
      inputStartHour: '',
      inputEndHour: '',
      error: ''
    }
  },
  computed: {
    momentStartTime () {
      return dayjs(this.start)
    },
    momentEndTime () {
      return dayjs(this.end)
    }
  },
  watch: {
    inputStartHour (value) {
      const hour = dayjs(value, 'HH:mm')
      const newStartHour = dayjs(this.momentStartTime.format('YYYY-MM-DD') + ' ' + value, 'YYYY-MM-DD HH:mm')
      const currentEndHour = dayjs(this.momentEndTime.format('YYYY-MM-DD') + ' ' + this.inputEndHour, 'YYYY-MM-DD HH:mm')

      if (hour.isValid() && currentEndHour.isValid() && newStartHour.isBefore(currentEndHour)) {
        this.error = ''
        this.$emit('update:start', newStartHour.format('YYYY-MM-DDTHH:mm'))
        this.$emit('update:end', currentEndHour.format('YYYY-MM-DDTHH:mm'))
        this.$emit('error', false)
      } else {
        this.error = this.$t('NotUsualSlots.EditSlotModal.haveToSelectHour')
        this.$emit('error', true)
      }
    },
    inputEndHour (value) {
      const hour = dayjs(value, 'HH:mm', true)
      const currentStartHour = dayjs(this.momentStartTime.format('YYYY-MM-DD') + ' ' + this.inputStartHour, 'YYYY-MM-DD HH:mm')
      const newEndHour = dayjs(this.momentEndTime.format('YYYY-MM-DD') + ' ' + value, 'YYYY-MM-DD HH:mm')

      if (hour.isValid() && currentStartHour.isValid() && newEndHour.isAfter(currentStartHour)) {
        this.error = ''
        this.$emit('update:start', currentStartHour.format('YYYY-MM-DDTHH:mm'))
        this.$emit('update:end', newEndHour.format('YYYY-MM-DDTHH:mm'))
        this.$emit('error', false)
      } else {
        this.error = this.$t('NotUsualSlots.EditSlotModal.haveToSelectHour')
        this.$emit('error', true)
      }
    }
  },
  created () {
    this.inputStartHour = this.momentStartTime.format('HH:mm')
    this.inputEndHour = this.momentEndTime.format('HH:mm')
  }
}
</script>

<style scoped>
.input-section {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input {
  max-width: 75px;
  margin: 0 10px;
}

.from-date {
  font-size: 0.85em;
  font-style: italic;
  margin-bottom: 10px;

}

</style>
