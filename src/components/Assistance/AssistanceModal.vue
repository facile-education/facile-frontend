<template>
  <div data-test="supportModal">
    <WeprodeWindow
      class="support-message-modal"
      :modal="true"
      :draggable="true"
      :full-screen="mq.phone || mq.tablet"
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
          {{ topLabel }}
        </p>
        <div class="service">
          <p
            v-if="modalType==='Assistance'"
            v-t="'applyContextText'"
            class="italic"
          />
          <h5> {{ (modalType==='Assistance' ? $t('serviceLabel') : $t('serviceConcernLabel')) + '*' }} </h5>
          <WeprodeDropdown
            v-if="applicationList"
            v-model="selected"
            data-test="servicesDropDown"
            :list="applicationList"
            display-field="applicationName"
          />
        </div>
        <div class="issue-description">
          <h5> {{ (modalType==='Assistance' ? $t('issueDescription') : $t('suggestionDescription')) + '*' }} </h5>
          <TextContent
            v-model:content="form.issueDescription"
            class="ck-editor"
          />
          <WeprodeErrorMessage :error-message="formErrorList.issueDescription" />
        </div>
        <!-- Attached files -->
        <AttachedFiles
          v-model="attachFiles"
          :read-only="false"
          @remove-attached-file="removeAttachedFile"
        />
      </template>

      <template #footer>
        <WeprodeButton
          data-test="submitTicket"
          :label="$t('submitButtonLabel')"
          :disabled="isLoading"
          @click="submitTicket"
        />
      </template>
    </WeprodeWindow>
  </div>

  <teleport to="body">
    <FilePickerModal
      v-if="isFilePickerDisplayed"
      :multi-selection="true"
      @added-files="attachNewFiles"
      @close="isFilePickerDisplayed=false"
    />
  </teleport>
</template>

<script>
import AttachedFiles from '@components/AttachedFiles/AttachedFiles.vue'
import TextContent from '@components/Base/TextContent.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { defineAsyncComponent } from 'vue'

import { sendAssistanceMessage } from '@/api/messaging/message.service'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
const FilePickerModal = defineAsyncComponent(() => import('@components/FilePicker/FilePickerModal'))

export default {
  name: 'AssistanceModal',
  components: {
    AttachedFiles,
    FilePickerModal,
    TextContent,
    WeprodeButton,
    WeprodeDropdown,
    WeprodeErrorMessage,
    WeprodeWindow
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
      attachFiles: [],
      isFilePickerDisplayed: false,
      isLoading: false
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
  //    applicationName: { required },
  //    applicationKey: { required },
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
    applicationList () {
      return this.$store.state.user.serviceList
    },
    subjectField () {
      return 'Anomalie ' + this.selected.applicationName
    },
    contentField () {
      return '<p>Service affecté : ' + this.selected.applicationName + '</p>' +
             '<p>Description : ' + this.form.issueDescription + '</p>' // + // issue description in html format
      //        'Type de navigateur : ' + platform.description
    },
    topLabel () {
      if (this.modalType === 'Assistance') {
        return this.$store.state.user.isLocalAdmin ? this.$t('adminAssistanceMessage') : this.$t('nonAdminAssistanceMessage')
      } else {
        return this.$store.state.user.isLocalAdmin ? this.$t('adminSuggestionMessage') : this.$t('nonAdminSuggestionMessage')
      }
    }
  },
  created () {
    if (this.userDetails.lastName === undefined) {
      this.$store.dispatch('user/getPersonalDetails')
    }
    if (this.applicationList === undefined) {
      this.$store.dispatch('user/getServiceList')
    }
  },
  methods: {
    attachNewFiles (selectedFiles) {
      this.attachFiles = [...this.attachFiles, ...selectedFiles]
    },
    removeAttachedFile (fileToRemove) {
      this.attachFiles.splice(this.attachFiles.indexOf(fileToRemove), 1)
    },
    submitTicket () {
      if (this.v$.$invalid) { // form checking
        this.v$.$touch()
      } else {
        this.isLoading = true
        sendAssistanceMessage(
          this.modalType === 'Suggestion',
          this.selected.applicationId,
          this.contentField,
          JSON.stringify(this.attachFiles)
        ).then((data) => {
          this.isLoading = false
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
  border: 1px solid rgba(0, 0, 0, 0.15) !important;
}

.ck-editor__editable {
  min-height: 150px;  /* TO DEFINE */
  max-height: 280px;  /* TO DEFINE */
}

.add-files {
  margin-top: 5px
}
</style>

<i18n locale="fr">
{
  "applyContextText": "Penser à expliquer le contexte de votre erreur, si besoin nous communiquer une copie d'écran et tout autre élément que vous jugez utile pour nous permettre de reproduire votre problème.",
  "addFilesButtonLabel": "Ajouter un fichier (facultatif)",
  "submitButtonLabel": "Envoyer",
  "issueDescription": "Description de l'incident",
  "suggestionDescription": "Description de la suggestion",
  "assistanceHeaderLabel": "Signaler un problème",
  "suggestionHeaderLabel": "Proposer une amélioration",
  "nonAdminAssistanceMessage": "Votre demande de support sera transmise à l'administrateur de votre établissement.",
  "nonAdminSuggestionMessage": "Votre suggestion sera transmise à l'administrateur de votre établissement.",
  "adminAssistanceMessage": "Votre demande de support sera traitée par les équipes de Weprode, vous recevrez une réponse dans votre messagerie.",
  "adminSuggestionMessage": "Votre suggestion sera transmise aux équipes de Weprode, vous recevrez une réponse dans votre messagerie.",
  "serviceLabel": "Service affecté",
  "serviceConcernLabel": "Service concerné",
  "success": "Demande envoyée"
}
</i18n>
