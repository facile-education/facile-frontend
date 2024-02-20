<template>
  <WeprodeTabList>
    <WeprodeTabItem :title="$t('ScheduleManager.globalSettings')">
      <GlobalScheduleSettings />
    </WeprodeTabItem>
    <WeprodeTabItem :title="$t('ScheduleManager.schoolSettings')">
      <SchoolScheduleSettings />
    </WeprodeTabItem>
  </WeprodeTabList>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import WeprodeTabItem from '@/components/Base/Weprode/WeprodeTabItem.vue'
import WeprodeTabList from '@/components/Base/Weprode/WeprodeTabList.vue'

const GlobalScheduleSettings = defineAsyncComponent(() => import('@components/ScheduleManager/GlobalScheduleSettings/GlobalScheduleSettings.vue'))
const SchoolScheduleSettings = defineAsyncComponent(() => import('@components/ScheduleManager/SchoolScheduleSettings/SchoolScheduleSettings.vue'))

export default {
  name: 'HorairesManager',
  components: {
    SchoolScheduleSettings,
    GlobalScheduleSettings,
    WeprodeTabList,
    WeprodeTabItem
  },
  emits: ['update:layout'],
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  }
}
</script>

<style lang="scss" scoped>

</style>
