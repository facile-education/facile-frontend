<template>
  <div class="dashboard">
    <DashboardNewsWidget class="news" />
    <DashboardHMNewsWidget class="news" />
    <NewsModal v-if="isNewsModalDisplayed" />
    <NewsEditionModal v-if="isNewsEditionModalDisplayed" />
    <NewsDelegationModal v-if="isNewsDelegationModalDisplayed" />
  </div>
</template>

<script>
import DashboardNewsWidget from '@/components/Dashboard/DashboardNewsWidget'
import DashboardHMNewsWidget from '@/components/Dashboard/DashboardHMNewsWidget'
import NewsDelegationModal from '@/components/News/NewsDelegationModal'
import NewsEditionModal from '@/components/News/NewsEditionModal'
import NewsModal from '@/components/News/NewsModal'

export default {
  name: 'Dashboard',
  components: {
    DashboardNewsWidget,
    DashboardHMNewsWidget,
    NewsDelegationModal,
    NewsEditionModal,
    NewsModal
  },
  computed: {
    isNewsDelegationModalDisplayed () {
      return this.$store.state.news.isDelegationModalDisplayed
    },
    isNewsEditionModalDisplayed () {
      return this.$store.state.news.isNewsEditionModalDisplayed
    },
    isNewsModalDisplayed () {
      return this.$store.state.news.isNewsModalDisplayed
    }
  }
}
</script>

<style lang="scss" scoped>
h4 {
  color: #8b9ea8;
}

.dashboard {
  background-color: #ebeff5;
  height: 100%;
  overflow-y: auto;
}

.news {
  display: inline-block;
  max-width: 50%;
}
</style>
