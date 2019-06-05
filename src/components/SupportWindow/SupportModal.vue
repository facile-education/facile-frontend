<template>
  <div data-test="supportModal">
    <NeroWindow
      :modal="true"
      data-html2canvas-ignore="true"
      @close="onClose"
    >
      <span
        slot="header"
        v-t="'SupportWindow.SupportModal.modalHeaderLabel'"
      />

      <div slot="body">
        <p
          v-if="isAdministrator"
          class="italic"
        >
          {{ $t('SupportWindow.SupportModal.adminMessage') }}
        </p>
        <p
          v-else
          class="italic"
        >
          {{ $t('SupportWindow.SupportModal.nonAdminMessage') }}
        </p>
        <div class="service">
          <h5> {{ $t('SupportWindow.SupportModal.serviceLabel') + '*' }} </h5>
          <NeroDropdown
            v-if="serviceList"
            v-model="selected"
            data-test="servicesDropDown"
            :list="serviceList"
            display-field="name"
          />
        </div>
        <div class="issue-description">
          <h5> {{ $t('SupportWindow.SupportModal.issueDescription') + '*' }} </h5>
          <div
            class="ck-editor"
            data-test="ck-editor"
          >
            <CKEditor
              v-model="form.issueDescription"
              :editor="editor"
              :config="editorConfig"
              @blur="$v.form.issueDescription.$touch()"
            />
          </div>
          <NeroErrorMessage :error-type="formErrorList.issueDescription" />
        </div>
        <div class="add-files">
          <NeroButton
            data-test="addFile"
            :label="$t('SupportWindow.SupportModal.addFilesButtonLabel')"
            @click="addFile"
          />
          <div v-if="attachFiles.length !== 0">
            {{ attachFiles }}
          </div>
        </div>
        <div
          v-if="isScreenShotEnabled"
          class="add-screenshot"
        >
          <NeroButton
            data-test="addScreenShot"
            :label="$t('SupportWindow.SupportModal.screenShotButtonLabel')"
            @click="addScreenShot"
          />
        </div>
      </div>

      <div slot="footer">
        <NeroButton
          data-test="submitTicket"
          :label="$t('SupportWindow.SupportModal.submitButtonLabel')"
          @click="submitTicket"
        />
      </div>
    </NeroWindow>
  </div>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue'
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import { required } from 'vuelidate/lib/validators'
import platform from 'platform'
import html2canvas from 'html2canvas'

import NeroWindow from '@/components/Nero/NeroWindow'
import NeroDropdown from '@/components/Nero/NeroDropdown'
import NeroButton from '@/components/Nero/NeroButton'
import NeroErrorMessage from '@/components/Nero/NeroErrorMessage'

export default {
  name: 'SupportModal',

  components: {
    CKEditor: CKEditor.component,
    NeroWindow,
    NeroDropdown,
    NeroButton,
    NeroErrorMessage
  },

  data () {
    return {
      form: {
        issueDescription: ''
      },
      selected: undefined,
      editor: InlineEditor,
      editorConfig: {
        // TODO find a good configuration to prevent issues
        toolbar: {
          // items: [ 'bold', 'italic', '|', 'link' ],
          // viewportTopOffset: 500
        }
      },
      isUsurpationAllowed: false,
      isScreenShotEnabled: false
    }
  },

  validations: {
    form: {
      issueDescription: {
        required
      }
    }
  },

  computed: {
    formErrorList () {
      return {
        issueDescription: (this.$v.form.issueDescription.$invalid && this.$v.form.issueDescription.$dirty)
          ? 'required'
          : ''
      }
    },
    userDetails () {
      return this.$store.state.user.details
    },
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    eMailAddress () {
      return this.userDetails.emailAddress
    },
    attachFiles () {
      return this.$store.state.support.fileList
    },
    serviceList () {
      return this.$store.state.user.serviceList
    },
    subjectField () {
      return 'Anomalie ' + this.selected.name
    },
    contentField () {
      return '<p>Service affecté : ' + this.selected.name + '</p>' +
             '<p>Description : ' + this.form.issueDescription + '</p>' + // issue description in html format
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
    addFile () {
      // TODO add files to message
      console.log('TODO: add file')
    },
    addScreenShot () {
      // TODO add screenShot to message
      let vm = this
      html2canvas(document.body).then(function (canvas) {
        vm.$store.dispatch('support/addScreenShot', { image: canvas.toDataURL() })
      })
    },
    submitTicket () {
      if (this.$v.$invalid) { // form checking
        this.$v.$touch()
      } else {
        this.$store.dispatch('support/createMessage', {
          subjectField: this.subjectField,
          contentField: this.contentField,
          mail: this.eMailAddress,
          attachFiles: JSON.stringify(this.attachFiles),
          isUsurpationAllowed: this.isUsurpationAllowed
        })
      }
    },
    onClose () {
      this.$store.dispatch('nero/closeSupportModal')
    }
  }
}
</script>

<style lang="scss" scoped>

p.italic{
  margin-top: 15px;
  font-style: italic;
  font-size: 0.9em;
}

h5, .NeroDropDown {
  display: inline;
}

h5{
  margin-right: 10px;
}

.service, .issue-description{
  margin-top: 15px;
}

.ck-editor{
  border: 1px solid rgba(0, 0, 0, 0.15);
}

.ck-editor__editable {
  min-height: 150px;  /* TO DEFINE */
}

.add-files, .add-screenshot{
  margin-top: 5px
}

</style>
