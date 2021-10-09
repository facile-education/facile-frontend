<template>
  <PentilaWindow
    :modal="true"
    class="linkWindow"
    :class="{'mobile': mq.phone}"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'title'" />
    </template>

    <template #body>
      <PentilaInput
        :v-model="link.linkName"
        :maxlength="200"
        :placeholder="$t('namePlaceholder')"
        class="link-name"
      />
      <PentilaInput
        :v-model="link.linkUrl"
        :maxlength="200"
        :placeholder="$t('urlPlaceholder')"
        class="link-url"
      />
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
        <PentilaButton
          :label="$t('add')"
          class="button create-button"
          @click="addLink"
        />
      </div>
    </template>
  </PentilaWindow>
</template>

<script>

export default {
  name: 'LinkModal',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      link: {
        linkName: '',
        linkUrl: ''
      }
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    addLink () {
      console.log('this.linkName=', this.link.linkName)
      this.$store.dispatch('progression/addLink', { itemId: this.item.itemId, linkName: this.link.linkName, linkUrl: this.link.linkUrl })
      this.closeModal()
    }
  }
}
</script>

<style lang="scss" scoped>
.linkWindow {
  span {
    text-align: center;
    margin: 10px;
  }
  .link-url, .link-name {
    margin: 10px;
  }
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
  "title": "Ajouter un lien",
  "cancel": "Annuler",
  "add": "Ajouter",
  "namePlaceholder": "Mon lien",
  "urlPlaceholder": "https://wwww.monlien.com"
}
</i18n>
