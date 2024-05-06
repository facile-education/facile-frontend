<template>
  <header>
    <h2 :aria-label="$t('Dashboard.ScheduleHeader.schedule')" />

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
      <CustomIcon icon-name="icon-calendar" />
      <span v-t="'Dashboard.ScheduleHeader.redirect'" />
    </button>
  </header>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import DayNavigation from '@components/Dashboard/ScheduleWidget/DayNavigation.vue'

export default {
  name: 'ScheduleHeader',
  components: { CustomIcon, DayNavigation },
  props: {
    currentDate: {
      type: Object,
      required: true
    }
  },
  emits: ['goBefore', 'goAfter', 'redirect', 'selectDate'],
  computed: {
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
  line-height: 1.3rem;

  .icon-calendar {
    margin-right: 1rem;
    font-size: 1.3rem;
  }
}

</style>
