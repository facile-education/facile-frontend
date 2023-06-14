<template>
  <Layout :is-allowed="$store.state.user.isAdministrator">
    <PentilaTabList>
      <PentilaTabItem :title="$t('globalSettings')">
        <GlobalScheduleSettings />
      </PentilaTabItem>
      <PentilaTabItem :title="$t('schoolSettings')">
        <SchoolScheduleSettings />
      </PentilaTabItem>
    </PentilaTabList>
  </Layout>
</template>

<script>

import Layout from '@/router/layouts/BannerLayout'
import { defineAsyncComponent } from 'vue'
const GlobalScheduleSettings = defineAsyncComponent(() => import('@components/ScheduleManager/GlobalScheduleSettings/GlobalScheduleSettings.vue'))
const SchoolScheduleSettings = defineAsyncComponent(() => import('@components/ScheduleManager/SchoolScheduleSettings/SchoolScheduleSettings.vue'))

export default {
  name: 'HorairesManager',
  components: {
    SchoolScheduleSettings,
    GlobalScheduleSettings,
    Layout
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n locale="fr">
{
  "globalSettings": "Paramètres globeaux",
  "schoolSettings": "Paramètres d'établissement"
}
</i18n>
