<template>
  <PentilaWindow
    :modal="true"
    class="previewWindow"
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

    <template #footer>
      <div class="footer">
        <PentilaButton
          :label="$t('cancel')"
          class="button cancel-button"
          @click="closeModal"
        />
      </div>
    </template>
  </PentilaWindow>
</template>

<script>
import { getItemPreview } from '@/api/progression.service'

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
        this.$nextTick(() => {
          const htmlContent = this.$refs.htmlContent
          const iframeList = htmlContent.getElementsByTagName('iframe')
          this.nbIframesToLoad = iframeList.length
          iframeList.forEach((iframe) => {
            iframe.onload = this.changeIframeSize
          })
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
      iframe.style.height = iframe.contentWindow.document.documentElement.scrollHeight + 'px'
    },
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

.previewWindow {

  .content {
    height: calc(100% - 55px);
    overflow-y: auto;
  }

  .footer {
    display: flex;
    justify-content: space-around;

    .button {
      width: 150px;
    }
  }
}
</style>

<i18n locale="fr">
{
  "cancel": "Annuler",
  "title": "Visualisation du contenu"
}
</i18n>
