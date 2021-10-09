<template>
  <div
    class="item-content"
  >
    <!-- Text -->
    <div
      v-if="content.contentType === 1"
      class="content-text"
    >
      <CkEditor
        :initial-content="content.content"
        :editor-id="editorId"
        :options="editorOptions"
        @input="updateContent"
      />
    </div>

    <!-- Audio -->
    <div
      v-if="content.contentType === 2"
      class="content-audio"
    >
      <span>record audio</span>
    </div>

    <!-- Link -->
    <div
      v-if="content.contentType === 3"
      class="content-link"
    >
      <div
        class="link-title"
      >
        <img
          class="content-icon"
          src="@assets/icon_link.svg"
        >
        <span>{{ $t('externalLink') }}</span>
      </div>
      <span>{{ content.contentName }}</span>
      <a :href="content.contentValue">{{ content.contentValue }}</a>
    </div>

    <!-- Video -->
    <div
      v-if="content.contentType === 4"
      class="content-video"
    >
      <span>video</span>
    </div>

    <!-- File -->
    <div
      v-if="content.contentType === 5"
      class="content-file"
    >
      <span>fichier</span>
    </div>

    <!-- H5P -->
    <div
      v-if="content.contentType === 6"
      class="content-h5p"
    >
      <span>contenu h5p</span>
    </div>

    <!-- Delete content button -->
    <img
      class="delete-content-button"
      src="@assets/trash.svg"
      :alt="$t('delete')"
      :title="$t('delete')"
      @click="confirmContentDeletion(item)"
    >
  </div>
</template>

<script>
import CkEditor from '@/components/Nero/CKEditor'

export default {
  name: 'ProgressionItemContent',
  components: { CkEditor },
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      editorOptions: {}
    }
  },
  computed: {
    editorId () {
      // Used to manage multiple editors - editorId is based on the (unique) order
      return 'editor' + this.content.order
    }
  },
  created () {
  },
  methods: {
    updateInput (value) {
      console.log('updateInput ', value)
    },
    blurInput (value) {
      console.log('blurInput ', value)
    },
    updateContent () {
      console.log('update ck content')
    },
    confirmContentDeletion () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('deleteContentWarning'),
        lastAction: { fct: this.deleteContent }
      })
    },
    deleteContent () {
      this.$store.dispatch('progression/deleteItemContent', this.content)
    }
  }
}
</script>

<style lang="scss" scoped>
.item-content {
  border: 1px solid #D4D4D4;
  background-color: #FFFFFF;
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  justify-content: space-between;
  .content-text {
    width: 90%;
    margin: auto;
  }
  .content-link {
    height: 80px;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    .link-title {
      margin-top: 5px;
      img {
        width: 10px;
        height: 10px;
        margin: auto;
        margin-right: 5px;
      }
      span {
        margin: auto;
        font-size: 12px;
      }
    }
    span {
      margin-top: 5px;
    }
  }
  .delete-content-button {
    margin: auto;
    margin-right: 30px;
  }
}
</style>

<i18n locale="fr">
{
  "session": "Séance",
  "delete": "Supprimer cet élément",
  "deleteContentWarning": "Supprimer ce contenu ?",
  "externalLink": "Lien externe"
}
</i18n>
