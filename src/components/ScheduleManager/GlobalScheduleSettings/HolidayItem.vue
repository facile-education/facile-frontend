<template>
  <div class="holiday">
    <h3 :title="holiday.name">
      {{ holiday.name }}
    </h3>
    <span class="start-date">
      {{ $t('ScheduleManager.HolidayItem.startDate') }}
      <strong>{{ holiday.startDate }}</strong>
    </span>
    <span class="end-date">
      {{ $t('ScheduleManager.HolidayItem.endDate') }}
      <strong>{{ holiday.endDate }}</strong>
    </span>

    <WeprodeButton
      v-t="'ScheduleManager.HolidayItem.delete'"
      @click="$emit('delete')"
    />
  </div>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'

export default {
  name: 'HolidayItem',
  components: { WeprodeButton },
  props: {
    holiday: {
      type: Object,
      required: true
    }
  },
  emits: ['delete']
}
</script>

<style lang="scss" scoped>
.holiday {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h3 {
  width: 250px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>
