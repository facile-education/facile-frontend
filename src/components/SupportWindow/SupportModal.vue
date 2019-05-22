<template>
  <NeroWindow
    :modal="true"
    @close="onClose"
  >
    <span
      slot="header"
      v-t="'SupportWindow.SupportModal.modalHeaderLabel'"
    />

    <div slot="body">
      <div class="mailAddress">
        <h5> {{ $t('SupportWindow.SupportModal.eMailAddress') + ": " }} </h5>
        <NeroInput
          v-if="isAdministrator && eMailAddress"
          v-model="eMailAddress"
          :placeholder="'eMailAddress'"
          :disabled="true"
        />
      </div>
      <h4> {{ $t('SupportWindow.SupportModal.thanksToCompleteLabel') }} :</h4>
      <div class="service">
        <h5> {{ $t('SupportWindow.SupportModal.serviceLabel') + '*' }} </h5>
        <NeroDropdown
          v-if="serviceList"
          :value="selected"
          :list="serviceList"
          display-field="value"
          @input="selectService"
        />
      </div>
      <div class="issueDescription">
        <h5> {{ $t('SupportWindow.SupportModal.issueDescription') + '*' }} </h5>
        <CKEditor
          v-model="issueDescription"
          class="editor"
          :editor="editor"
        />
      </div>
      <div class="addFiles">
        <NeroButton
          :label="$t('SupportWindow.SupportModal.addFilesButtonLabel')"
          @click="addFile"
        />
      </div>
      <div class="addScreenShot">
        <NeroButton
          :label="$t('SupportWindow.SupportModal.screenShotButtonLabel')"
          @click="addScreenShot"
        />
      </div>
    </div>

    <div slot="footer">
      <NeroButton
        :label="$t('SupportWindow.SupportModal.submitButtonLabel')"
        @click="submitTicket"
      />
    </div>
  </NeroWindow>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue'
import InlineEditor from '@ckeditor/ckeditor5-build-inline'

import NeroWindow from '@/components/Nero/NeroWindow'
import NeroInput from '@/components/Nero/NeroInput'
import NeroDropdown from '@/components/Nero/NeroDropdown'
import NeroButton from '@/components/Nero/NeroButton'

export default {
  name: 'SupportModal',
  components: {
    CKEditor: CKEditor.component,
    NeroWindow,
    NeroInput,
    NeroDropdown,
    NeroButton
  },
  data () {
    return {
      editor: InlineEditor,
      selected: undefined,
      serviceList: [
        { text: 'Un', value: 'A' },
        { text: 'Deux', value: 'B' },
        { text: 'Trois', value: 'C' }
      ],
      issueDescription: ''
    }
  },
  computed: {
    userDetails () {
      return this.$store.state.user.details
    },
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    eMailAddress () {
      return this.userDetails.emailAddress
    }
  },
  created () {
    if (this.userDetails.lastName === undefined) {
      this.$store.dispatch('user/getPersonalDetails')
    }
  },
  methods: {
    selectService (service) {
      this.selected = service
      // this.$store.dispatch('information/getVersionDetails', this.selected)
    },
    addFile () {
      // this.$store.dispatch('nero/openVersionEditionModal')
    },
    addScreenShot () {
      // this.$store.dispatch('nero/openVersionEditionModal')
    },
    submitTicket () {
      // this.$store.dispatch('nero/openVersionEditionModal')
    },
    onClose () {
      this.$store.dispatch('nero/closeSupportModal')
    }
  }
}
</script>

<style lang="scss" scoped>

.editor {
  @import 'src/assets/css/constants';

  border-style: solid;
  border-width: 2px;
  color: $text-color-fallback;
}

</style>
