<template>
  <!-- TODO Only teachers ? -->
  <Layout :is-allowed="!($store.state.user.isStudent || $store.state.user.isParent)">
    <div>ProgressionId : {{ progressionId }}</div>
    <div style="display:flex; gap:1rem;">
      <PentilaButton
        @click="addProgression"
      >
        Add progression
      </PentilaButton>
      <PentilaButton
        @click="getProgressionList"
      >
        Get progression list
      </PentilaButton>
      <PentilaButton
        @click="getProgressionContent"
      >
        Get progression {{ progressionId }}
      </PentilaButton>
      <PentilaButton
        @click="addFolder"
      >
        Add folder to Progression {{ progressionId }}
      </PentilaButton>
      <PentilaButton
        @click="addItem"
      >
        Add item to Progression {{ progressionId }}
      </PentilaButton>
    </div>

    <div>result :<br> {{ result }}</div>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'

import { addFolder, addItem, addProgression, getProgressionContent, getProgressionList } from '@/api/progression.service'

// Lazy loading
// import { defineAsyncComponent } from 'vue'
// const Timeline = defineAsyncComponent(() => import('@/components/Horaires/Timeline'))

export default {
  name: 'Horaires',
  components: {
    Layout
  },
  // inject: ['mq'],
  data () {
    return {
      progressionId: 0,
      result: {}
    }
  },
  computed: {
  },
  created () {
    // this.$store.dispatch('cdt/getConfiguration')
  },
  methods: {
    addFolder () {
      const folder = {
        progressionId: this.progressionId,
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
        progressionId: this.progressionId,
        folderId: 0,
        name: 'My item',
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
    addProgression () {
      const progression = {
        name: 'Hello',
        description: 'Progression',
        subjectId: 0,
        volee: '9',
        image: null
      }
      // Call WS
      addProgression(progression).then(
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
      getProgressionContent(this.progressionId).then(
        (data) => {
          this.result = data
        },
        (err) => {
          console.error(err)
          this.result = err
        })
    },
    getProgressionList () {
      // Call WS
      getProgressionList().then(
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
