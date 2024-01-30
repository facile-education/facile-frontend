<template>
  <div class="containerUserCardSchedule">
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
      :displayHours="false"
    />
    <p
      v-else
      class="placeholder"
    >
    {{ $t('noClass') }}
    </p>
  </div>
</template>

<script>
import ScheduleItem from '../../Dashboard/ScheduleWidget/ScheduleItem.vue'

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
      const dateObject = new Date(this.userDetails.currentCourse.startDate)
      return dateObject.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    },
    formatedEndHour () {
      const dateObject = new Date(this.userDetails.currentCourse.endDate)
      return dateObject.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@design";
.containerUserCardSchedule {
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
