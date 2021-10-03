<template>
  <Layout
    :is-allowed="!$store.state.user.isStudent"
    class="layout"
  >
    <ProgressionList
      v-if="isListMode"
    />
    <ProgressionPanel
      v-else
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
    // init volee and subject lists
    this.$store.dispatch('progression/initSubjectList')
    this.$store.dispatch('progression/initVoleeList')
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  background: rgb(239, 243, 255);
}
</style>
