<template>
  <div
    class="user-access"
    tabindex="0"
    :title="access.title"
    @click="openAccess"
    @keyup.enter="openAccess"
  >
    <img
      class="thumbnail"
      :src="thumbnail"
      alt="thumbnail"
    >
    <div class="title">
      {{ access.title }}
    </div>
  </div>
</template>

<script>
import { getThumbnailUrl } from '@utils/accessUtils'

import Types from '@/constants/accessConstants'

export default {
  name: 'UserAccess',
  props: {
    access: {
      type: Object,
      required: true
    }
  },
  computed: {
    thumbnail () {
      return getThumbnailUrl(this.access, this.$store)
    }
  },
  methods: {
    openAccess () {
      switch (this.access.type) {
        case Types.TYPE_EXTERNAL_URL:
          window.open(this.access.url, '_blank').focus()
          break
        case Types.TYPE_COLLABORATIVE_FOLDER:
          this.$router.push('/documents/groups/' + this.access.folderId)
          break
        case Types.TYPE_SHARED_FILE:
          this.$store.dispatch('documents/openFile', { id: this.access.fileId + '', name: this.access.fileName, readOnly: false })
          break
        default:
          console.error('Unknown type: ' + this.access.type)
          break
      }
      this.$store.dispatch('accessManager/closeAccessModal')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.user-access {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.thumbnail {
  height: 64px;
  width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: 0.75rem;
}

.title {
  width: 80px;
  max-width: 80px;
  margin-top: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  @extend %font-regular-s;
}
</style>
