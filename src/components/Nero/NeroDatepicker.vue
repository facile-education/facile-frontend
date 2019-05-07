<template>
  <div class="nero-datepicker">
    <label v-if="label">
      {{ label }}
    </label>
    <Datepicker
      ref="datepicker"
      :value="value.toDate()"
      :format="customFormatter"
      :disabled-dates="disabledDates"
      :language="lang"
      :monday-first="true"
      class="datepicker"
      @input="updateDate"
    />
    <!-- typeable, minimumView, maximumView, initialView ...-->
    <NeroButton
      icon="fa fa-calendar-alt"
      @click="openDatepicker"
    />
  </div>
</template>

<script>
import moment from 'moment'
// See conf at https://github.com/charliekassel/vuejs-datepicker?ref=madewithvuejs.com#demo
import Datepicker from 'vuejs-datepicker'
import { fr } from 'vuejs-datepicker/dist/locale'

import NeroButton from '@/components/Nero/NeroButton'

export default {
  name: 'NeroDatepicker',
  components: {
    Datepicker,
    NeroButton
  },
  props: {
    initialView: {
      type: String,
      default: undefined
    },
    label: {
      type: String,
      default: ''
    },
    maxDate: {
      type: Object,
      default: () => undefined
    },
    minDate: {
      type: Object,
      default: () => undefined
    },
    // Expect moment date and return a moment date
    value: {
      type: Object,
      default: () => moment()
    }
  },
  data () {
    return {
      lang: fr
    }
  },
  computed: {
    disabledDates () {
      var disabledDates = {}
      if (this.minDate !== undefined) {
        if (this.value.isBefore(this.minDate)) {
          this.updateDate(this.minDate)
        }
        disabledDates.to = this.minDate.toDate()
      }
      if (this.maxDate !== undefined) {
        if (this.value.isAfter(this.maxDate)) {
          this.updateDate(this.maxDate)
        }
        disabledDates.from = this.maxDate.toDate()
      }
      return disabledDates
    }
  },
  methods: {
    customFormatter (date) {
      return moment(date).format('L')
    },
    openDatepicker () {
      this.$refs.datepicker.showCalendar()
    },
    updateDate (value) {
      this.$emit('input', moment(value))
    }
  }
}
</script>

<style lang="scss" scoped>
.nero-datepicker {
  display: flex;
}
</style>
