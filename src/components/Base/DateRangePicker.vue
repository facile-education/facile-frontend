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
        <CustomIcon icon-name="icon-calendar" />
      </button>
    </template>
  </DatePicker>
</template>

<script>
import 'v-calendar/style.css'

import CustomIcon from '@components/Base/CustomIcon.vue'
import dayjs from 'dayjs'
import { DatePicker } from 'v-calendar'

export default {
  name: 'DateRangePicker',
  components: { CustomIcon, DatePicker },
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
  height: 2rem;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 6px;
  border: 1px solid $neutral-60;
  padding: 6px 8px;
  @extend %font-regular-m;

  &:hover {
    transition: .2s background-color linear;
    background-color: #c5c5c5;
  }

  .icon-calendar  {
    font-size: 1.3rem;
  }
}

.label {
  margin: 0 8px;
}
</style>
