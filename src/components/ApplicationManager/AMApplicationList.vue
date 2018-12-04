<template>
  <div>
    <AMApplication
      v-for="application in applications"
      :key="application.serviceId"
      :application="application"
    />
  </div>
</template>

<script>
import AMApplication from '@/components/ApplicationManager/AMApplication'

export default {
  name: 'AMApplicationList',
  components: {
    AMApplication
  },
  props: {
    category: {
      type: String,
      default: ''
    }
  },
  computed: {
    applications () {
      var allApplications = this.$store.state.applicationManager.applicationList
      var applications = []
      for (var index = 0; index < allApplications.length; ++index) {
        var app = allApplications[index].app
        if (app.serviceCategory === this.category) {
          applications.push(app)
        }
      }
      return applications
    }
  },
  methods: {
    toggleDetails (application) {
      application.showDetails = !application.showDetails
      console.log(application.showDetails)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
