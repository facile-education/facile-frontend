<template>
  <section class="version-list">
    <h4 v-t="'Documents.documentDetails.versions'" />
    <DocumentVersion
      v-for="(version, index) in fileVersions"
      :key="index"
      :document="document"
      :version="version"
      @refresh-versions="getListVersions"
      @open-version="openVersion"
    />
  </section>
</template>

<script>
import DocumentVersion from '@components/Documents/DocumentDetails/DocumentVersion'

import versionsService from '@/api/documents/version.service'

export default {
  name: 'DocumentVersionsList',
  components: { DocumentVersion },
  props: {
    document: {
      type: Object,
      required: true
    }
  },
  emits: ['viewCount', 'downloadCount'],
  data () {
    return {
      fileVersions: []
    }
  },
  watch: {
    document: {
      handler () {
        this.getListVersions()
      }
    }
  },
  created () {
    this.getListVersions()
  },
  methods: {
    getListVersions () {
      versionsService.getFileVersions(this.document.id).then((data) => {
        this.fileVersions = data.fileVersions

        let viewCount = 0
        let downloadCount = 0
        data.fileVersions.forEach(version => {
          if (version.viewCount) {
            viewCount += version.viewCount
          }
          if (version.downloadCount) {
            downloadCount += version.downloadCount
          }
        })

        if (this.document.isGroupFile) {
          this.$emit('viewCount', viewCount)
          this.$emit('downloadCount', downloadCount)
        }
      })
    },
    openVersion (fileVersionId) {
      this.$store.dispatch('documents/openFile', { ...this.document, versionId: fileVersionId, readOnly: true })
    }
  }
}
</script>

<style lang="scss" scoped>
.version-list {
  margin-top: auto;
  overflow: auto;

  h4 {
    margin-left: 10px;
    font-size: 14px;
  }
}
</style>
