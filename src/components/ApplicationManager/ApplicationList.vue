<template>
  <div>
    <ApplicationItem
      v-for="application in sortedApplicationList"
      :key="application.serviceId"
      :application="application"
    />
  </div>
</template>

<script>
import ApplicationItem from '@/components/ApplicationManager/ApplicationItem'
import NeroUtils from '@/utils/nero.utils'

export default {
  name: 'ApplicationList',
  components: {
    ApplicationItem
  },
  props: {
    category: {
      type: String,
      default: ''
    }
  },
  computed: {
    applicationList () {
      var allApplications = this.$store.state.applicationManager.applicationList
      var applicationList = []
      for (var index = 0; index < allApplications.length; ++index) {
        var app = allApplications[index].app
        if (app.serviceCategory === this.category) {
          applicationList.push(app)
        }
      }
      return applicationList
    },
    sortedApplicationList () {
      return NeroUtils.Array.sortWithString(this.applicationList, 'serviceName')
    }
  },
  methods: {
    toggleDetails (application) {
      application.showDetails = !application.showDetails
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
