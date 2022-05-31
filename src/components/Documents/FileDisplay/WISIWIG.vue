<template>
  <TextContent
    :content="content"
    :disabled="readonly"
  />
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
      content: undefined,
      readonly: false
    }
  },
  created () {
    this.getContent()
  },
  methods: {
    getContent () {
      fileServices.getHtmlContent(this.file.version).then((data) => {
        this.content = data.content
      })
    },
    saveContent () {
      fileServices.saveHtmlContent(this.file.version, this.content).then((data) => {
        alert('document saved!')
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
