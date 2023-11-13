<template>
  <header>
    <h2 :aria-label="$t('schedule')" />

    <DayNavigation
      class="day-navigation"
      :selected-date="currentDate"
      @go-previous="$emit('goBefore')"
      @go-after="$emit('goAfter')"
      @select-date="$emit('selectDate', $event)"
    />

    <button
      class="redirect-button"
      @click="$emit('redirect')"
    >
      <img
        src="@/assets/icons/calendar.svg"
        alt=""
      >
      <span v-t="'redirect'" />
    </button>
  </header>
</template>

<script>
import DayNavigation from '@components/Dashboard/ScheduleWidget/DayNavigation.vue'
import dayjs from 'dayjs'

export default {
  name: 'ScheduleHeader',
  components: { DayNavigation },
  props: {
    currentDate: {
      type: Object,
      required: true
    }
  },
  emits: ['goBefore', 'goAfter', 'redirect', 'selectDate'],
  computed: {
    isToday () {
      return this.currentDate.isSame(dayjs(), 'day')
    },
    formattedDate () {
      return this.currentDate.format('ddd DD/MM')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

header {
  margin-bottom: 1rem;
}

h2 {
  @extend %widget-h2;
}

button:not(.redirect-button){
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FFFFFFDD;
  border-radius: 0;
  padding: 0;
  margin: 0;
  border: none;
}

.day-navigation {
  margin-bottom: 1rem;
}

.redirect-button {
  width: 100%;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  padding: 4px 8px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 6px;
  border: 1px solid $color-border;

  img {
    margin-right: 1rem;
  }
}

</style>

<i18n locale="fr">
{
  "goAfter": "Jour suivant",
  "goBefore": "Jour précédent",
  "schedule": "Horaires",
  "redirect": "Accéder au semainier"
}
</i18n>
