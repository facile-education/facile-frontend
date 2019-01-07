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
      <div
        class="logo-panel"
        @click="openImagePicker"
      >
        <NeroButton
          v-if="application.image"
          type="circle"
          icon="fa fa-times"
          class="remove-logo"
          @click="removeLogo"
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

      <div class="informations">
        <NeroInput
          v-model="application.serviceName"
          :placeholder="$t('ApplicationManager.AMApplicationEditionModal.namePlaceholder') + '*'"
          :maxlength="75"
          cls="form"
          type="text"
          autofocus
        />

        <NeroInput
          v-model="application.serviceKey"
          :placeholder="$t('ApplicationManager.AMApplicationEditionModal.keyPlaceholder') + '*'"
          :maxlength="75"
          cls="form"
          type="text"
        />

        <div class="input-completion">
          <NeroInput
            ref="category"
            v-model="application.serviceCategory"
            :placeholder="$t('ApplicationManager.AMApplicationEditionModal.categoryPlaceholder') + '*'"
            :max-lenght="75"
            cls="form"
            type="text"
            @focus="toggleCompletion"
          />
          <NeroAutocomplete
            :list="categoryList"
            :display-autocomplete="displayCategoryCompletion"
            :input="application.serviceCategory"
            @select="selectCategory"
            @close="toggleCompletion"
          />
        </div>
      </div>

      <div class="broadcast">
        <div>
          <p v-t="'ApplicationManager.AMApplicationEditionModal.schoolsTitle'" />
          <NeroTagsInput
            v-if="schoolList"
            v-model="application.etabFilters"
            :placeholder="$t('ApplicationManager.AMApplicationEditionModal.schoolsPlaceholder')"
            :list="schoolList"
            display-field="schoolName"
            cls="form"
          />
        </div>

        <div>
          <p v-t="'ApplicationManager.AMApplicationEditionModal.rolesTitle'" />
          <NeroTagsInput
            v-if="roleList"
            v-model="application.roleList"
            :placeholder="$t('ApplicationManager.AMApplicationEditionModal.rolesPlaceholder')"
            :list="roleList"
            display-field="displayText"
            cls="form"
          />
        </div>

        <div class="default-portlet">
          <NeroDropdown
            v-if="portletList"
            :list="portletList"
            display-field="name"
            @dropdown-select="onPortletSelect"
          />
        </div>

        <div class="urls">
          <!-- TODO code model radio button + disable input-->
          <NeroRadioButton
            :label="$t('ApplicationManager.AMApplicationEditionModal.globalUrlCombobox')"
            name="url"
            class="radio"
          />

          <NeroRadioButton
            :label="$t('ApplicationManager.AMApplicationEditionModal.customUrlCombobox')"
            name="url"
            class="radio"
          />

          <NeroInput
            :placeholder="$t('ApplicationManager.AMApplicationEditionModal.globalUrlPlaceholder')"
            cls="form"
            type="text"
          />
        </div>

        <div class="exports">
          <p v-t="'ApplicationManager.AMApplicationEditionModal.exportTitle'" />
          <NeroCheckbox
            v-model="application.exportParent"
            :label="$t('ApplicationManager.AMApplicationEditionModal.exportParentsCheckbox')"
            class="export"
          />

          <NeroCheckbox
            v-model="application.exportStudent"
            :label="$t('ApplicationManager.AMApplicationEditionModal.exportStudentsCheckbox')"
            class="export"
          />

          <NeroCheckbox
            v-model="application.exportTeacher"
            :label="$t('ApplicationManager.AMApplicationEditionModal.exportTeachersCheckbox')"
            class="export"
          />
        </div>
      </div>
    </div>
    <NeroButton
      slot="footer"
      :label="$t('ApplicationManager.AMApplicationEditionModal.modalSaveButton')"
      @click="save"
    />
  </NeroWindow>
</template>

<script>
import NeroButton from '@/components/Nero/NeroButton'
import NeroDropdown from '@/components/Nero/NeroDropdown'
import NeroInput from '@/components/Nero/NeroInput'
import NeroCheckbox from '@/components/Nero/NeroCheckbox'
import NeroRadioButton from '@/components/Nero/NeroRadioButton'
import NeroTagsInput from '@/components/Nero/NeroTagsInput'
import NeroWindow from '@/components/Nero/NeroWindow'
import NeroAutocomplete from '@/components/Nero/NeroAutocomplete'

export default {
  name: 'AMApplicationEditionModal',
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
      displayCategoryCompletion: false
    }
  },
  computed: {
    title () {
      var title = 'ApplicationManager.AMApplicationEditionModal.addModalTitle'
      if (this.application && this.application.serviceId) {
        title = 'ApplicationManager.AMApplicationEditionModal.editModalTitle'
      }
      return title
    },
    portletList () {
      return this.$store.state.administration.portletList
    },
    schoolList () {
      return this.$store.state.administration.schoolList
    },
    roleList () {
      return this.$store.state.administration.roleList
    },
    categoryList () {
      return this.$store.getters.categories
    }
  },
  created () {
    if (this.portletList === undefined) {
      this.$store.dispatch('getPortletList')
    }
    if (this.roleList === undefined) {
      this.$store.dispatch('getRoleList')
    }
    this.application = this.$store.state.applicationManager.application
  },
  methods: {
    toggleCompletion () {
      if (this.$refs.category.$el !== document.activeElement) {
        this.displayCategoryCompletion = false
      } else {
        this.displayCategoryCompletion = true
      }
    },
    closeModal () {
      this.$store.dispatch('closeEditionModal')
    },
    selectCategory (category) {
      this.application.serviceCategory = category
      // Todo remove focus ?
    },
    removeLogo () {
      // TODO code
      console.log('Remove logo')
    },
    openImagePicker () {
      // TODO code
      console.log('open image picker')
    },
    save () {
      // TODO code
      // if add push app il list
      // if edit commit ? change in list ?
      console.log(this.application)
    },
    onPortletSelect () {
      // TODO code or dropdown v-model
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';
.logo-panel {
  display: inline-block;
  position: relative;
  border-radius: $border-radius;
  overflow: hidden;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
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
  display: inline-block;
  width: 78%;
  margin-left: 5px;
}

.input-completion {
  position: relative;
  display: inline-block;
  width: 100%;
}

.radio {
  width: 50%;
}

.export {
  display: inline-block;
  width: 32%;
}
</style>
