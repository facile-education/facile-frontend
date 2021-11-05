<template>
  <Layout
    :is-allowed="!$store.state.user.isStudent && !$store.state.user.isParent"
    class="layout"
  >
    <PentilaSpinner v-if="areActionsInProgress" />
    <ProgressionPanel
      v-if="progressionSelected"
      class="progression"
    />
    <ProgressionList
      v-else
      class="progression-list"
    />
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'
import ProgressionList from '@/components/Progression/ProgressionList'
import ProgressionPanel from '@/components/Progression/ProgressionPanel'

export default {
  name: 'Progression',
  components: {
    Layout,
    ProgressionList,
    ProgressionPanel
  },
  computed: {
    areActionsInProgress () {
      return this.$store.getters['currentActions/areActionsInProgress']
    },
    progressionSelected () {
      return (this.$route.params.progressionId !== undefined &&
        this.$store.state.progression.currentProgression !== undefined)
    }
  },
  created () {
    // Watch route changes to react on progressionId change
    this.$watch(
      () => this.$route.params,
      () => {
        if (this.$route.params.progressionId) {
          // Init cdt conf and session list
          this.$store.dispatch('cdt/getConfiguration')

          const teacherGroups = this.$store.state.progression.teacherGroups
          if (teacherGroups === undefined) {
            this.$store.dispatch('progression/initCoursList')
          }

          this.$store.dispatch('progression/getProgressionContent', this.$route.params.progressionId)
          // Set default folder
          // if (this.$store.state.progression.currentProgression.sections !== undefined && this.$store.state.progression.currentProgression.sections.length > 0) {
          //   this.$store.dispatch('progression/setCurrentFolder', this.$store.state.progression.currentProgression.sections[0])
          // }
        } else {
          // init volee, subject
          const subjectList = this.$store.state.progression.subjectList
          const voleeList = this.$store.state.progression.voleeList
          if (subjectList === undefined || voleeList === undefined) {
            this.$store.dispatch('progression/initSubjectList')
            this.$store.dispatch('progression/initVoleeList')
          }
        }
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    )
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;

  .progression-list {
    height: 100%;
  }

  .progression {
    width: 100%;
    height: 100%;
    background: white;
  }
}
</style>
