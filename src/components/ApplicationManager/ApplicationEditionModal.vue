<template>
  <WeprodeWindow
    :modal="true"
    class="app-edition-modal"
    :full-screen="mq.phone || mq.tablet"
    @close="closeModal"
  >
    <template #header>
      <span v-t="title" />
    </template>

    <template
      v-if="application"
      #body
    >
      <div class="first-block">
        <!-- App Image -->
        <div
          class="logo-panel"
          @click="toggleImagePicker"
        >
          <WeprodeButton
            v-if="application.image"
            type="circle"
            class="remove-logo delete"
            @click.stop="removeLogo"
          >
            <img
              src="@/assets/icons/trash3.svg"
              :alt="$t('deleteButtonTooltip')"
            >
          </WeprodeButton>

          <img
            v-if="application.image"
            :src="application.image"
            alt="application_icon"
            class="logo"
          >
          <NeroIcon
            v-else
            name="plus"
            class="logo-fallback"
          />
        </div>

        <!-- App name -->
        <div class="informations">
          <WeprodeInput
            v-model="application.applicationName"
            :placeholder="$t('namePlaceholder') + '*'"
            :maxlength="75"
            class="name"
            @blur="v$.application.applicationName.$touch()"
          />
          <WeprodeErrorMessage :error-message="formErrorList.applicationName" />

          <WeprodeInput
            v-model="application.applicationKey"
            :placeholder="$t('keyPlaceholder') + '*'"
            :maxlength="75"
            @blur="v$.application.applicationKey.$touch()"
          />
          <WeprodeErrorMessage :error-message="formErrorList.applicationKey" />
        </div>
      </div>

      <div class="broadcast">
        <div class="input-completion">
          <WeprodeInput
            ref="category"
            v-model="application.category"
            :placeholder="$t('categoryPlaceholder') + '*'"
            :max-lenght="75"
            @blur="v$.application.category.$touch()"
            @focus="toggleCompletion"
          />
          <WeprodeErrorMessage :error-message="formErrorList.category" />
          <WeprodeAutocomplete
            v-if="displayCategoryCompletion"
            :list="categoryList"
            :input="application.category"
            @select="selectCategory"
            @close="toggleCompletion"
          />
        </div>
        <WeprodeTagsInput
          v-if="schoolList"
          v-model="application.authorizedSchools"
          :placeholder="$t('schoolsPlaceholder')"
          :list="schoolList"
          display-field="schoolName"
          id-field="schoolId"
        />

        <div>
          <WeprodeTagsInput
            v-if="roleList"
            v-model="application.defaultRoles"
            :placeholder="$t('rolesPlaceholder')"
            :list="roleList"
            display-field="displayText"
            id-field="roleId"
          />
        </div>

        <div class="menu-entry">
          <WeprodeInput
            ref="category"
            v-model="application.menuEntryId"
            :placeholder="$t('menuEntryLabel')"
            :max-lenght="75"
            type="number"
          />
        </div>

        <h5 v-t="'urlTypeLabel'" />
        <div class="urls">
          <WeprodeRadioButton
            v-model="urlType"
            :label="$t('globalUrlCombobox')"
            name="url"
            rb-value="global"
            class="radio"
          />

          <WeprodeRadioButton
            v-model="urlType"
            :label="$t('customUrlCombobox')"
            name="url"
            rb-value="custom"
            class="radio"
          />

          <WeprodeRadioButton
            v-model="urlType"
            :label="$t('noUrlCombobox')"
            name="url"
            rb-value="none"
            class="radio"
          />
        </div>
        <WeprodeInput
          v-model="application.globalUrl"
          :placeholder="$t('globalUrlPlaceholder')"
          :disabled="urlType !== 'global'"
        />

        <h5 v-t="'exportLabel'" />
        <div class="exports">
          <WeprodeCheckbox
            v-model="application.exportParent"
            :label="$t('exportParentsCheckbox')"
            class="export"
          />

          <WeprodeCheckbox
            v-model="application.exportStudent"
            :label="$t('exportStudentsCheckbox')"
            class="export"
          />

          <WeprodeCheckbox
            v-model="application.exportTeacher"
            :label="$t('exportTeachersCheckbox')"
            class="export"
          />

          <WeprodeCheckbox
            v-model="application.exportOther"
            :label="$t('exportOtherCheckbox')"
            class="export"
          />
        </div>
      </div>
      <teleport to="body">
        <ImagePicker
          v-if="show"
          @save="selectImage"
          @close="toggleImagePicker"
        />
      </teleport>
    </template>
    <template #footer>
      <WeprodeButton
        :label="$t('modalSaveButton')"
        @click="save"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import WeprodeUtils from '@utils/weprode.utils'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import WeprodeAutocomplete from '@/components/Base/Weprode/WeprodeAutocomplete.vue'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeCheckbox from '@/components/Base/Weprode/WeprodeCheckbox.vue'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeRadioButton from '@/components/Base/Weprode/WeprodeRadioButton.vue'
import WeprodeTagsInput from '@/components/Base/Weprode/WeprodeTagsInput.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import ImagePicker from '@/components/Nero/ImagePicker'
import NeroIcon from '@/components/Nero/NeroIcon'

export default {
  name: 'ApplicationEditionModal',
  components: { ImagePicker, NeroIcon, WeprodeAutocomplete, WeprodeButton, WeprodeCheckbox, WeprodeErrorMessage, WeprodeInput, WeprodeRadioButton, WeprodeTagsInput, WeprodeWindow },
  inject: ['mq'],
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      application: undefined,
      displayCategoryCompletion: false,
      show: false
    }
  },
  validations: {
    application: {
      applicationName: { required },
      applicationKey: { required },
      category: { required }
    }
  },
  computed: {
    categoryList () {
      return this.$store.getters['applicationManager/categoryList']
    },
    formErrorList () {
      const form = this.v$.application
      return {
        applicationName: (form.applicationName.$invalid && form.applicationName.$dirty) ? this.$t('Commons.formRequired') : '',
        applicationKey: (form.applicationKey.$invalid && form.applicationKey.$dirty) ? this.$t('Commons.formRequired') : '',
        category: (form.category.$invalid && form.category.$dirty) ? this.$t('Commons.formRequired') : ''
      }
    },
    roleList () {
      return this.$store.state.administration.roleList
    },
    schoolList () {
      return this.$store.state.administration.schoolList
    },
    title () {
      let title = 'addModalTitle'
      if (this.application?.applicationId) {
        title = 'editModalTitle'
      }
      return title
    },
    urlType: {
      get () {
        if (this.application.hasGlobalUrl) {
          return 'global'
        } else {
          return this.application.hasCustomUrl ? 'custom' : 'none'
        }
      },
      set (value) {
        this.application.hasGlobalUrl = (value === 'global')
        this.application.hasCustomUrl = (value === 'custom')
      }
    }
  },
  created () {
    if (this.roleList === undefined) {
      this.$store.dispatch('administration/getRoleList')
    }
    this.application = WeprodeUtils.deepCopy(this.$store.state.applicationManager.selectedApplication)
  },
  methods: {
    buildApplicationBeforeSave () {
      // Handle roleId array before saving
      this.application.roleIds = []
      if (this.application.defaultRoles) {
        for (const role of this.application.defaultRoles) {
          this.application.roleIds.push(role.roleId)
        }
      }

      this.application.schoolIds = []
      for (const authorizedSchool of this.application.authorizedSchools) {
        this.application.schoolIds.push(authorizedSchool.schoolId)
      }

      // URL type
      this.application.hasGlobalUrl = (this.urlType === 'global')
      this.application.hasCustomUrl = (this.urlType === 'custom')
      if (this.application.authorizedSchools === undefined) {
        this.application.authorizedSchools = []
      }
    },
    closeModal () {
      this.$store.dispatch('applicationManager/closeEditionModal')
    },
    toggleImagePicker () {
      this.show = !this.show
    },
    removeLogo () {
      this.application.image = ''
    },
    save () {
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.buildApplicationBeforeSave()

        // Update if applicationId is defined else create new app
        if (this.application?.applicationId) {
          this.$store.dispatch('applicationManager/updateApplication', this.application)
        } else {
          const params = {
            application: this.application,
            school: this.$store.state.administration.selectedSchool
          }
          this.$store.dispatch('applicationManager/createApplication', params)
        }
        this.closeModal()
      }
    },
    selectCategory (category) {
      this.application.category = category
    },
    selectImage ({ blob }) {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      const vm = this
      reader.onloadend = function () {
        vm.application.image = reader.result
      }
    },
    // Completion for category input
    toggleCompletion () {
      this.displayCategoryCompletion = !!this.$refs.category.$el.contains(document.activeElement)
    }
  }
}
</script>

<style lang="scss">
  .app-edition-modal .window-body {
    overflow: visible !important;
  }
</style>

<style lang="scss" scoped>
@import '@/design';

.first-block {
  display: flex;
  margin-bottom: 10px;

  .name {
    margin-top: 0;
  }
}

.logo-panel {
  position: relative;
  border-radius: $light-radius-size;
  overflow: hidden;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  flex-shrink: 0;
  width: 110px;
  height: 110px;
  @extend %object-shadow;
}

.remove-logo {
  position: absolute;
  top: 0;
  right: 0;
}

.logo {
  width: 110px;
  height: 110px;
}

.logo-fallback {
  height: 100%;
  margin: auto;
  line-height: 110px;
  font-size: 50px;
  color: $color-fallback-text;
}

.group,
.component {
  margin-top: 10px;
}

.error-message {
  height: 8px;
}

h5 {
  margin: 10px 0 5px 0;
}

.delete {
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 18px;
  }
}

.informations {
  width: 100%;
  margin-left: 5px;
}

.input-completion {
  position: relative;
  display: inline-block;
  width: 100%;
}

.urls,
.exports {
  display: flex;
}

.radio {
  flex: 0 0 33%;
}

.export {
  flex: 0 0 25%;
}
</style>

<i18n locale="fr">
{
  "addModalTitle": "Ajouter une nouvelle application",
  "categoryPlaceholder": "Catégorie",
  "customUrlCombobox": "URL personnalisée",
  "editModalTitle": "Modifier une application",
  "exportOtherCheckbox": "Ressources",
  "exportParentsCheckbox": "Parents",
  "exportStudentsCheckbox": "Elèves",
  "exportTeachersCheckbox": "Enseignants",
  "exportLabel": "Exporter un/ou plusieurs types d'utilisateurs",
  "globalUrlCombobox": "URL globale",
  "globalUrlPlaceholder": "https://...",
  "keyPlaceholder": "Clé",
  "modalSaveButton": "Valider",
  "namePlaceholder": "Nom",
  "noUrlCombobox": "Aucun",
  "menuEntryLabel": "Id de menu correspondant",
  "rolesPlaceholder": "Profil(s) par défaut",
  "schoolsPlaceholder": "Filtre d'établissements",
  "urlTypeLabel": "Type de lien"
}
</i18n>
