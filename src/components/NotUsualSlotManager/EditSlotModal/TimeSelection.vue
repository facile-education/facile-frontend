<template>
  <div class="input-section">
    <span>{{ 'Tous les ' + momentStartTime.format('dddd') + ' de ' }}</span>
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
  <div class="from-date">
    {{ 'À partir du ' + momentStartTime.format('dddd DD MMMM YYYY') }}
  </div>
</template>

<script>
import moment from 'moment'
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
  emits: ['update:start', 'update:end'],
  data () {
    return {
      inputStartHour: '',
      inputEndHour: ''
    }
  },
  computed: {
    momentStartTime () {
      return moment(this.start, 'YYYY-MM-DDTHH:mm')
    },
    momentEndTime () {
      return moment(this.end, 'YYYY-MM-DDTHH:mm')
    }
  },
  watch: {
    inputStartHour (value) {
      const newStartHour = moment(this.momentStartTime.format('YYYY-MM-DD') + ' ' + value, 'YYYY-MM-DD HH:mm')
      if (newStartHour.isValid) {
        this.$emit('update:start', newStartHour.format('YYYY-MM-DDTHH:mm'))
      }
    },
    inputEndHour (value) {
      const newEndHour = moment(this.momentEndTime.format('YYYY-MM-DD') + ' ' + value, 'YYYY-MM-DD HH:mm')
      if (newEndHour.isValid) {
        this.$emit('update:end', newEndHour.format('YYYY-MM-DDTHH:mm'))
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
