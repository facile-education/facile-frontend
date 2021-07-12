<template>
  <div class="mobile-nav">
    <PentilaButton @click="previousDate">
      <i class="fa fa-chevron-left" />
    </PentilaButton>
    <Datepicker
      v-model="formattedReleaseDate"
      input-format="dd/MM/yy"
    />
    <PentilaButton @click="nextDate">
      <i class="fa fa-chevron-right" />
    </PentilaButton>
  </div>
</template>

<script>
import dayjs from 'dayjs'
// https://icehaunter.github.io/vue3-datepicker/#props-and-attributes
import { fr } from 'date-fns/locale'
import Datepicker from 'vue3-datepicker'

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
    formattedReleaseDate: {
      get () {
        return this.selectedDate.toDate()
      },
      set (date) {
        this.selectedDate = dayjs(date)
        this.$emit('selectDate', date)
      }
    }
  },
  methods: {
    nextDate () {
      this.selectedDate = this.selectedDate.add(1, 'day')
      this.$emit('selectDate', this.selectedDate.toDate())
    },
    previousDate () {
      this.selectedDate = this.selectedDate.subtract(1, 'day')
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
