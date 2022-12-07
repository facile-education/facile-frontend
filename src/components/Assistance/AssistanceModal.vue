<template>
  <div data-test="supportModal">
    <PentilaWindow
      :modal="true"
      :draggable="true"
      :full-screen="mq.phone"
      data-html2canvas-ignore="true"
      @close="onClose"
    >
      <template #header>
        <span v-t="modalType==='Assistance' ? 'assistanceHeaderLabel' : 'suggestionHeaderLabel'" />
      </template>

      <template #body>
        <p
          v-if="isAdministrator"
          class="italic"
        >
          {{ $t('adminMessage') }}
        </p>
        <p
          v-else
          class="italic"
        >
          {{ $t('nonAdminMessage') }}
        </p>
        <div class="service">
          <p
            v-if="modalType==='Assistance'"
            v-t="'applyContextText'"
            class="italic"
          />
          <h5> {{ (modalType==='Assistance' ? $t('serviceLabel') : $t('serviceConcernLabel')) + '*' }} </h5>
          <PentilaDropdown
            v-if="serviceList"
            v-model="selected"
            data-test="servicesDropDown"
            :list="serviceList"
            display-field="serviceName"
          />
        </div>
        <div class="issue-description">
          <h5> {{ $t('issueDescription') + '*' }} </h5>
          <div
            class="ck-editor"
            data-test="ck-editor"
          >
            <CKEditor
              v-model="form.issueDescription"
              :editor="editor"
              :config="editorConfig"
              @blur="v$.form.issueDescription.$touch()"
            />
          </div>
          <PentilaErrorMessage :error-message="formErrorList.issueDescription" />
        </div>
        <div
          v-if="isFilesEnabled"
          class="add-files"
        >
          <PentilaButton
            data-test="addFile"
            :label="$t('addFilesButtonLabel')"
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
          <PentilaButton
            data-test="addScreenShot"
            :label="$t('screenShotButtonLabel')"
            @click="addScreenShot"
          />
        </div>
      </template>

      <template #footer>
        <PentilaButton
          data-test="submitTicket"
          :label="$t('submitButtonLabel')"
          @click="submitTicket"
        />
      </template>
    </PentilaWindow>
  </div>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue'
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import supportService from '@/api/support.service'

// import platform from 'platform'
// import html2canvas from 'html2canvas'

export default {
  name: 'AssistanceModal',
  components: {
    CKEditor: CKEditor.component
  },
  inject: ['mq'],
  props: {
    modalType: {
      type: String,
      default: 'Assistance'
    }
  },
  emits: ['close'],
  setup: () => ({ v$: useVuelidate() }),
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
      isScreenShotEnabled: false,
      isFilesEnabled: false
    }
  },
  validations: {
    form: {
      issueDescription: {
        required
      }
    }
  },
  // validations: {
  //  application: {
  //    roleList: { required },
  //    serviceName: { required },
  //    serviceKey: { required },
  //    category: { required }
  //  }
  // },
  computed: {
    formErrorList () {
      return {
        issueDescription: (this.v$.form.issueDescription.$invalid && this.v$.form.issueDescription.$dirty)
          ? this.$t('Commons.required')
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
      return 'Anomalie ' + this.selected.serviceName
    },
    contentField () {
      return '<p>Service affecté : ' + this.selected.serviceName + '</p>' +
             '<p>Description : ' + this.form.issueDescription + '</p>' // + // issue description in html format
      //        'Type de navigateur : ' + platform.description
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
      /* const vm = this
      html2canvas(document.body).then(function (canvas) {
        vm.$store.dispatch('support/addScreenShot', { image: canvas.toDataURL() })
      }) */
    },
    submitTicket () {
      if (this.v$.$invalid) { // form checking
        this.v$.$touch()
      } else {
        supportService.createMessage(
          this.subjectField,
          this.contentField,
          this.eMailAddress,
          JSON.stringify(this.attachFiles),
          this.isUsurpationAllowed
        ).then((data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('success'), type: 'success' })
            this.onClose()
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
          }
        })
      }
    },
    onClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

.italic {
  margin-top: 15px;
  font-style: italic;
  font-size: 0.9em;
}

h5, .NeroDropDown {
  display: inline;
}

h5 {
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

<i18n locale="fr">
{
  "applyContextText": "Penser à expliquer le contexte de votre erreur, si besoin nous communiquer une copie d'écran et tout autre élément que vous jugez utile pour nous permettre de reproduire votre problème.",
  "addFilesButtonLabel": "Ajouter un fichier (facultatif)",
  "adminMessage": "Votre demande de support sera traitée par les équipes de Pentila, vous recevrez une réponse dans votre messagerie",
  "submitButtonLabel": "Envoyer",
  "issueDescription": "Description de l'incident",
  "assistanceHeaderLabel": "Signaler un problème",
  "suggestionHeaderLabel": "Proposer une amélioration",
  "nonAdminMessage": "Votre demande de support sera transmise à l'administrateur",
  "screenShotButtonLabel": "Capture d'écran (facultatif)",
  "screenShotMessage": "La capture d'écran sera déposée dans votre casier",
  "serviceLabel": "Service affecté",
  "serviceConcernLabel": "Service concerné",
  "success": "Demande envoyé"
}

</i18n>
