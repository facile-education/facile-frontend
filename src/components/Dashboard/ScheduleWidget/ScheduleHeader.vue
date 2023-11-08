<template>
  <header>
    <h2 :aria-label="$t('schedule')" />

    <DayNavigation
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
  @extend %widget-header;
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

.date-selector {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.date-label {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;

  text-align: center;
  @extend %font-bold-l;
}

.arrow {
  height: 1rem;
}

.arrow.before {
  transform: rotate(180deg);
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
