<template>
  <DatePicker
    v-model="formattedDate"
    v-bind="$attrs"
  >
    <template #default="{ togglePopover }">
      <PentilaButton
        cls="cancel"
        :label="modelValue.format('DD/MM/YYYY')"
        @click="togglePopover()"
      />
    </template>
  </DatePicker>
</template>

<script>
import 'v-calendar/style.css'

import dayjs from 'dayjs'
import { DatePicker } from 'v-calendar'


export default {
  name: 'NeroDatePicker',
  components: {
    DatePicker
  },
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue'],
  computed: {
    formattedDate: {
      get () {
        return this.modelValue.toDate()
      },
      set (date) {
        this.$emit('update:modelValue', dayjs(date))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  font-size: 2.5rem;
  padding: 0 0.5rem;
  cursor: pointer;
}
</style>
