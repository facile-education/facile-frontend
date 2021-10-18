<template>
  <Layout
    :is-allowed="!$store.state.user.isStudent"
    class="layout"
  >
    <ProgressionList
      v-if="isListMode"
      class="progression-list"
    />
    <ProgressionPanel
      v-else
      class="progression"
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
  data () {
    return {
      result: {}
    }
  },
  computed: {
    isListMode () {
      return this.$store.state.progression.isListMode
    },
    currentProgression () {
      return this.$store.state.progression.currentProgression
    }
  },
  created () {
    // init volee, subject and session lists
    this.$store.dispatch('progression/initSubjectList')
    this.$store.dispatch('progression/initVoleeList')
    this.$store.dispatch('progression/initCoursList')
    this.$store.dispatch('cdt/getConfiguration')
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  width: 100%;
  .progression-list {
    width: 100%;
    height: 100%;
    background: rgb(239, 243, 255);
  }
  .progression {
    width: 98%;
    height: 100%;
    background: white;
  }
}
</style>
