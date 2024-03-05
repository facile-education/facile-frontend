<template>
  <div
    class="statistic-item"
    :title="title"
  >
    <div class="content">
      <div class="left">
        <div class="label">
          {{ statistic.label }}
        </div>
        <AnimatedCounter
          class="value"
          :target="statistic.current"
        />
      </div>

      <div
        class="right"
        :class="{'increase': isIncreasing, 'decrease': isDecreasing}"
      >
        <div
          v-t="'Dashboard.StatisticItem.evolution'"
          class="evolution-label"
        />
        <div class="evolution">
          <img
            v-if="isIncreasing"
            src="@/assets/icons/stat_increase_arrow.svg"
            alt=""
            class="evolution-icon"
          >
          <img
            v-if="isDecreasing"
            src="@/assets/icons/stat_decrease_arrow.svg"
            alt=""
            class="evolution-icon"
          >
          <div class="percentage">
            {{ (evolutionPercent >= 0 ? '+ ' : '- ') + Math.abs(evolutionPercent) + '%' }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="bottom-background"
      :class="{'increase' : isIncreasing}"
    />
  </div>
</template>

<script>
import AnimatedCounter from '@components/Base/AnimatedCounter.vue'

export default {
  name: 'StatisticItem',
  components: { AnimatedCounter },
  props: {
    statistic: {
      type: Object,
      required: true
    }
  },
  computed: {
    evolution () {
      return this.statistic.current - this.statistic.previous
    },
    isIncreasing () {
      return this.evolution > 0
    },
    isDecreasing () {
      return this.evolution < 0
    },
    evolutionPercent () {
      if (this.statistic.previous !== 0) {
        return Math.ceil((this.evolution * 100) / this.statistic.previous)
      } else {
        return this.statistic.current > 0 ? 100 : 0
      }
    },
    title () {
      return this.$t('Dashboard.StatisticItem.compareLabel', { percentageGain: (this.evolution >= 0 ? '+ ' : '- ') + Math.abs(this.evolution) }) +
        (this.statistic.type === 3 ? (' ' + this.$t('Dashboard.StatisticItem.activityDetails')) : '')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.statistic-item {
  --bottom-background: 1rem;
  height: 103px;
  width: 100%;
  border: 1px solid $color-border;
  border-radius: 6px;
}

.content {
  height: calc(100% - var(--bottom-background));
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
}

.bottom-background {
  height: var(--bottom-background);
  width: 100%;
  background-color: #FF9B3014;

  &.increase {
    background-color: #01C06B14;
  }
}

.right {
  font-size: 0.8rem;
}

.label {
  color: $color-new-light-text;
}

.value {
  font-size: 1.5rem;
}

.evolution-label {
  font-size: 0.625rem;
  text-align: right;
}

.label, .evolution-label {
  line-height: 2rem;
}

.evolution, .value {
  line-height: 2rem;
}

.evolution {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: $color-new-light-text;
}

.evolution-icon {
  margin-right: 0.5rem;
}
</style>
