<template>
  <DatePicker
    v-model="range"
    :is-range="true"
    class="date"
    :max-date="maxDate"
    :min-date="minDate"
    @update:model-value="emitNewDates"
  >
    <template #default="{ togglePopover }">
      <button @click="togglePopover()">
        <span class="label">
          {{ formattedStartDate + ' - ' + formattedEndDate }}
        </span>
        <NeroIcon
          name="fa-calendar-alt"
          type="far"
          class="icon"
        />
      </button>
    </template>
  </DatePicker>
</template>

<script>
import NeroIcon from '@components/Nero/NeroIcon.vue'
import dayjs from 'dayjs'
import { DatePicker } from 'v-calendar'

export default {
  name: 'DateRangePicker',
  components: { DatePicker, NeroIcon },
  props: {
    initialRange: {
      type: Object,
      required: true
    },
    maxDate: {
      type: Date,
      default: undefined
    },
    minDate: {
      type: Date,
      default: undefined
    }
  },
  emits: ['updateDates'],
  data () {
    return {
      range: {}
    }
  },
  computed: {
    formattedStartDate () {
      if (this.range.start) {
        return dayjs(this.range.start).format('DD/MM/YYYY')
      } else {
        return ''
      }
    },
    formattedEndDate () {
      if (this.range.end) {
        return dayjs(this.range.end).format('DD/MM/YYYY')
      } else {
        return ''
      }
    }
  },
  created () {
    this.range = {
      start: this.initialRange.start.toDate(),
      end: this.initialRange.end.toDate()
    }
  },
  methods: {
    emitNewDates () {
      this.$emit('updateDates', this.range)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.date {
  display: flex;
  align-items: center;
}

button {
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 6px;
  border: none;

  &:hover {
    background-color: #c5c5c5;
  }
}

.label {
  display: flex;
  margin-right: 5px;
  margin-left: 0.5em;
  font-size: 14px;
  font-weight: bold;
}

.icon {
  font-size: 2.5rem;
  padding: 0 0.5rem;
  cursor: pointer;
}
</style>
