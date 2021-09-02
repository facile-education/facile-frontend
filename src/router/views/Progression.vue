<template>
  <!-- TODO Only teachers ? -->
  <Layout :is-allowed="!($store.state.user.isStudent || $store.state.user.isParent)">
    <div style="display:flex; gap:1rem;">
      <PentilaButton
        @click="getProgressionContent"
      >
        Get progression 0
      </PentilaButton>
      <PentilaButton
        @click="addFolder"
      >
        Add folder to Progression 0
      </PentilaButton>
      <PentilaButton
        @click="addItem"
      >
        Add item to Progression 0
      </PentilaButton>
    </div>

    <div>result :<br> {{ result }}</div>

    <ProgressionList />
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'
import ProgressionList from '@/components/Progression/ProgressionList'

import { addFolder, addItem, getProgressionContent } from '@/api/progression.service'

// Lazy loading
// import { defineAsyncComponent } from 'vue'
// const Timeline = defineAsyncComponent(() => import('@/components/Horaires/Timeline'))

export default {
  name: 'Horaires',
  components: {
    Layout,
    ProgressionList
  },
  // inject: ['mq'],
  data () {
    return {
      result: {}
    }
  },
  computed: {
  },
  created () {
    // this.$store.dispatch('cdt/getConfiguration')
    // init volee and subject lists
    this.$store.dispatch('progression/initSubjectList')
    this.$store.dispatch('progression/initVoleeList')
  },
  methods: {
    addFolder () {
      const folder = {
        progressionId: 0,
        parentFolderId: 0,
        name: 'My folder',
        order: 0
      }
      // WS
      addFolder(folder).then(
        (data) => {
          this.result = data
        },
        (err) => {
          console.error(err)
          this.result = err
        })
    },
    addItem () {
      const item = {
        progressionId: 0,
        folderId: 0,
        name: 'My item',
        isHomework: false,
        type: 1,
        content: 'My item content',
        order: 0
      }
      // WS
      addItem(item).then(
        (data) => {
          this.result = data
        },
        (err) => {
          console.error(err)
          this.result = err
        })
    },
    getProgressionContent () {
      // Call WS
      getProgressionContent(0).then(
        (data) => {
          this.result = data
        },
        (err) => {
          console.error(err)
          this.result = err
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
