<template>
  <NeroWindow
    :modal="true"
    @close="closeModal">
    <span
      v-t="'application-manager.edition-modal.edit-modal-title'"
      slot="header"/>

    <div slot="body">
      <div
        class="logo-panel"
        @click="openImagePicker">
        <NeroButton
          v-if="application.image"
          type="circle"
          icon="fa fa-times"
          class="remove-logo"
          @click="removeLogo"/>

        <img
          v-if="application.image"
          :src="application.image"
          class="logo">
        <i
          v-else
          class="logo-fallback fa fa-plus"/>
      </div>

      <div class="informations">
        <NeroInput
          v-model="application.serviceName"
          :placeholder="$t('application-manager.edition-modal.name-placeholder') + '*'"
          :maxlength="75"
          cls="form"
          type="text"
          autofocus/>

        <NeroInput
          v-model="application.serviceKey"
          :placeholder="$t('application-manager.edition-modal.key-placeholder') + '*'"
          :maxlength="75"
          cls="form"
          type="text"/>

        <NeroInput
          v-model="application.serviceCategory"
          :placeholder="$t('application-manager.edition-modal.category-placeholder') + '*'"
          :max-lenght="75"
          cls="form"
          type="text"/>
        TODO Aucomplete
      </div>

      <div class="broadcast">
        <div>
          <p v-t="'application-manager.edition-modal.schools-title'"/>
          <NeroTagsInput
            v-model="application.etabFilters"
            :placeholder="$t('application-manager.edition-modal.schools-placeholder')"
            display-field="schoolName"
            cls="form"/>
        </div>

        <div>
          <p v-t="'application-manager.edition-modal.roles-title'"/>
          <NeroTagsInput
            :placeholder="$t('application-manager.edition-modal.roles-placeholder')"
            cls="form"/>
        </div>

        <div class="default-portlet">
          <NeroDropdown
            v-if="portlets"
            :list="portlets"
            display-field="name"
            @dropdown-select="onPortletSelect"/>
        </div>

        <div class="urls">
          <div>
            <i class="fa fa-check"/>
            <input type="checkbox">
            <span>{{ $t('application-manager.edition-modal.global-url-combobox') }}</span>
          </div>

          <div>
            <i class="fa fa-check"/>
            <input type="checkbox">
            <span>{{ $t('application-manager.edition-modal.custom-url-combobox') }}</span>
          </div>

          <NeroInput
            :placeholder="$t('application-manager.edition-modal.global-url-placeholder')"
            cls="form"
            type="text"/>
        </div>

        <div class="exports">
          <p v-t="'application-manager.edition-modal.export-title'"/>
          <NeroCheckbox
            v-model="application.exportParent"
            :label="$t('application-manager.edition-modal.export-parents-checkbox')"
            class="export"/>

          <NeroCheckbox
            v-model="application.exportStudent"
            :label="$t('application-manager.edition-modal.export-students-checkbox')"
            class="export"/>

          <NeroCheckbox
            v-model="application.exportTeacher"
            :label="$t('application-manager.edition-modal.export-teachers-checkbox')"
            class="export"/>
        </div>
      </div>
    </div>
    <NeroButton
      slot="footer"
      :label="$t('application-manager.edition-modal.modal-save-button')"/>
  </NeroWindow>
</template>

<script>
import NeroButton from '@/components/NeroButton'
import NeroDropdown from '@/components/NeroDropdown'
import NeroInput from '@/components/NeroInput'
import NeroCheckbox from '@/components/NeroCheckbox'
import NeroTagsInput from '@/components/NeroTagsInput'
import NeroWindow from '@/components/NeroWindow'

export default {
  name: 'ApplicationEditionModal',
  components: {
    NeroButton,
    NeroDropdown,
    NeroInput,
    NeroCheckbox,
    NeroTagsInput,
    NeroWindow
  },
  computed: {
    application () {
      return this.$store.state.applicationManager.application
    },
    portlets () {
      return this.$store.state.administration.portlets
    }
  },
  created () {
    if (this.portlets === undefined) {
      this.$store.dispatch('getPortletList')
    }
  },
  methods: {
    closeModal () {
      this.$store.dispatch('closeEditionModal')
    },
    removeLogo () {
      // TODO code
      console.log('Remove logo')
    },
    openImagePicker () {
      // TODO code
      console.log('open image picker')
    },
    onSave () {
      // TODO code
      // if add push app il list
      // if edit commit ? change in list ?
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
  color: $text-fallback;
}

.informations {
  display: inline-block;
  width: 78%;
  margin-left: 5px;
}

.export {
  display: inline-block;
  width: 32%;
}
</style>
