<template>
  <div>
    <PentilaTabList>
      <PentilaTabItem :title="$t('Forums.ForumDetails.threadsTabLabel')">
        <ForumThreads />
      </PentilaTabItem>
      <PentilaTabItem :title="$t('Forums.ForumDetails.lastPublicationsTabLabel')">
        <LastPublications />
      </PentilaTabItem>
      <PentilaTabItem :title="$t('Forums.ForumDetails.statisticsTabLabel')">
        <ForumStatistics />
      </PentilaTabItem>
      <PentilaTabItem :title="$t('Forums.ForumDetails.managerTabLabel')">
        <ForumManager />
      </PentilaTabItem>
    </PentilaTabList>
  </div>
</template>

<script>
import ForumThreads from '@/components/Forums/ForumThreads'
import LastPublications from '@/components/Forums/LastPublications'
import ForumStatistics from '@/components/Forums/ForumStatistics'
import ForumManager from '@/components/Forums/ForumManager'

export default {
  name: 'ForumDetails',
  components: {
    ForumThreads,
    LastPublications,
    ForumStatistics,
    ForumManager
  }
}
</script>

<style lang="scss" scoped>

</style>
