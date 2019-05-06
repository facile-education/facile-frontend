<template>
  <div>
    <DashboardWidget class="news-widget">
      <div class="header theme-text-color">
        <i class="widget-icon far fa-newspaper" />
        <h4
          v-t="'Dashboard.DashboardNewsWidget.widgetHeader'"
        />
        <div class="actions">
          <NeroButton
            :title="$t('Dashboard.DashboardNewsWidget.addNewsButtonTooltip')"
            type="circle"
            icon="fa fa-plus"
            @click="openEditionModal"
          />
        </div>
      </div>
      <div class="body">
        <NewsList />
      </div>
    </DashboardWidget>
  </div>
</template>

<script>
import DashboardWidget from '@/components/Dashboard/DashboardWidget'
import NeroButton from '@/components/Nero/NeroButton'
import NewsList from '@/components/News/NewsList'

export default {
  name: 'DashboardNewsWidget',
  components: {
    DashboardWidget,
    NeroButton,
    NewsList
  },
  methods: {
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
