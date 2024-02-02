<template>
  <section
    class="container-userCard-schedule"
    data-test="UserCardSchedule"
  >
    <h2>
      <img
        src="@/assets/icons/calendar.svg"
        alt="Calendar icon"
      >
      <span v-if="userDetails.currentCourse">{{ $t('currentlyClass', {startHour: formatedStartHour, endHour: formatedEndHour}) }}</span>
      <span v-else>{{ $t('currently') }}</span>
    </h2>
    <ScheduleItem
      v-if="userDetails.currentCourse"
      :session="userDetails.currentCourse"
      :display-hours="false"
    />
    <p
      v-else
      class="placeholder"
    >
      {{ $t('noClass') }}
    </p>
  </section>
</template>

<script>
import ScheduleItem from '@components/Dashboard/ScheduleWidget/ScheduleItem.vue'
import dayjs from 'dayjs'

export default {
  name: 'UserCardCurrentSchedule',
  components: { ScheduleItem },
  props: {
    userDetails: {
      type: Object,
      required: true
    }
  },
  computed: {
    formatedStartHour () {
      return dayjs(this.userDetails.currentCourse.startDate).format('HH:mm')
    },
    formatedEndHour () {
      return dayjs(this.userDetails.currentCourse.endDate).format('HH:mm')
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
    margin-bottom: 24px;
    @extend %font-regular-l;
    }
    .placeholder{
      @extend %font-medium-m
    }
}
</style>

<i18n locale="fr">
  {
    "currently": "Actuellement",
    "currentlyClass": "Actuellement : de {startHour} à {endHour}",
    "noClass": "pas de cours"
  }
</i18n>
