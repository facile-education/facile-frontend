<template>
  <div class="version-list">
    <h4 v-t="'Documents.documentDetails.versions'" />
    <DocumentVersion
      v-for="(version, index) in fileVersions"
      :key="index"
      :version="version"
      @refreshVersions="getListVersions"
      @openVersion="openVersion"
    />
  </div>
</template>

<script>
import versionsService from '@/api/documents/version.service'
import DocumentVersion from '@components/Documents/DocumentDetails/DocumentVersion'

export default {
  name: 'DocumentVersionsList',
  components: { DocumentVersion },
  props: {
    document: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      fileVersions: []
    }
  },
  watch: {
    document: {
      handler () {
        console.log('dfrbyf')
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
  max-height: 50%;
  overflow: auto;
  padding: 0 10px;
}
</style>
