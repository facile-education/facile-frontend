<template>
  <section
    class="current-session"
    :style="`background-color: ${session.color}24; border-color: ${session.color};`"
  >
    <div>
      <div>
        {{ $t('Dashboard.currentSession') }}
      </div>
      <h2>
        {{ session.groupName + ' - ' + formattedSessionDate }}
      </h2>
    </div>

    <WeprodeButton
      v-if="session.canDoCall || session.canViewCall"
      class="call-button"
      @click="$emit('openCallModal')"
    >
      {{ $t(session.canDoCall ? 'CalendarEventOptions.doCall' : 'CalendarEventOptions.viewCall') }}
    </WeprodeButton>
  </section>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants.js'

export default {
  name: 'CurrentSessionBanner',
  components: { WeprodeButton },
  props: {
    session: {
      type: Object,
      required: true
    }
  },
  emits: ['openCallModal'],
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

.current-session {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 1rem 1.5rem;
  border-radius: $border-radius;
  border-left: 8px solid;
}

h2 {
  margin: 0;
  @extend %font-heading-xs;
}
</style>
