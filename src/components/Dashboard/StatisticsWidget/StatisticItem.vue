<template>
  <div
    class="statistic-item"
    :title="evolution >= 0 ? ('+ ' + evolution) : evolution"
  >
    <div
      class="left"
      :style="'color: ' + statistic.pointBackgroundColor"
    >
      <AnimatedCounter
        class="value"
        :target="currentValue"
      />
      <div class="title">
        {{ statistic.label }}
      </div>
    </div>

    <div
      class="evolution"
      :class="{'increase': isIncreasing, 'decrease': isDecreasing}"
    >
      <BaseIcon
        v-if="isIncreasing || isDecreasing"
        name="arrow-up"
        class="evolution-icon"
      />
      <div class="percentage">
        {{ evolutionPercent + '%' }}
      </div>
    </div>
  </div>
</template>

<script>
import AnimatedCounter from '@components/Base/AnimatedCounter.vue'
import BaseIcon from '@components/Base/BaseIcon.vue'

export default {
  name: 'StatisticItem',
  components: { BaseIcon, AnimatedCounter },
  props: {
    statistic: {
      type: Object,
      required: true
    }
  },
  computed: {
    currentValue () {
      return this.statistic.data[1]
    },
    oldValue () {
      return this.statistic.data[0]
    },
    evolution () {
      return this.currentValue - this.oldValue
    },
    isIncreasing () {
      return this.evolution > 0
    },
    isDecreasing () {
      return this.evolution < 0
    },
    evolutionPercent () {
      if (this.oldValue !== 0) {
        return (this.evolution * 100) / this.oldValue
      } else {
        return this.currentValue > 0 ? 100 : 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.statistic-item {
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left {
  font-weight: bold;
}

.evolution {
  display: flex;
  align-items: center;
  color: orange;

  &.increase {
    color: green;

    .evolution-icon {
      transform: rotate(45deg);
    }
  }

  &.decrease {
    color: red;
    .evolution-icon {
      transform: rotate(135deg);
    }
  }
}

.evolution-icon {
  margin-right: 0.5rem;
}
</style>
