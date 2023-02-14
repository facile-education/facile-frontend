<template>
  <DatePicker
    v-model="range"
    :is-range="true"
    class="date"
    :max-date="maxDate"
    @update:model-value="emitNewDates"
  >
    <template #default="{ togglePopover }">
      <NeroIcon
        name="fa-calendar-alt"
        type="far"
        class="icon"
        @click="togglePopover()"
      />
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
    }
  },
  emits: ['updateDates'],
  data () {
    return {
      range: {}
    }
  },
  computed: {
    maxDate () {
      return dayjs().toDate()
    }
    // TODO: fetch min date?
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
.date {
  display: flex;
  align-items: center;
}
.icon {
  font-size: 2.5rem;
  padding: 0 0.5rem;
  cursor: pointer;
}
</style>
