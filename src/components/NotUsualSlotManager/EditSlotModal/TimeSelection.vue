<template>
  <div data-test="time-selection">
    <div class="input-section">
      <slot />
      <span> {{ ` ${$t('the')} ${startTime.format('dddd')}s ${$t('at')} ` }}</span>
      <PentilaInput
        v-model="inputStartHour"
        class="input start"
        :placeholder="'hh:mm'"
        :labelled="false"
      />
      <span v-t="'to'" />
      <PentilaInput
        v-model="inputEndHour"
        class="input end"
        :placeholder="'hh:mm'"
        :labelled="false"
      />
    </div>
    <PentilaErrorMessage
      v-if="error !== ''"
      :error-message="error"
    />
    <div class="from-date">
      {{ $t('fromThe') + startTime.format('DD MMMM YYYY') }}
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
    startTime () {
      return dayjs(this.start)
    },
    endTime () {
      return dayjs(this.end)
    }
  },
  watch: {
    inputStartHour (value) {
      const hour = dayjs(value, 'HH:mm')
      const newStartHour = dayjs(this.startTime.format('YYYY-MM-DD') + ' ' + value, 'YYYY-MM-DD HH:mm')
      const currentEndHour = dayjs(this.endTime.format('YYYY-MM-DD') + ' ' + this.inputEndHour, 'YYYY-MM-DD HH:mm')

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
      const currentStartHour = dayjs(this.startTime.format('YYYY-MM-DD') + ' ' + this.inputStartHour, 'YYYY-MM-DD HH:mm')
      const newEndHour = dayjs(this.endTime.format('YYYY-MM-DD') + ' ' + value, 'YYYY-MM-DD HH:mm')

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
    this.inputStartHour = this.startTime.format('HH:mm')
    this.inputEndHour = this.endTime.format('HH:mm')
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

<i18n locale="fr">
{
  "at": "de",
  "fromThe": "À partir du ",
  "the": "des",
  "to": "à"
}
</i18n>
