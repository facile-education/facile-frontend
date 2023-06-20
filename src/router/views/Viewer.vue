<template>
  <Layout
    class="layout"
  >
    <FileDisplay
      v-if="file !== undefined"
      :file="file"
    />
  </Layout>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import Layout from '@/router/layouts/EmptyLayout'
const FileDisplay = defineAsyncComponent(() => import('@/components/Documents/FileDisplay/FileDisplay'))

export default {
  name: 'Progression',
  components: { Layout, FileDisplay },
  data () {
    return {
      file: undefined
    }
  },
  computed: {
  },
  created () {
    // Watch route changes to react on fileEntryId change
    this.$watch(
      () => this.$route.params,
      () => {
        if (this.$route.params.fileEntryId) {
          this.file = { id: this.$route.params.fileEntryId, readOnly: true }
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

}
</style>

<i18n locale="fr">
{
}
</i18n>
