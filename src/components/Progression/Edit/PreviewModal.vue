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
      <span>preview content</span>
    </template>

    <template #footer>
      <div
        class="footer"
      >
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
    }
  },
  computed: {
  },
  created () {
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
  "title": "Visualisation du contenu ",
}
</i18n>
