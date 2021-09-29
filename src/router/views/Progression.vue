<template>
  <Layout :is-allowed="!$store.state.user.isStudent">
    <ProgressionList
      v-if="isListMode"
      class="progression-list"
    />
    <Progression
      v-else
      :progression="currentProgression"
      class="progression"
    />
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'
import ProgressionList from '@/components/Progression/ProgressionList'
import Progression from '@/components/Progression/Progression'

export default {
  name: 'Horaires',
  components: {
    Layout,
    ProgressionList,
    Progression
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

</style>
