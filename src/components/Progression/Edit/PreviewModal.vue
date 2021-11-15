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
      <div v-html="previewContent" />
      <!-- TODO: handle attached files at the end of html content -->
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
      previewContent: ''
    }
  },
  computed: {
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
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.previewWindow {
}

.footer {
  display: flex;
  justify-content: space-around;
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
