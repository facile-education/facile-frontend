<template>
  <header
    class="session-header"
    :style="`background-color: ${session.color}24; border-color: ${session.color};`"
  >
    <h2>
      {{ session.groupName + ' - ' + formattedSessionDate }}
    </h2>
    <div class="nb-students">
      {{ $tc('Call.nbStudents', call.students.length) }}
    </div>
  </header>
</template>

<script>
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants.js'

export default {
  name: 'CallSessionHeader',
  props: {
    session: {
      type: Object,
      required: true
    },
    call: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedSessionDate () {
      return this.capitalizeFirstLetter(
        dayjs(this.session.startDate, DATE_EXCHANGE_FORMAT).format('ddd DD/MM - [P' + this.session.slotNumber + '] - HH:mm')
      ) + ' / ' + dayjs(this.session.endDate, DATE_EXCHANGE_FORMAT).format('HH:mm')
    }
  },
  methods: {
    capitalizeFirstLetter (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.session-header {
  display: block;
  margin-bottom: 1rem;
  padding: 1rem 1.5rem;
  border-radius: $border-radius;
  border-left: 8px solid;
}

.nb-students {
  white-space: nowrap;
}

h2 {
  margin: 0;
  @extend %font-heading-xs;
}

</style>
