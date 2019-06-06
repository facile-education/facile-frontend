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
import PentilaUtils from 'pentila-utils'

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
      return PentilaUtils.Array.sortWithString(this.applicationList, false, 'serviceName')
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
