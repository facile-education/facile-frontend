<template>
  <section
    class="container-userCard-schedule"
    data-test="UserCardSchedule"
  >
    <h2>
      <CustomIcon
        class="calendar-icon"
        :icon-name="'icon-calendar'"
      />
      <span v-if="userDetails.currentSession">{{ $t('UserCard.UserCardCurrentSchedule.currentlyClass', {startHour: formatedStartHour, endHour: formatedEndHour}) }}</span>
      <span v-else>{{ $t('UserCard.UserCardCurrentSchedule.currently') }}</span>
    </h2>
    <ScheduleItem
      v-if="userDetails.currentSession"
      :session="userDetails.currentSession"
      :display-hours="false"
      :title="'Voir ses horaires'"
      class="schedule-item"
      @click="scheduleItemRedirect"
    />
    <p
      v-else
      class="placeholder"
    >
      {{ $t('UserCard.UserCardCurrentSchedule.noClass') }}
    </p>
  </section>
</template>

<script>
import ScheduleItem from '@components/Dashboard/ScheduleWidget/ScheduleItem.vue'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { SCHEDULE } from '@/constants/appConstants'
const CustomIcon = defineAsyncComponent(() => import('@components/Base/CustomIcon.vue'))

export default {
  name: 'UserCardCurrentSchedule',
  components: { ScheduleItem, CustomIcon },
  props: {
    userDetails: {
      type: Object,
      required: true
    }
  },
  computed: {
    formatedStartHour () {
      return dayjs(this.userDetails.currentSession.startDate).format('HH:mm')
    },
    formatedEndHour () {
      return dayjs(this.userDetails.currentSession.endDate).format('HH:mm')
    }
  },
  methods: {
    scheduleItemRedirect () {
      this.$router.push({ name: SCHEDULE, query: { initialDisplayDate: dayjs(this.userDetails.currentSession.startDate).format('YYYY/MM/DD'), fromUserCard: true } })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@design";
.container-userCard-schedule {
  h2 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    margin-bottom: 16px;
    @extend %font-regular-l;
    }
    .calendar-icon{
      font-size: 24px;
    }
    .placeholder{
      @extend %content-placeholder;
    }
}
.schedule-link{
  color: black;
  text-decoration: none;
}
.schedule-item{
  width: calc(100% - 16px) !important;
  margin-left: 16px;
  cursor: pointer;
}
</style>
