<template>
  <PentilaWindow
    :modal="true"
    :draggable="true"
    @close="closeModal"
  >
    <template #header>
      <span v-t="title" />
    </template>

    <template #body>
      <div class="first-block">
        <!-- App Image -->
        <div
          class="logo-panel"
          @click="openImagePicker"
        >
          <PentilaButton
            v-if="application.image"
            type="circle"
            class="remove-logo cancel"
            @click.stop="removeLogo"
          >
            <i class="fa fa-trash" />
          </PentilaButton>

          <img
            v-if="application.image"
            :src="application.image"
            class="logo"
          >
          <i
            v-else
            class="logo-fallback fa fa-plus"
          />
        </div>

        <!-- App name -->
        <div class="informations">
          <PentilaInput
            v-model="application.serviceName"
            :placeholder="$t('ApplicationManager.ApplicationEditionModal.namePlaceholder') + '*'"
            :maxlength="75"
            :error-message="formErrorList.serviceName"
            @blur="v$.application.serviceName.$touch()"
          />

          <PentilaInput
            v-model="application.serviceKey"
            :placeholder="$t('ApplicationManager.ApplicationEditionModal.keyPlaceholder') + '*'"
            :maxlength="75"
            :error-message="formErrorList.serviceKey"
            @blur="v$.application.serviceKey.$touch()"
          />

          <div class="input-completion">
            <PentilaInput
              ref="category"
              v-model="application.serviceCategory"
              :placeholder="$t('ApplicationManager.ApplicationEditionModal.categoryPlaceholder') + '*'"
              :max-lenght="75"
              :error-message="formErrorList.serviceCategory"
              @blur="v$.application.serviceCategory.$touch()"
              @focus="toggleCompletion"
            />
            <PentilaAutocomplete
              v-if="displayCategoryCompletion"
              :list="categoryList"
              :input="application.serviceCategory"
              @select="selectCategory"
              @close="toggleCompletion"
            />
          </div>
        </div>
      </div>

      <div class="broadcast">
        <div>
          <h5 v-t="'ApplicationManager.ApplicationEditionModal.schoolsLabel'" />
          <PentilaTagsInput
            v-if="schoolList"
            v-model="application.etabFilters"
            :placeholder="$t('ApplicationManager.ApplicationEditionModal.schoolsPlaceholder')"
            :list="schoolList"
            display-field="schoolName"
            id-field="schoolId"
          />
        </div>

        <div>
          <h5 v-t="'ApplicationManager.ApplicationEditionModal.rolesLabel'" />
          <PentilaTagsInput
            v-if="roleList"
            v-model="application.roleList"
            :placeholder="$t('ApplicationManager.ApplicationEditionModal.rolesPlaceholder')"
            :list="roleList"
            display-field="displayText"
            id-field="roleId"
          />
        </div>

        <div class="default-portlet">
          <h5 v-t="'ApplicationManager.ApplicationEditionModal.portletLabel'" />
          <PentilaDropdown
            v-if="selectedPortlet"
            v-model="selectedPortlet"
            :list="portletList"
            display-field="name"
          />
        </div>

        <h5 v-t="'ApplicationManager.ApplicationEditionModal.urlTypeLabel'" />
        <div class="urls">
          <PentilaRadioButton
            v-model="urlType"
            :label="$t('ApplicationManager.ApplicationEditionModal.globalUrlCombobox')"
            name="url"
            rb-value="global"
            class="radio"
          />

          <PentilaRadioButton
            v-model="urlType"
            :label="$t('ApplicationManager.ApplicationEditionModal.customUrlCombobox')"
            name="url"
            rb-value="custom"
            class="radio"
          />

          <PentilaRadioButton
            v-model="urlType"
            :label="$t('ApplicationManager.ApplicationEditionModal.noUrlCombobox')"
            name="url"
            rb-value="none"
            class="radio"
          />
        </div>
        <PentilaInput
          v-model="application.globalUrl"
          :placeholder="$t('ApplicationManager.ApplicationEditionModal.globalUrlPlaceholder')"
          :disabled="urlType !== 'global'"
        />

        <h5 v-t="'ApplicationManager.ApplicationEditionModal.exportLabel'" />
        <div class="exports">
          <PentilaCheckbox
            v-model="application.exportParent"
            :label="$t('ApplicationManager.ApplicationEditionModal.exportParentsCheckbox')"
            class="export"
          />

          <PentilaCheckbox
            v-model="application.exportStudent"
            :label="$t('ApplicationManager.ApplicationEditionModal.exportStudentsCheckbox')"
            class="export"
          />

          <PentilaCheckbox
            v-model="application.exportTeacher"
            :label="$t('ApplicationManager.ApplicationEditionModal.exportTeachersCheckbox')"
            class="export"
          />

          <PentilaCheckbox
            v-model="application.exportOther"
            :label="$t('ApplicationManager.ApplicationEditionModal.exportOtherCheckbox')"
            class="export"
          />
        </div>
      </div>
      <teleport to="body">
        <ImagePicker v-if="show" />
      </teleport>
    </template>
    <template #footer>
      <PentilaButton
        :label="$t('ApplicationManager.ApplicationEditionModal.modalSaveButton')"
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

export default {
  name: 'ApplicationEditionModal',
  components: { ImagePicker },
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      application: undefined,
      displayCategoryCompletion: false,
      show: false,
      urlType: 'none'
    }
  },
  validations: {
    application: {
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
        serviceName: (form.serviceName.$invalid && form.serviceName.$dirty) ? this.$t('Nero.formErrorMessage.required') : '',
        serviceKey: (form.serviceKey.$invalid && form.serviceKey.$dirty) ? this.$t('Nero.formErrorMessage.required') : '',
        serviceCategory: (form.serviceCategory.$invalid && form.serviceCategory.$dirty) ? this.$t('Nero.formErrorMessage.required') : ''
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
        if (this.portletList) {
          if (this.application.portletId) {
            for (let idx = 0; idx < this.portletList.length; ++idx) {
              if (this.portletList[idx].portletId === this.application.portletId) {
                return this.portletList[idx]
              }
            }
          }
          return this.portletList[0]
        }
        return undefined
      },
      set (value) {
        this.application.portletId = value.portletId
      }
    },
    title () {
      let title = 'ApplicationManager.ApplicationEditionModal.addModalTitle'
      if (this.application && this.application.serviceId) {
        title = 'ApplicationManager.ApplicationEditionModal.editModalTitle'
      }
      return title
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
    this.application = PentilaUtils.JSON.deepCopy(this.$store.state.applicationManager.selectedApplication)
  },
  mounted () {
    // Initialise urlType
    this.urlType = this.application.hasGlobalUrl ? 'global' : this.application.hasCustomUrl ? 'custom' : 'none'
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
    openImagePicker () {
      this.show = true
      // this.$store.dispatch('nero/openImagePickerModal', { onConfirm: this.selectImage })
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
    selectImage (imageBlob, fileName) {
      const reader = new FileReader()
      reader.readAsDataURL(imageBlob)
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

<style lang="scss" scoped>
@import '@/design';

.first-block {
  display: flex;
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
  line-height: 110px;
  font-size: 40px;
  color: $color-fallback-text;
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
