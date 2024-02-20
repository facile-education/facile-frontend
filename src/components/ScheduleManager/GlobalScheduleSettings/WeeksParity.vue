<template>
  <section>
    <header>
      <h2 v-t="'ScheduleManager.WeeksParity.weekParity'" />
      <InformationIcon
        class="info"
        :text="$t('ScheduleManager.WeeksParity.weekParityInfos')"
      />
    </header>
    <WeprodeInput
      class="week-input"
      :model-value="h1Weeks"
      :placeholder="$t('ScheduleManager.WeeksParity.h1WeeksPlaceholder')"
      @update:model-value="$emit('update:h1Weeks', $event)"
    />
    <WeprodeInput
      class="week-input"
      :model-value="h2Weeks"
      :placeholder="$t('ScheduleManager.WeeksParity.h2WeeksPlaceholder')"
      @update:model-value="$emit('update:h2Weeks', $event)"
    />
  </section>
</template>

<script>
import InformationIcon from '@components/Base/InformationIcon.vue'

import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'

export default {
  name: 'WeeksParity',
  components: { InformationIcon, WeprodeInput },
  props: {
    h1Weeks: {
      type: String,
      required: true
    },
    h2Weeks: {
      type: String,
      required: true
    }
  },
  emits: ['update:h1Weeks', 'update:h2Weeks']
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;

  .info {
    margin-left: 1rem;
  }
}

.week-input {
  margin-bottom: 1rem;
}
</style>
