<template>
  <PentilaWindow
    :modal="true"
    class="preview-window"
    :class="{'mobile': mq.phone}"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'title'" />
    </template>

    <template #body>
      <div
        ref="htmlContent"
        class="content"
        v-html="previewContent"
      />
      <!-- TODO: handle attached files at the end of html content -->
      <PentilaSpinner v-if="nbIframesToLoad > 0" />
    </template>
  </PentilaWindow>
</template>

<script>
import { getItemPreview } from '@/api/progression.service'
import { nextTick } from 'vue'

export default {
  name: 'PreviewModal',
  inject: ['mq'],
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      previewContent: '',
      nbIframesToLoad: 0
    }
  },
  computed: {
  },
  watch: {
    previewContent (val) {
      if (val) {
        nextTick(() => {
          const htmlContent = this.$refs.htmlContent
          const iframeList = htmlContent.getElementsByTagName('iframe')
          this.nbIframesToLoad = iframeList.length

          for (let i = 0; i < iframeList.length; i++) {
            const iframe = iframeList[i]
            iframe.onload = this.changeIframeSize
          }
        })
      }
    }
  },
  created () {
    getItemPreview(this.item.itemId).then(
      (data) => {
        if (data.success) {
          this.previewContent = data.preview
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  methods: {
    changeIframeSize (event) {
      this.nbIframesToLoad--
      const iframe = event.path[0]

      iframe.style.maxHeight = '350px'
      iframe.style.height = '350px'
      // iframe.style.height = iframe.contentWindow.document.documentElement.scrollHeight + 'px' // doesn't works with cross-origin frame
    },
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.preview-window {
  .window-body {
    height: 100vh;  // Set to max possible and max-height will restrain it
    overflow-y: auto;
  }
}
</style>

<style lang="scss" scoped>

.preview-window {

  .content {
    height: 100%;
    overflow-y: auto;
  }

    .button {
      width: 150px;
    }
}
</style>

<i18n locale="fr">
{
  "cancel": "Annuler",
  "title": "Visualisation du contenu"
}
</i18n>
