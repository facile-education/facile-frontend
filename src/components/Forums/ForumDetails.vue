<template>
  <div>
    <NeroTabList>
      <NeroTabItem :title="$t('Forums.ForumDetails.threadsTabLabel')">
        <ForumThreads />
      </NeroTabItem>
      <NeroTabItem :title="$t('Forums.ForumDetails.lastPublicationsTabLabel')">
        <LastPublications />
      </NeroTabItem>
      <NeroTabItem :title="$t('Forums.ForumDetails.statisticsTabLabel')">
        <ForumStatistics />
      </NeroTabItem>
      <NeroTabItem :title="$t('Forums.ForumDetails.managerTabLabel')">
        <ForumManager />
      </NeroTabItem>
    </NeroTabList>
  </div>
</template>

<script>
import NeroTabList from '@/components/NeroTabList'
import NeroTabItem from '@/components/NeroTabItem'
import ForumThreads from '@/components/Forums/ForumThreads'
import LastPublications from '@/components/Forums/LastPublications'
import ForumStatistics from '@/components/Forums/ForumStatistics'
import ForumManager from '@/components/Forums/ForumManager'

export default {
  name: 'ForumDetails',
  components: {
    NeroTabList,
    NeroTabItem,
    ForumThreads,
    LastPublications,
    ForumStatistics,
    ForumManager
  }
}
</script>

<style lang="scss" scoped>

</style>
