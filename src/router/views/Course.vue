<template>
  <Layout>
    <PentilaTabList>
      <PentilaTabItem
        :title="$t('schedule')"
      >
        <ScheduleTab />
      </PentilaTabItem>
      <PentilaTabItem
        :title="$t('homework')"
      >
        <HomeworkTab />
      </PentilaTabItem>
    </PentilaTabList>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/BannerLayout'
import HomeworkTab from '@/components/Course/HomeworkTab.vue'
import ScheduleTab from '@/components/Course/ScheduleTab.vue'

export default {
  name: 'Course',
  components: {
    Layout,
    HomeworkTab,
    ScheduleTab
  },
  inject: ['mq'],
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>

<i18n locale="fr">
{
  "serviceTitle": "Cours & Devoirs",
  "schedule": "Horaires",
  "homework": "Devoirs"
}
</i18n>
