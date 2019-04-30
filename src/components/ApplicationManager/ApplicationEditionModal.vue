<template>
  <NeroWindow
    :modal="true"
    @close="closeModal"
  >
    <span
      slot="header"
      v-t="title"
    />

    <div slot="body">
      <div class="first-block">
        <!-- App Image -->
        <div
          class="logo-panel"
          @click="openImagePicker"
        >
          <NeroButton
            v-if="application.image"
            type="circle"
            icon="fa fa-trash"
            class="remove-logo cancel"
            @click.stop="removeLogo"
          />

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
          <NeroInput
            v-model="application.serviceName"
            :placeholder="$t('ApplicationManager.ApplicationEditionModal.namePlaceholder') + '*'"
            :maxlength="75"
          />

          <NeroInput
            v-model="application.serviceKey"
            :placeholder="$t('ApplicationManager.ApplicationEditionModal.keyPlaceholder') + '*'"
            :maxlength="75"
          />

          <div class="input-completion">
            <NeroInput
              ref="category"
              v-model="application.serviceCategory"
              :placeholder="$t('ApplicationManager.ApplicationEditionModal.categoryPlaceholder') + '*'"
              :max-lenght="75"
              @focus="toggleCompletion"
            />
            <NeroAutocomplete
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
          <NeroTagsInput
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
          <NeroTagsInput
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
          <NeroDropdown
            v-if="selectedPortlet"
            v-model="selectedPortlet"
            :list="portletList"
            display-field="name"
          />
        </div>

        <h5 v-t="'ApplicationManager.ApplicationEditionModal.urlTypeLabel'" />
        <div class="urls">
          <NeroRadioButton
            v-model="urlType"
            :label="$t('ApplicationManager.ApplicationEditionModal.globalUrlCombobox')"
            name="url"
            rb-value="global"
            class="radio"
          />

          <NeroRadioButton
            v-model="urlType"
            :label="$t('ApplicationManager.ApplicationEditionModal.customUrlCombobox')"
            name="url"
            rb-value="custom"
            class="radio"
          />

          <NeroRadioButton
            v-model="urlType"
            :label="$t('ApplicationManager.ApplicationEditionModal.noUrlCombobox')"
            name="url"
            rb-value="none"
            class="radio"
          />
        </div>
        <NeroInput
          v-model="application.globalUrl"
          :placeholder="$t('ApplicationManager.ApplicationEditionModal.globalUrlPlaceholder')"
          :disabled="urlType !== 'global'"
        />

        <h5 v-t="'ApplicationManager.ApplicationEditionModal.exportLabel'" />
        <div class="exports">
          <NeroCheckbox
            v-model="application.exportParent"
            :label="$t('ApplicationManager.ApplicationEditionModal.exportParentsCheckbox')"
            class="export"
          />

          <NeroCheckbox
            v-model="application.exportStudent"
            :label="$t('ApplicationManager.ApplicationEditionModal.exportStudentsCheckbox')"
            class="export"
          />

          <NeroCheckbox
            v-model="application.exportTeacher"
            :label="$t('ApplicationManager.ApplicationEditionModal.exportTeachersCheckbox')"
            class="export"
          />
        </div>
      </div>
    </div>
    <NeroButton
      slot="footer"
      :label="$t('ApplicationManager.ApplicationEditionModal.modalSaveButton')"
      @click="save"
    />
  </NeroWindow>
</template>

<script>
import NeroUtils from '@/utils/nero.utils'
import NeroButton from '@/components/Nero/NeroButton'
import NeroDropdown from '@/components/Nero/NeroDropdown'
import NeroInput from '@/components/Nero/NeroInput'
import NeroCheckbox from '@/components/Nero/NeroCheckbox'
import NeroRadioButton from '@/components/Nero/NeroRadioButton'
import NeroTagsInput from '@/components/Nero/NeroTagsInput'
import NeroWindow from '@/components/Nero/NeroWindow'
import NeroAutocomplete from '@/components/Nero/NeroAutocomplete'

export default {
  name: 'ApplicationEditionModal',
  components: {
    NeroButton,
    NeroDropdown,
    NeroInput,
    NeroCheckbox,
    NeroRadioButton,
    NeroTagsInput,
    NeroWindow,
    NeroAutocomplete
  },
  data () {
    return {
      application: undefined,
      displayCategoryCompletion: false,
      urlType: 'none'
    }
  },
  computed: {
    categoryList () {
      return this.$store.getters['applicationManager/categoryList']
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
            for (var idx = 0; idx < this.portletList.length; ++idx) {
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
      var title = 'ApplicationManager.ApplicationEditionModal.addModalTitle'
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
    this.application = NeroUtils.JSON.deepCopy(this.$store.state.applicationManager.selectedApplication)
  },
  mounted () {
    // Initialise urlType
    this.urlType = this.application.hasGlobalUrl ? 'global' : this.application.hasCustomUrl ? 'custom' : 'none'
  },
  methods: {
    buildApplicationBeforeSave () {
      // Handle roleId array before saving
      this.application.rolesId = []
      for (var idx = 0; idx < this.application.roleList.length; idx++) {
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
      this.$store.dispatch('nero/openImagePickerModal', { onConfirm: this.selectImage })
    },
    removeLogo () {
      this.application.image = ''
    },
    save () {
      this.buildApplicationBeforeSave()

      // Update if serviceId is defined else create new app
      if (this.application && this.application.serviceId) {
        this.$store.dispatch('applicationManager/updateApplication', this.application)
      } else {
        var params = {
          application: this.application,
          school: this.$store.state.administration.selectedSchool
        }
        this.$store.dispatch('applicationManager/createApplication', params)
      }
    },
    selectCategory (category) {
      this.application.serviceCategory = category
    },
    selectImage (imageBlob, fileName) {
      var reader = new FileReader()
      reader.readAsDataURL(imageBlob)
      var vm = this
      reader.onloadend = function () {
        vm.application.image = reader.result
        console.log(vm.application.image)
      }
    },
    // Completion for category input
    toggleCompletion () {
      if (this.$refs.category.$el !== document.activeElement) {
        this.displayCategoryCompletion = false
      } else {
        this.displayCategoryCompletion = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.first-block {
  display: flex;
}

.logo-panel {
  position: relative;
  border-radius: $border-radius;
  overflow: hidden;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  flex-shrink: 0;
  width: 110px;
  height: 110px;
  @extend %nero-shadow;
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
  color: $text-color-fallback;
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

.radio,
.export {
  flex: 0 0 33%;
}
</style>
