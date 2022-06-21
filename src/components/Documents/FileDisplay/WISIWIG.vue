<template>
  <div class="container">
    <TextContent
      v-if="loaded && content.contentValue !== undefined"
      class="ck"
      :content="content"
      :disabled="readOnly"
      :is-in-progression="false"
      @save="saveContent"
    />
  </div>
</template>

<script>
import TextContent from '@components/Progression/Edit/Contents/TextContent'
import fileServices from '@/api/documents/file.service'
export default {
  name: 'WISIWIG',
  components: { TextContent },
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loaded: false,
      readOnly: false,
      content: { }
    }
  },
  created () {
    this.getContent()
  },
  methods: {
    getContent () {
      fileServices.getHtmlContent(this.file.fileVersionId).then((data) => {
        if (data.content === '') {
          data.content = '<p>texte</p>'
        }
        this.content.contentValue = data.content
        this.content.order = 1 // display only one editor at time with this component
        this.readOnly = this.file.readOnly
        this.loaded = true
      })
    },
    saveContent (content) {
      if (!this.file.readonly) {
        fileServices.saveHtmlContent(this.file.fileVersionId, content.contentValue).then((data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: 'document sauvegardé!', type: 'info' })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.container{
  border: 1px solid $color-border;
  height: 100%;
  width: 100%;

  .ck {
    height: 100%;
  }
}
</style>
