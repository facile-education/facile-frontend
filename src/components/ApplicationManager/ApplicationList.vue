<template>
  <div>
    <ApplicationItem
      v-for="application in sortedApplicationList"
      :key="application.applicationId"
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
      const allApplications = this.$store.state.applicationManager.applicationList
      const applicationList = []
      for (let index = 0; index < allApplications.length; ++index) {
        const app = allApplications[index]
        if (app.category === this.category) {
          applicationList.push(app)
        }
      }
      return applicationList
    },
    sortedApplicationList () {
      return PentilaUtils.Array.sortWithString(this.applicationList, false, 'applicationName')
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
