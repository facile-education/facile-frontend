<template>
  <div>
    <DashboardWidget class="news-widget">
      <div class="header theme-text-color">
        <i class="widget-icon far fa-newspaper" />
        <h4
          v-t="'Dashboard.DashboardHMNewsWidget.widgetHeader'"
        />
        <div class="actions">
          <NeroButton
            :title="$t('Dashboard.DashboardHMNewsWidget.manageDelegateButtonTooltip')"
            type="circle"
            icon="fa fa-cogs"
            @click="openDelegationModal"
          />
          <NeroButton
            :title="$t('Dashboard.DashboardHMNewsWidget.addNewsButtonTooltip')"
            type="circle"
            icon="fa fa-plus"
            @click="openEditionModal"
          />
        </div>
      </div>
      <div class="body">
        <NewsList :is-head-master="isHeadMaster" />
      </div>
    </DashboardWidget>
  </div>
</template>

<script>
import DashboardWidget from '@/components/Dashboard/DashboardWidget'
import NeroButton from '@/components/Nero/NeroButton'
import NewsList from '@/components/News/NewsList'

export default {
  name: 'DashboardHMNewsWidget',
  components: {
    DashboardWidget,
    NeroButton,
    NewsList
  },
  data () {
    return {
      isHeadMaster: true
    }
  },
  methods: {
    openDelegationModal () {
      this.$store.dispatch('news/openDelegationModal')
    },
    openEditionModal () {
      this.$store.dispatch('news/selectEmptyNews')
      this.$store.dispatch('news/openEditionModal')
    }
  }
}
</script>

<style lang="scss" scoped>
.news-widget {
  background: none;
}
</style>
