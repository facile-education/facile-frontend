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
        :initial-content="content.contentValue"
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
        class="title"
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
      <div
        class="title"
      >
        <img
          class="content-icon"
          src="@assets/play.svg"
        >
        <span>{{ $t('video') }}</span>
      </div>
      <span>{{ content.contentName }}</span>
      <a :href="content.contentValue">{{ content.contentValue }}</a>
    </div>

    <!-- File -->
    <FileContent
      v-if="content.contentType === 5"
      :file-id="content.fileEntryId"
      :file-name="content.contentName"
    />

    <!-- H5P -->
    <div
      v-if="content.contentType === 6"
      class="content-h5p"
    >
      <div
        class="title"
      >
        <img
          class="content-icon"
          src="@assets/icon_h5p.svg"
        >
        <span>{{ $t('h5p') }}</span>
      </div>
      <span>{{ content.contentName }}</span>
      <a :href="content.contentValue">{{ content.contentValue }}</a>
    </div>

    <!-- Delete content button -->
    <div class="buttons-panel">
      <img
        v-if="isEditableContent"
        class="content-button"
        src="@assets/edit.svg"
        :alt="$t('edit')"
        :title="$t('edit')"
        @click="editContent()"
      >
      <img
        class="content-button"
        src="@assets/trash.svg"
        :alt="$t('delete')"
        :title="$t('delete')"
        @click="confirmContentDeletion()"
      >
    </div>
  </div>
</template>

<script>
import CkEditor from '@/components/Nero/CKEditor'
import FileContent from '@components/Progression/Edit/Contents/FileContent'

export default {
  name: 'ProgressionItemContent',
  components: { FileContent, CkEditor },
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  emits: ['editContent'],
  data () {
    return {
      editorOptions: {},
      timeout: undefined
    }
  },
  computed: {
    editorId () {
      // Used to manage multiple editors - editorId is based on the (unique) order
      return 'editor' + this.content.order
    },
    isEditableContent () {
      // Link, video and h5p are editable
      return this.content.contentType === 3 || this.content.contentType === 4 || this.content.contentType === 6
    }
  },
  created () {
  },
  methods: {
    updateInput (value) {
      console.log('TODO: updateInput ', value)
    },
    updateContent (newValue) {
      clearTimeout(this.timeout)
      // 2s timeout
      this.timeout = setTimeout(() => {
        this.$store.dispatch('progression/updateItemContent', { contentId: this.content.contentId, contentName: this.content.contentName, contentValue: newValue, order: this.content.order })
      }, 2000)
    },
    confirmContentDeletion () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('deleteContentWarning'),
        lastAction: { fct: this.deleteContent }
      })
    },
    deleteContent () {
      this.$store.dispatch('progression/deleteItemContent', this.content.contentId)
    },
    editContent () {
      this.$emit('editContent', this.content)
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
  .content-link, .content-video, .content-h5p {
    height: 80px;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    .title {
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
  .buttons-panel {
    width: 40px;
    margin: auto;
    display: flex;
    flex-direction: column;
    .content-button {
      display: none;
      margin: auto;
      margin-right: 30px;
      border: 1px solid transparent;
      border-radius: 5px;
      margin: 7px;
      &:hover {
        border: 1px solid grey;
        cursor: pointer;
      }
    }
  }
  &:hover .content-button {
    display: block;
  }
}
</style>

<i18n locale="fr">
{
  "session": "Séance",
  "delete": "Supprimer cet élément",
  "edit": "Modifier cet élément",
  "deleteContentWarning": "Supprimer ce contenu ?",
  "externalLink": "Lien externe",
  "video": "Video",
  "h5p": "Contenu H5P"
}
</i18n>
