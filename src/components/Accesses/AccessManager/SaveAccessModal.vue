<template>
  <PentilaWindow
    class="save-access-modal"
    data-test="save-access-modal"
    :modal="true"
    :draggable="true"
    @close="onClose"
  >
    <template #header>
      <span v-t="isCreation ? 'creationTitle' : 'updateTitle'" />
    </template>

    <template #body>
      <div class="first-line">
        <ThumbnailSelector
          :thumbnail-url="thumbnail"
          @selectImage="selectImage"
        />

        <div class="input">
          <PentilaInput
            ref="nameInput"
            v-model="title"
            :placeholder="$t('namePlaceHolder') + '*'"
          />
          <PentilaErrorMessage
            :error-message="formErrorList.title"
          />
        </div>

        <div class="category-selection">
          <PentilaDropdown
            v-model="selectedCategory"
            :list="categoryList"
            class="dropdown"
            display-field="categoryName"
            :sort="false"
          />
          <PentilaErrorMessage
            :error-message="formErrorList.category"
          />
        </div>
      </div>

      <div class="redirection">
        <AccessRedirectionSelector
          :init-redirection="initRedirection"
          @updateType="selectedType=$event"
          @updateUrl="updateURL"
          @updateFolder="updateFolder"
          @updateFile="updateFile"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.redirection"
        />
      </div>

      <div class="roles-selection">
        <PentilaTagsInput
          v-model="roles"
          :placeholder="$t('rolesPlaceholder') + '*'"
          :list="availableRoleList"
          :close-on-select="true"
          display-field="displayText"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.roles"
        />
      </div>
    </template>

    <template #footer>
      <PentilaButton
        data-test="submitButton"
        :label="isCreation? $t('creationSubmit') : $t('updateSubmit')"
        @click="submit"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { required } from '@vuelidate/validators'
import validators from '@utils/validators'
import { useVuelidate } from '@vuelidate/core'
import { nextTick } from 'vue'
import AccessRedirectionSelector from '@components/Accesses/AccessManager/AccessRedirectionSelector.vue'
import { defaultImagesKeys } from '@/constants/icons'
import ThumbnailSelector from '@components/Base/ThumbnailSelector.vue'
const inputMaxSize = 75
const isUnderInputMaxSize = (value) => validators.isUnderMaxSize(value, inputMaxSize)
const isNotEmpty = (list) => validators.isNotEmpty(list)
const isNotPlaceholder = (value) => value.categoryId !== -1

export default {
  name: 'SaveAccessModal',
  components: { ThumbnailSelector, AccessRedirectionSelector },
  props: {
    initAccess: {
      type: Object,
      default: undefined
    },
    initCategory: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close', 'updateAccess'],
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      title: undefined,
      selectedCategory: { categoryId: -1, categoryName: this.$t('placeholderCategory') },
      roles: [],
      initRedirection: undefined,
      selectedType: undefined,
      url: undefined,
      folderId: undefined,
      folderName: '',
      fileId: undefined,
      fileName: '',
      thumbnailId: 0,
      thumbnailUrl: 'default_access_0'
    }
  },
  validations: {
    title: {
      required,
      isUnderInputMaxSize
    },
    roles: {
      isNotEmpty
    },
    selectedCategory: {
      required,
      isNotPlaceholder
    }
  },
  computed: {
    thumbnail () {
      if (defaultImagesKeys.indexOf(this.thumbnailUrl) !== -1) {
        return require('@assets/images/' + this.thumbnailUrl + '.png')
      } else { // Returned url is a key for local default image
        return this.thumbnailUrl
      }
    },
    categoryList () {
      return this.$store.state.accessManager.categoryList
    },
    availableRoleList () {
      return this.$store.state.accessManager.roleList
    },
    isCreation () {
      return this.initAccess === undefined
    },
    formAccess () {
      return {
        access: {
          id: this.initAccess ? this.initAccess.accessId : undefined,
          title: this.title,
          type: this.selectedType,
          url: this.url,
          folderId: this.folderId ? this.folderId : '-1',
          folderName: this.folderName,
          fileId: this.fileId ? this.fileId : '-1',
          fileName: this.fileName,
          profiles: this.roles,
          // todo: thumbnail
          thumbnailId: this.thumbnailId,
          thumbnailUrl: this.thumbnailUrl
        },
        selectedCategory: this.selectedCategory
      }
    },
    formErrorList () {
      return {
        title: (this.v$.title.$invalid && this.v$.title.$dirty)
          ? (this.v$.title.$errors[0].$validator === 'required' ? this.$t('Commons.required') : this.$t('sizeLimit1') + inputMaxSize + this.$t('sizeLimit2'))
          : '',
        roles: (this.v$.roles.$invalid && this.v$.roles.$dirty)
          ? this.$t('selectRoles')
          : '',
        category: (this.v$.selectedCategory.$invalid && this.v$.selectedCategory.$dirty)
          ? this.$t('selectCategory')
          : ''
      }
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    if (this.initCategory) {
      this.selectedCategory = this.categoryList[this.initCategory.position]
    }
    if (!this.isCreation) {
      this.title = this.initAccess.title
      this.roles = this.initAccess.profiles
      this.selectedType = this.initAccess.type
      this.url = this.initAccess.url
      this.folderId = this.initAccess.folderId
      this.folderName = this.initAccess.folderName
      this.fileId = this.initAccess.fileId
      this.fileName = this.initAccess.fileName
      this.thumbnailId = this.initAccess.thumbnailId
      this.thumbnailUrl = this.initAccess.thumbnailUrl
      this.initRedirection = { // To initialize AccessRedirectionSelector component
        type: this.initAccess.type,
        url: this.initAccess.url,
        folder: { id: this.initAccess.folderId, name: this.initAccess.folderName },
        file: { id: this.initAccess.fileId, name: this.initAccess.fileName }
      }
    }
  },
  mounted () {
    const vm = this
    nextTick(function () {
      vm.$refs.nameInput.focus()
    })
  },
  methods: {
    selectImage (tempFile) {
      this.thumbnailId = tempFile.id
      this.thumbnailUrl = tempFile.fileUrl
    },
    resetRedirectionFields () {
      this.url = ''
      this.folderId = '-1'
      this.folderName = ''
      this.fileId = '-1'
      this.fileName = ''
    },
    updateURL (url) {
      this.resetRedirectionFields()
      this.url = url
    },
    updateFolder (folder) {
      this.resetRedirectionFields()
      if (folder) {
        this.folderId = folder.id
        this.folderName = folder.name
      }
    },
    updateFile (file) {
      this.resetRedirectionFields()
      if (file) {
        this.fileId = file.id
        this.fileName = file.name
      }
    },
    submit () {
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        if (this.isCreation) {
          this.createAccess()
        } else {
          this.updateAccess()
        }
      }
    },
    createAccess () {
      const access = this.formAccess.access
      const selectedCategory = this.formAccess.selectedCategory

      // Deep copy categoryList
      const newCategoryList = JSON.parse(JSON.stringify(this.categoryList))
      // Add the new access in place
      const category = newCategoryList[selectedCategory.position]
      access.position = category.accessList.length // Put in last position
      category.accessList.push(access)
      // Set the new categoryList
      this.$store.dispatch('accessManager/setCategoryList', newCategoryList)
      this.onClose()
    },
    updateAccess () {
      this.$emit('updateAccess', this.formAccess)
      this.onClose()
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

.dropdown {
  max-width: min(100%, 200px);
  white-space: nowrap;
}

.first-line, .input, .category-selection, .redirection {
  margin-bottom: 15px;
}

@media screen and (min-width: 700px) {
  .first-line {
    display: flex;
    gap: 1rem;

    .input {
      flex: 1
    }
  }
}
</style>

<i18n locale="fr">
{
  "creationTitle": "Ajouter un accès",
  "updateTitle": "Modifier un accès",
  "namePlaceHolder": "Titre",
  "placeholderCategory": "Choisir une catégorie",
  "rolesPlaceholder": "Profils cibles",
  "creationSubmit": "Créer",
  "updateSubmit": "Modifier",
  "sizeLimit1": "Ne doit pas dépasser ",
  "sizeLimit2": " caractères",
  "selectRoles": "Veuillez séléctionner au moins un profil cible",
  "selectCategory": "Veuillez séléctionner une catégorie",
  "selectFolder": "Selectionnez un dossier collaboratif",
  "selectFile": "Selectionnez un fichier collaboratif"
}
</i18n>
