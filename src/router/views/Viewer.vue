<template>
  <div class="viewer">
    <header>
      <h1 class="name">
        {{ loadedDoc?.fileName }}
      </h1>

      <button
        class="close"
        :title="$t('Viewer.close')"
        @click="back"
      >
        <BaseIcon name="times" />
      </button>
    </header>

    <FileDisplay
      v-if="file !== undefined"
      :file="file"
      @document-loaded="loadedDoc = $event"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import BaseIcon from '@/components/Base/BaseIcon'
const FileDisplay = defineAsyncComponent(() => import('@/components/Documents/FileDisplay/FileDisplay'))

export default {
  name: 'Viewer',
  components: { BaseIcon, FileDisplay },
  emits: ['update:layout'],
  data () {
    return {
      file: undefined,
      loadedDoc: undefined
    }
  },
  beforeCreate () {
    this.$emit('update:layout', 'EmptyLayout')
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
@import "@design";

.viewer {
  height: 100%;
}

header {
  display: flex;
  align-items: center;
}

h1 {
  margin: 0;
  display: flex;
  font-size: 1.3rem;
  font-weight: bold;
  padding-left: 10px;

  @extend %no-text-highlight;
}

.close {
  margin: 15px 15px 15px auto;
  background: none;
  border: none;
  height: 30px;
  width: 30px;
  font-size: 1.3rem;
  padding: 0;
  cursor: pointer;
}
</style>
