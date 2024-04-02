<template>
  <ServicesWrapper
    :is-title-visible="true"
    :title="$t('Dashboard.serviceTitle')"
  >
    <div class="dashboard-panel">
      <div class="left">
        <LogbookWidget
          v-if="currentUser.isParent && isDisplayedLogbook && !isLoading"
          :logbook-data="logbookData"
        />
        <WeprodeSpinner
          v-if="isLoading"
          style="z-index: 1"
        />
        <ActivityWidget1D />
      </div>
      <div class="right">
        <NewsWidget1D />
      </div>
    </div>
  </ServicesWrapper>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import { getLogbookUnReadEntries } from '@/api/dashboard/logbook.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

import ServicesWrapper from '../../components/ServicesWrapper/ServicesWrapper.vue'
const LogbookWidget = defineAsyncComponent(() => import('@components/Dashboard1D/Logbook/LogbookWidget1D.vue'))
const ActivityWidget1D = defineAsyncComponent(() => import('@components/Dashboard1D/Activity/ActivityWidget1D.vue'))
const NewsWidget1D = defineAsyncComponent(() => import('@components/Dashboard1D/News/NewsWidget1D.vue'))

export default {
  name: 'Dashboard',
  components: { ServicesWrapper, LogbookWidget, ActivityWidget1D, NewsWidget1D, WeprodeSpinner },
  emits: ['update:layout'],
  data () {
    return {
      logbookData: [],
      isDisplayedLogbook: false,
      isLoading: true,
      error: false
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user
    }
  },
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  },
  created () {
    this.$store.dispatch('dashboard/initDashboard')
    if (this.currentUser.isParent) {
      this.loadLogbookData()
    }
  },
  methods: {
    loadLogbookData () {
      this.isLoading = true
      getLogbookUnReadEntries().then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.logbookData = data.unreadLogbookEntries
          if (this.logbookData.length > 1) {
            if (this.logbookData.some(entry => entry.nbUnreadLogbookEntries > 0)) {
              this.isDisplayedLogbook = true
            }
          } else {
            if (this.logbookData[0].nbUnreadLogbookEntries > 0) {
              this.isDisplayedLogbook = true
            }
          }
        } else {
          this.error = true
          console.error('Error')
        }
      }, (err) => {
        this.isLoading = false
        this.error = true
        console.error(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.dashboard-panel{
  display: flex;
  height: 100%;
  width: 100%;
  gap: 50px;
}

.left{
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  gap: 50px;
}

.right{
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  gap: 50px;
}

@media screen and (max-width: 1260px) {
  .dashboard-panel{
    flex-direction: column;
    height: 100%;
    width: 100%;
    gap: 30px;
  }

  .left{
    height: auto;
    flex: none;
  }

  .right{
    height: auto;
    flex: none;
  }
}
</style>
