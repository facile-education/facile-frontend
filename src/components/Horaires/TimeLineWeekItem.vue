<template>
  <button
    :class="{'theme-background-color': isSelected}"
    :title="weekTitle"
    @click="handleClick"
  >
    <span
      v-if="isCurrent"
      class="current-week-bar theme-background-color"
    />
    <span class="week-number-label">
      {{ $t('Horaires.TimeLineWeekItem.weekNumber', { weekNumber: week.weekNumber }) }}
    </span>
    <span class="week-label">
      {{ weekLabel }}
    </span>
  </button>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'TimeLineWeekItem',
  props: {
    week: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['selectWeek'],
  computed: {
    isCurrent () {
      const firstDayOfWeek = dayjs(this.week.firstDayOfWeek, 'YYYY-MM-DD')
      return dayjs().isSame(firstDayOfWeek, 'week')
    },
    weekLabel () {
      return dayjs(this.week.firstDayOfWeek, 'YYYY-MM-DD').format('D MMM')
    },
    weekTitle () {
      const startDate = dayjs(this.week.firstDayOfWeek, 'YYYY-MM-DD')
      const endDate = startDate.endOf('week')
      return this.$t('Horaires.TimeLineWeekItem.weekTitle', { firstWeekDay: startDate.format('DD MMMM YYYY'), lastWeekDay: endDate.format('DD MMMM YYYY') })
    }
  },
  methods: {
    handleClick () {
      if (!this.isSelected) {
        this.$emit('selectWeek')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 8px;
  width: 62px;
  border: none;
  cursor: pointer;
  border-radius: $border-radius;
  position: relative;

  &:not(.theme-background-color) {
    background-color: transparent;

    &:hover {
      background-color: $color-hover-bg;
    }
  }

}

.current-week-bar {
  position: absolute;
  height: 100%;
  width: 5px;
  top: 0;
  left: 0;
  border-top-left-radius: $border-radius;
  border-bottom-left-radius: $border-radius;
}

.week-number-label {
  text-align: center;
  @extend %font-bold-l;
}

.week-label {
  @extend %font-medium-s;
}
</style>
