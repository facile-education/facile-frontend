<template>
  <div class="mobile-nav">
    <PentilaButton
      :disabled="disablePrevious"
      @click="previousDate"
    >
      <i class="fa fa-chevron-left" />
    </PentilaButton>
    <Datepicker
      v-if="configuration"
      v-model="formattedReleaseDate"
      input-format="dd/MM/yy"
      :upper-limit="maxDate"
      :lower-limit="minDate"
      :locale="locale"
      class="base-input"
    />
    <PentilaButton
      :disabled="disableNext"
      @click="nextDate"
    >
      <i class="fa fa-chevron-right" />
    </PentilaButton>
  </div>
</template>

<script>
import dayjs from 'dayjs'
// https://icehaunter.github.io/vue3-datepicker/#props-and-attributes
import { fr } from 'date-fns/locale'
import Datepicker from 'vue3-datepicker'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

export default {
  name: 'DatepickerNav',
  components: {
    Datepicker
  },
  emits: ['selectDate'],
  data () {
    return {
      locale: fr,
      selectedDate: dayjs()
    }
  },
  computed: {
    configuration () {
      return (this.$store.state.cdt.configuration.schoolDays.length > 0) ? this.$store.state.cdt.configuration : undefined
    },
    disableNext () {
      return this.selectedDate.isSameOrAfter(this.maxDate)
    },
    disablePrevious () {
      return this.selectedDate.isSameOrBefore(this.minDate)
    },
    formattedReleaseDate: {
      get () {
        return this.selectedDate.toDate()
      },
      set (date) {
        this.selectedDate = dayjs(date)
        this.$emit('selectDate', date)
      }
    },
    minDate () {
      return dayjs(this.configuration.startDateSchool, 'DD/MM/YYYY HH:mm').toDate()
    },
    maxDate () {
      return dayjs(this.configuration.endDateSchool, 'DD/MM/YYYY HH:mm').toDate()
    }
  },
  methods: {
    nextDate () {
      this.selectedDate = this.selectedDate.add(1, 'day')
      // Skip hidden days
      if (this.configuration.schoolDays.indexOf(this.selectedDate.day()) === -1) {
        this.nextDate()
      }
      this.$emit('selectDate', this.selectedDate.toDate())
    },
    previousDate () {
      this.selectedDate = this.selectedDate.subtract(1, 'day')
      // Skip hidden days
      if (this.configuration.schoolDays.indexOf(this.selectedDate.day()) === -1) {
        this.previousDate()
      }
      this.$emit('selectDate', this.selectedDate.toDate())
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}
</style>

<style lang="scss">
// Hide weekends in datepicker
// TODO get hidden days from config
.v3dp__datepicker > div:last-child {
  .v3dp__subheading, .v3dp__elements {
    grid-template-columns: repeat(5, 1fr);
  }

  .v3dp__subheading > span:nth-child(6),
  .v3dp__subheading > span:nth-child(7) {
    display: none;
  }

  .v3dp__elements > button:nth-child(7n+6),
  .v3dp__elements > button:nth-child(7n) {
    display: none;
  }
}
</style>
