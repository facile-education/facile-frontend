<template>
  <Layout
    class="layout"
  >
    <button
      class="close"
      :title="$t('close')"
      @click="back"
    >
      <BaseIcon name="times" />
    </button>
    <FileDisplay
      v-if="file !== undefined"
      :file="file"
    />
  </Layout>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import BaseIcon from '@/components/Base/BaseIcon'
import Layout from '@/router/layouts/EmptyLayout'
const FileDisplay = defineAsyncComponent(() => import('@/components/Documents/FileDisplay/FileDisplay'))

export default {
  name: 'Progression',
  components: { BaseIcon, Layout, FileDisplay },
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
  },
  methods: {
    back () {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
}

.close {
  position: absolute;
  right: 0;
  margin: 15px;
  background: none;
  border: none;
  height: 30px;
  width: 30px;
  font-size: 1.3rem;
  padding: 0;
  cursor: pointer;
}
</style>

<i18n locale="fr">
{
  "close": "Retour"
}
</i18n>
