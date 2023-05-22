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
    <button
      v-else-if="selectedType.type === types.TYPE_COLLABORATIVE_FOLDER && folder === undefined"
      v-t="'selectFolder'"
      @click="isFolderPickerDisplayed = true"
    />
    <RedirectionEntity
      v-else-if="selectedType.type === types.TYPE_SHARED_FILE && file !== undefined"
      class="field"
      :is-folder="false"
      :name="file.name"
      @remove="file = undefined"
    />
    <button
      v-else-if="selectedType.type === types.TYPE_SHARED_FILE && file === undefined"
      v-t="'selectFile'"
      @click="isFilePickerDisplayed = true"
    />
  </div>
  <PentilaErrorMessage
    :error-message="errorMessage"
  />

  <teleport
    v-if="isFolderPickerDisplayed"
    to="body"
  >
    <FilePickerModal
      :folder-selection="true"
      :collaborative-only="true"
      @chosenFolder="folder = $event"
      @close="isFolderPickerDisplayed = false"
    />
  </teleport>
  <teleport
    v-if="isFilePickerDisplayed"
    to="body"
  >
    <FilePickerModal
      :collaborative-only="true"
      @addedFiles="file = $event[0]"
      @close="isFilePickerDisplayed = false"
    />
  </teleport>
</template>

<script>
import Types from '@/constants/accessConstants'
import { defineAsyncComponent } from 'vue'
import FilePickerModal from '@components/FilePicker/FilePickerModal.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
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
  emits: ['updateUrl', 'updateFolder', 'updateFile', 'updateType'],
  setup: () => ({ v$: useVuelidate() }),
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
  validations () {
    const localRules = {}
    if (this.selectedType.type === Types.TYPE_EXTERNAL_URL) {
      localRules.url = {
        required
      }
    } else if (this.selectedType.type === Types.TYPE_COLLABORATIVE_FOLDER) {
      localRules.folder = {
        required
      }
    } else if (this.selectedType.type === Types.TYPE_SHARED_FILE) {
      localRules.file = {
        required
      }
    }
    return localRules
  },
  computed: {
    types () { return Types },
    formErrorList () {
      return {
        url: (this.v$.url && this.v$.url.$invalid && this.v$.url.$dirty)
          ? this.$t('urlRequired')
          : '',
        folder: (this.v$.folder && this.v$.folder.$invalid && this.v$.folder.$dirty)
          ? this.$t('folderRequired')
          : '',
        file: (this.v$.file && this.v$.file.$invalid && this.v$.file.$dirty)
          ? this.$t('fileRequired')
          : ''
      }
    },
    errorMessage () {
      switch (this.selectedType.type) {
        case Types.TYPE_EXTERNAL_URL:
          return this.formErrorList.url
        case Types.TYPE_COLLABORATIVE_FOLDER:
          return this.formErrorList.folder
        case Types.TYPE_SHARED_FILE:
          return this.formErrorList.file
        default:
          console.error('Unknown type: ' + this.selectedType.type)
          return ''
      }
    }
  },
  watch: {
    folder (value) {
      this.$emit('updateFolder', value)
    },
    file (value) {
      this.$emit('updateFile', value)
    }
  },
  created () {
    if (this.initRedirection) {
      const selectedTypeIndex = this.typeList.map(type => type.type).indexOf(this.initRedirection.type)
      if (selectedTypeIndex !== -1) {
        this.selectedType = this.typeList[selectedTypeIndex]
      }
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
      this.$emit('updateType', this.selectedType.type)
    }
  },
  methods: {
    changeType (type) {
      this.$emit('updateType', type.type)
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

button {
  margin-left: auto;
}

</style>

<i18n locale="fr">
{
  "urlPlaceHolder": "Url",
  "TYPE_EXTERNAL_URL": "Url externe",
  "TYPE_COLLABORATIVE_FOLDER": "Dossier interne",
  "TYPE_SHARED_FILE": "Fichier interne",
  "urlRequired": "Champ requis",
  "folderRequired": "Veuillez sélectionner un dossier",
  "fileRequired": "Veuillez sélectionner un fichier",
  "selectFolder": "Sélectionnez un dossier",
  "selectFile": "Sélectionnez un fichier"
}
</i18n>
