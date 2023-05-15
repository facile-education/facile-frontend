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
            display-field="categoryName"
            :sort="false"
          />
          <PentilaErrorMessage
            :error-message="formErrorList.category"
          />
        </div>
      </div>

      <div class="input">
        <PentilaInput
          v-model="url"
          :placeholder="$t('urlPlaceHolder') + '*'"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.url"
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
import { getBroadcastRoleList } from '@/api/role.service'
import { required } from '@vuelidate/validators'
import validators from '@utils/validators'
import { useVuelidate } from '@vuelidate/core'
const inputMaxSize = 75
const isUnderInputMaxSize = (value) => validators.isUnderMaxSize(value, inputMaxSize)
const isNotEmpty = (list) => validators.isNotEmpty(list)
const isNotPlaceholder = (value) => value.categoryId !== -1

export default {
  name: 'SaveAccessModal',
  props: {
    initAccess: {
      type: Object,
      default: undefined
    },
    categoryList: {
      type: Array,
      required: true
    }
  },
  emits: ['close', 'createAccess', 'updateAccess'],
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      title: undefined,
      selectedCategory: { categoryId: -1, categoryName: this.$t('placeholderCategory') },
      url: undefined,
      roles: [],
      availableRoleList: []
    }
  },
  validations: {
    title: {
      required,
      isUnderInputMaxSize
    },
    url: {
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
    isCreation () {
      return this.initAccess === undefined
    },
    formAccess () {
      return {
        id: this.initAccess ? this.initAccess.accessId : undefined,
        title: this.title,
        categoryId: this.selectedCategory.categoryId,
        url: this.url,
        roles: this.roles
        // todo: thumbnail
      }
    },
    formErrorList () {
      return {
        title: (this.v$.title.$invalid && this.v$.title.$dirty)
          ? (this.v$.title.$errors[0].$validator === 'required' ? this.$t('Commons.required') : this.$t('sizeLimit1') + inputMaxSize + this.$t('sizeLimit2'))
          : '',
        url: (this.v$.url.$invalid && this.v$.url.$dirty)
          ? (this.v$.url.$errors[0].$validator === 'required' ? this.$t('Commons.required') : this.$t('sizeLimit1') + inputMaxSize + this.$t('sizeLimit2'))
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
    this.getRoleList()
    if (!this.isCreation) {
      this.title = this.initAccess.title
      this.url = this.initAccess.url
      this.roles = this.initAccess.roles
      const categoryIndex = this.categoryList.map(category => category.categoryId).indexOf(this.initAccess.categoryId)
      if (categoryIndex !== -1) {
        this.selectedCategory = this.initAccess.categoryId
      }
    }
  },
  methods: {
    getRoleList () {
      getBroadcastRoleList().then((data) => {
        if (data.success) {
          this.availableRoleList = data.roles
        } else {
          console.error('Error while getting users', data.error)
        }
      })
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
      this.$emit('createAccess', this.formAccess)
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

.input, .category-selection {
  margin-bottom: 15px;
}

@media screen and (min-width: 700px) {
  .first-line {
    display: flex;

    .input {
      flex: 1
    }

    .category-selection {
      margin-left: 15px;
    }
  }
}
</style>

<i18n locale="fr">
{
  "creationTitle": "Ajouter un accès",
  "updateTitle": "Modifier un accès",
  "namePlaceHolder": "Titre",
  "urlPlaceHolder": "Url",
  "placeholderCategory": "Choisir une catégorie",
  "rolesPlaceholder": "Profils cibles",
  "creationSubmit": "Créer",
  "updateSubmit": "modifier",
  "sizeLimit1": "Ne doit pas dépasser ",
  "sizeLimit2": " caractères",
  "selectRoles": "Veuillez séléctionner au moins un profil cible",
  "selectCategory": "Veuillez séléctionner une catégorie"
}
</i18n>
