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
      <div
        v-if="isAdministrator && eMailAddress"
        class="mail-address"
      >
        <h5> {{ $t('SupportWindow.SupportModal.eMailAddress') + ": " }} </h5>
        <NeroInput
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
          display-field="name"
          @input="selectService"
        />
      </div>
      <div class="issue-description">
        <h5> {{ $t('SupportWindow.SupportModal.issueDescription') + '*' }} </h5>
        <div class="ck-editor">
          <CKEditor
            v-model="issueDescription"
            :editor="editor"
            :config="editorConfig"
          />
        </div>
      </div>
      <div class="add-files">
        <NeroButton
          :label="$t('SupportWindow.SupportModal.addFilesButtonLabel')"
          @click="addFile"
        />
      </div>
      <div class="add-screenshot">
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
import platform from 'platform'

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
      editorConfig: {
        toolbar: {
          // TODO find a good configuration to prevent issues
          // items: [ 'bold', 'italic', '|', 'link' ],
          // viewportTopOffset: 500
        }
      },
      selected: undefined,
      issueDescription: '',
      attachFiles: '[]', // /!\ here is a string
      isUsurpationAllowed: false

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
    },
    serviceList () {
      return this.$store.state.user.serviceList
    },
    subjectField () {
      return 'Anomalie ' + this.selected.name
    },
    contentField () {
      return '<p>Service affecté : ' + this.selected.name + '</p>' +
             '<p>Description : ' + this.issueDescription + '</p>' + // issue description in html format
             'Type de navigateur : ' + platform.description
    }
  },
  created () {
    if (this.userDetails.lastName === undefined) {
      this.$store.dispatch('user/getPersonalDetails')
    }
    if (this.serviceList === undefined) {
      this.$store.dispatch('user/getServiceList')
    }
  },
  methods: {
    selectService (service) {
      this.selected = service
    },
    addFile () {
      // TODO add files to message
    },
    addScreenShot () {
      // TODO add screenShot to message
    },
    submitTicket () {
      this.$store.dispatch('support/createMessage', {
        subjectField: this.subjectField,
        contentField: this.contentField,
        mail: this.eMailAddress,
        attachFiles: this.attachFiles,
        isUsurpationAllowed: this.isUsurpationAllowed
      })
    },
    onClose () {
      this.$store.dispatch('nero/closeSupportModal')
    }
  }
}
</script>

<style lang="scss" scoped>

.ck-editor{
  border: 1px solid rgba(0, 0, 0, 0.15);
}

</style>
