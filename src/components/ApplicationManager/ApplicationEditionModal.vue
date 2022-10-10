<template>
  <PentilaWindow
    :modal="true"
    class="app-edition-modal"
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
          <PentilaButton
            v-if="application.image"
            type="circle"
            class="remove-logo delete"
            @click.stop="removeLogo"
          >
            <NeroIcon name="trash" />
          </PentilaButton>

          <img
            v-if="application.image"
            :src="application.image"
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
          <PentilaInput
            v-model="application.serviceName"
            :placeholder="$t('namePlaceholder') + '*'"
            :maxlength="75"
            class="name"
            @blur="v$.application.serviceName.$touch()"
          />
          <PentilaErrorMessage :error-message="formErrorList.serviceName" />

          <PentilaInput
            v-model="application.serviceKey"
            :placeholder="$t('keyPlaceholder') + '*'"
            :maxlength="75"
            @blur="v$.application.serviceKey.$touch()"
          />
          <PentilaErrorMessage :error-message="formErrorList.serviceKey" />
        </div>
      </div>

      <div class="broadcast">
        <div class="input-completion">
          <PentilaInput
            ref="category"
            v-model="application.serviceCategory"
            :placeholder="$t('categoryPlaceholder') + '*'"
            :max-lenght="75"
            @blur="v$.application.serviceCategory.$touch()"
            @focus="toggleCompletion"
          />
          <PentilaErrorMessage :error-message="formErrorList.serviceCategory" />
          <PentilaAutocomplete
            v-if="displayCategoryCompletion"
            :list="categoryList"
            :input="application.serviceCategory"
            @select="selectCategory"
            @close="toggleCompletion"
          />
        </div>
        <PentilaTagsInput
          v-if="schoolList"
          v-model="application.etabFilters"
          :placeholder="$t('schoolsPlaceholder')"
          :list="schoolList"
          display-field="schoolName"
          id-field="schoolId"
        />

        <div>
          <PentilaTagsInput
            v-if="roleList"
            v-model="application.roleList"
            :placeholder="$t('rolesPlaceholder') + '*'"
            :list="roleList"
            display-field="displayText"
            id-field="roleId"
          />
          <PentilaErrorMessage :error-message="formErrorList.roleList" />
        </div>

        <div class="default-portlet">
          <h5 v-t="'portletLabel'" />
          <PentilaDropdown
            v-if="portletList"
            v-model="selectedPortlet"
            :list="portletList"
            display-field="name"
          />
        </div>

        <h5 v-t="'urlTypeLabel'" />
        <div class="urls">
          <PentilaRadioButton
            v-model="urlType"
            :label="$t('globalUrlCombobox')"
            name="url"
            rb-value="global"
            class="radio"
          />

          <PentilaRadioButton
            v-model="urlType"
            :label="$t('customUrlCombobox')"
            name="url"
            rb-value="custom"
            class="radio"
          />

          <PentilaRadioButton
            v-model="urlType"
            :label="$t('noUrlCombobox')"
            name="url"
            rb-value="none"
            class="radio"
          />
        </div>
        <PentilaInput
          v-model="application.globalUrl"
          :placeholder="$t('globalUrlPlaceholder')"
          :disabled="urlType !== 'global'"
        />

        <h5 v-t="'exportLabel'" />
        <div class="exports">
          <PentilaCheckbox
            v-model="application.exportParent"
            :label="$t('exportParentsCheckbox')"
            class="export"
          />

          <PentilaCheckbox
            v-model="application.exportStudent"
            :label="$t('exportStudentsCheckbox')"
            class="export"
          />

          <PentilaCheckbox
            v-model="application.exportTeacher"
            :label="$t('exportTeachersCheckbox')"
            class="export"
          />

          <PentilaCheckbox
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
      <PentilaButton
        :label="$t('modalSaveButton')"
        @click="save"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import PentilaUtils from 'pentila-utils'

import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

import ImagePicker from '@/components/Nero/ImagePicker'
import NeroIcon from '@/components/Nero/NeroIcon'

export default {
  name: 'ApplicationEditionModal',
  components: { ImagePicker, NeroIcon },
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
      roleList: { required },
      serviceName: { required },
      serviceKey: { required },
      serviceCategory: { required }
    }
  },
  computed: {
    categoryList () {
      return this.$store.getters['applicationManager/categoryList']
    },
    formErrorList () {
      const form = this.v$.application
      return {
        roleList: (form.roleList.$invalid && form.roleList.$dirty) ? this.$t('Commons.formRequired') : '',
        serviceName: (form.serviceName.$invalid && form.serviceName.$dirty) ? this.$t('Commons.formRequired') : '',
        serviceKey: (form.serviceKey.$invalid && form.serviceKey.$dirty) ? this.$t('Commons.formRequired') : '',
        serviceCategory: (form.serviceCategory.$invalid && form.serviceCategory.$dirty) ? this.$t('Commons.formRequired') : ''
      }
    },
    portletList () {
      return this.$store.state.administration.portletList
    },
    roleList () {
      return this.$store.state.administration.roleList
    },
    schoolList () {
      return this.$store.state.administration.schoolList
    },
    selectedPortlet: {
      get () {
        if (this.portletList && this.application.portletId) {
          for (let idx = 0; idx < this.portletList.length; ++idx) {
            if (this.portletList[idx].portletId === this.application.portletId) {
              return this.portletList[idx]
            }
          }
        }
        return undefined
      },
      set (value) {
        this.application.portletId = value.portletId
      }
    },
    title () {
      let title = 'addModalTitle'
      if (this.application && this.application.serviceId) {
        title = 'editModalTitle'
      }
      return title
    },
    urlType: {
      get () {
        return this.application.hasGlobalUrl ? 'global' : this.application.hasCustomUrl ? 'custom' : 'none'
      },
      set (value) {
        this.application.hasGlobalUrl = (value === 'global')
        this.application.hasCustomUrl = (value === 'custom')
      }
    }
  },
  created () {
    if (this.portletList === undefined) {
      this.$store.dispatch('administration/getPortletList')
    }
    if (this.roleList === undefined) {
      this.$store.dispatch('administration/getRoleList')
    }
    // Copy selected app
    if (this.$store.state.applicationManager.selectedApplication.roleList === undefined) {
      this.$store.dispatch('applicationManager/getApplicationDefaultRoleList').then(() => {
        this.application = PentilaUtils.JSON.deepCopy(this.$store.state.applicationManager.selectedApplication)
      })
    }
    this.application = PentilaUtils.JSON.deepCopy(this.$store.state.applicationManager.selectedApplication)
  },
  methods: {
    buildApplicationBeforeSave () {
      // Handle roleId array before saving
      this.application.rolesId = []
      for (let idx = 0; idx < this.application.roleList.length; idx++) {
        this.application.rolesId.push(this.application.roleList[idx].roleId)
      }

      // URL type
      this.application.hasGlobalUrl = (this.urlType === 'global')
      this.application.hasCustomUrl = (this.urlType === 'custom')
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

        // Update if serviceId is defined else create new app
        if (this.application && this.application.serviceId) {
          this.$store.dispatch('applicationManager/updateApplication', this.application)
        } else {
          const params = {
            application: this.application,
            school: this.$store.state.administration.selectedSchool
          }
          this.$store.dispatch('applicationManager/createApplication', params)
        }
      }
    },
    selectCategory (category) {
      this.application.serviceCategory = category
    },
    selectImage ({ blob, fileName }) {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      const vm = this
      reader.onloadend = function () {
        vm.application.image = reader.result
      }
    },
    // Completion for category input
    toggleCompletion () {
      if (this.$refs.category.$el.contains(document.activeElement)) {
        this.displayCategoryCompletion = true
      } else {
        this.displayCategoryCompletion = false
      }
    }
  }
}
</script>

<style lang="scss">
.app-edition-modal .window-body {
  overflow: auto;
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
  "portletLabel": "Portlet",
  "rolesPlaceholder": "Profil(s) par défaut",
  "schoolsPlaceholder": "Filtre d'établissements",
  "urlTypeLabel": "Type de lien"
}
</i18n>
