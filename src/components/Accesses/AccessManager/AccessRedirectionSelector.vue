<template>
  <div class="redirection-selector">
    <PentilaDropdown
      v-model="selectedType"
      :list="typeList"
      :close-on-select="true"
      display-field="label"
      :sort="false"
      @update:model-value="changeType"
    />
    <PentilaInput
      v-if="selectedType.type === types.TYPE_EXTERNAL_URL"
      v-model="url"
      class="field"
      :placeholder="$t('urlPlaceHolder') + '*'"
      @input="$emit('updateUrl', url)"
    />
    <RedirectionEntity
      v-else-if="selectedType.type === types.TYPE_COLLABORATIVE_FOLDER && folder !== undefined"
      class="field"
      :is-folder="true"
      :name="folder.name"
      @remove="folder = undefined"
    />
    <RedirectionEntity
      v-else-if="selectedType.type === types.TYPE_SHARED_FILE && file !== undefined"
      class="field"
      :is-folder="false"
      :name="file.name"
      @remove="file = undefined"
    />
  </div>

  <teleport
    v-if="isFolderPickerDisplayed"
    to="body"
  >
    <FilePickerModal
      :folder-selection="true"
      @chosenFolder="folder = $event"
      @close="isFolderPickerDisplayed = false"
    />
  </teleport>
  <teleport
    v-if="isFilePickerDisplayed"
    to="body"
  >
    <FilePickerModal
      @addedFiles="file = $event[0]"
      @close="isFilePickerDisplayed = false"
    />
  </teleport>
</template>

<script>
import Types from '@/constants/accessConstants'
import { defineAsyncComponent } from 'vue'
import FilePickerModal from '@components/FilePicker/FilePickerModal.vue'
const RedirectionEntity = defineAsyncComponent(() => import('@components/Accesses/AccessManager/RedirectionEntity.vue'))

export default {
  name: 'AccessRedirectionSelector',
  components: { FilePickerModal, RedirectionEntity },
  props: {
    initRedirection: {
      type: Object,
      default: undefined
    }
  },
  emits: ['updateUrl', 'updateFolderId', 'updateFileId', 'updateType'],
  data () {
    return {
      typeList: [
        { type: Types.TYPE_EXTERNAL_URL, label: this.$t('TYPE_EXTERNAL_URL') },
        { type: Types.TYPE_COLLABORATIVE_FOLDER, label: this.$t('TYPE_COLLABORATIVE_FOLDER') },
        { type: Types.TYPE_SHARED_FILE, label: this.$t('TYPE_SHARED_FILE') }
      ],
      selectedType: undefined,
      url: undefined,
      folder: undefined,
      file: undefined,
      isFolderPickerDisplayed: false,
      isFilePickerDisplayed: false
    }
  },
  computed: {
    types () { return Types }
  },
  watch: {
    folder (value) {
      this.$emit('updateFolderId', value ? value.id : undefined)
    },
    file (value) {
      this.$emit('updateFileId', value ? value.id : undefined)
    }
  },
  created () {
    if (this.initRedirection) {
      this.selectedType = this.initRedirection.type
      switch (this.initRedirection.type) {
        case Types.TYPE_EXTERNAL_URL:
          this.url = this.initRedirection.url
          break
        case Types.TYPE_COLLABORATIVE_FOLDER:
          this.folder = this.initRedirection.folder
          break
        case Types.TYPE_SHARED_FILE:
          this.file = this.initRedirection.file
          break
        default:
          console.error('Unknown type: ' + this.initRedirection.type)
      }
    } else {
      this.selectedType = { type: Types.TYPE_EXTERNAL_URL, label: this.$t('TYPE_EXTERNAL_URL') }
      this.$emit('updateType', this.selectedType)
    }
  },
  methods: {
    changeType (type) {
      this.$emit('updateType', type)
      if (type.type === Types.TYPE_COLLABORATIVE_FOLDER) {
        this.isFolderPickerDisplayed = true
      } else if (type.type === Types.TYPE_SHARED_FILE) {
        this.isFilePickerDisplayed = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.redirection-selector {
  display: flex;
  align-items: center;

  .field {
    margin-left: 1rem;
    flex: 1;
  }
}

</style>

<i18n locale="fr">
{
  "urlPlaceHolder": "Url",
  "TYPE_EXTERNAL_URL": "Url externe",
  "TYPE_COLLABORATIVE_FOLDER": "Dossier interne",
  "TYPE_SHARED_FILE": "Fichier interne"
}
</i18n>
