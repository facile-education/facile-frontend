<template>
  <div ref="createMessageModal">
    <PentilaWindow
      :modal="true"
      :draggable="true"
      :is-full-screen="mq.phone"
      data-test="createMessageModal"
      class="create-message-modal"
      :class="{'phone': mq.phone}"
      @close="onConfirmClose"
      @keydown.exact.escape.stop="onConfirmClose"
    >
      <template #header>
        <span
          v-if="messageParameters.isForward"
          v-t="'headerForward'"
        />
        <span
          v-else-if="messageParameters.isReply"
          v-t="'headerReply'"
        />
        <span
          v-else-if="messageParameters.isReplyAll"
          v-t="'headerReplyAll'"
        />
        <span
          v-else
          v-t="'header'"
        />
      </template>

      <template #body>
        <!-- Recipients -->
        <div
          class="recipients-panel"
          data-test="recipients-section"
        >
          <PentilaTagsInput
            ref="tagsinput"
            v-model="recipients"
            :close-on-select="true"
            :completion-only="true"
            :min-length="1"
            :placeholder="$t('recipientsPlaceHolder')"
            display-field="text"
            id-field="id"
            :list="autocompleteItems"
            class="recipients"
            :class="device"
            :max-tags-to-display="2"
            :others-label-template="(nbOthers) => {return $t('othersLabel', {'nbOthers': nbOthers})}"
            @input="searchTimeOut"
          />
          <PentilaButton
            ref="openContactTooltipButton"
            :class="{'phone': mq.phone}"
            class="create-button"
            @click="toggleContactsPicker"
          >
            <NeroIcon
              name="fa-plus"
            />
          </PentilaButton>
        </div>
        <div class="error-container">
          <ErrorMessage
            v-if="error==='missingRecipient'"
            class="error-message"
            :error-message="$t('missingRecipient')"
          />
        </div>

        <!-- Subject -->
        <PentilaInput
          id="create-message-subject-input"
          ref="createMessageSubjectInput"
          v-model="subject"
          :class="device"
          class="subject"
          data-test="subject-input"
          :placeholder="$t('subjectPlaceHolder')"
        />

        <!-- Content -->
        <div
          v-if="isInitialized"
          class="content"
          data-test="content-section"
          :class="device"
        >
          <TextContent
            :content="initialContent"
            :is-in-progression="false"
            @input="updateContent"
            @keydown.stop
            @keyup.stop
          />
        </div>

        <!-- Attached files -->
        <div
          class="attached-files"
          data-test="attached-files-section"
        >
          <div class="attached-label">
            <label v-t="'attachedFiles'" />
            <button
              class="add-document-button"
              :title="$t('addAttachFileButton')"
              @click="displayFilePicker"
            >
              <img
                class="icon"
                src="@assets/options/dossier-pj.svg"
                :alt="$t('addAttachFileButton')"
              >
            </button>
            <button
              class="add-document-button"
              :title="$t('addLocalAttachFileButton')"
              @click="importDocument"
            >
              <img
                class="icon"
                src="@assets/options/icon_upload.svg"
                :alt="$t('addLocalAttachFileButton')"
              >
            </button>
          </div>
          <AttachedFiles
            :attached-files="attachedFiles"
            :read-only="false"
            @removeAttachedFile="removeAttachedFile"
          />
        </div>
      </template>

      <template #footer>
        <div
          class="footer"
          :class="device"
        >
          <PentilaButton
            data-test="draftButton"
            class="draftButton"
            :label="$t('draftButton')"
            @click="saveDraft"
          />
          <PentilaButton
            data-test="submitButton"
            class="dark"
            :label="$t('submitButton')"
            @click="checkFields"
          />
        </div>
      </template>
    </PentilaWindow>
  </div>
  <teleport
    v-if="isFilePickerModalDisplayed"
    to="body"
  >
    <FilePickerModal
      :multi-selection="true"
      @addedFiles="addNewFiles"
      @close="closeFilePicker"
    />
  </teleport>
  <teleport to="body">
    <ContactPickerModal
      v-if="mq.phone && isContactPickerModalDisplayed"
      :selected-contacts="recipients"
      @addContacts="addRecipients"
      @removeContacts="removeRecipients"
      @close="isContactPickerModalDisplayed=false"
    />
    <ContactPickerToolTip
      v-else-if="isContactPickerInitialized"
      v-show="isContactPickerModalDisplayed"
      :selected-contacts="recipients"
      :create-button="$refs.openContactTooltipButton"
      :init-coordinates="initTooltipPosition"
      @addContacts="addRecipients"
      @removeContacts="removeRecipients"
      @close="isContactPickerModalDisplayed=false"
    />
  </teleport>
</template>

<script>
import { returnAddedFiles, alertNoFile } from '@utils/upload.util'
import { importDocuments } from '@utils/documents.util'

import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import constants from '@/constants/messagingConstants'
import messageService from '@/api/messaging/message.service'
import messagingUtils from '@/utils/messaging.utils'
import ErrorMessage from '@components/Base/ErrorMessage.vue'
import AttachedFiles from '@components/Base/AttachedFiles'
import FilePickerModal from '@components/FilePicker/FilePickerModal'
import TextContent from '@components/Progression/Edit/Contents/TextContent'
import dayjs from 'dayjs'
import NeroIcon from '@/components/Nero/NeroIcon'
import { addContactFieldsToContactList } from '@utils/contacts.utils'
import { defineAsyncComponent } from 'vue'
import ContactPickerToolTip from '@components/ContactPicker/ContactPickerToolTip.vue'
const ContactPickerModal = defineAsyncComponent(() => import('@components/ContactPicker/ContactPickerModal.vue'))

const isRecipientsValid = (str) => {
  return !(str.length > 0) // A recipient at least
}

const isSubjectValid = (str) => {
  return !(str.trim() === '') // Subject must not contain only spaces
}

let timeout

export default {
  name: 'CreateMessageModal',
  components: {
    ContactPickerToolTip,
    ContactPickerModal,
    TextContent,
    FilePickerModal,
    ErrorMessage,
    AttachedFiles,
    NeroIcon
  },
  inject: ['mq'],
  props: {
  },
  emits: ['close'],
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      recipients: [],
      subject: '',
      initialContent: { contentValue: '' },
      currentContent: { contentValue: '' },
      previousContent: {},
      isInitialized: false,
      attachedFiles: [],
      search: '',
      error: '',
      autocompleteItems: [],
      isFilePickerModalDisplayed: false,
      isContactPickerModalDisplayed: false,
      originMessage: {},
      initialRecipients: [],
      initTooltipPosition: { x: 0, y: 0 },
      isContactPickerInitialized: false // Useful in add to v-show to not initialize component immediately
    }
  },
  validations: {
    recipients: {
      required,
      isRecipientsValid
    },
    subject: {
      required,
      isSubjectValid
    }
  },
  computed: {
    device () {
      if (this.mq.phone) {
        return 'phone'
      } else {
        return 'desktop'
      }
    },
    isAttachedFileOpen () {
      return this.$store.state.documents.openFiles.length > 0
    },
    messageParameters () {
      return this.$store.state.messaging.createMessageParameters
    },
    areNewRecipientsAdded () {
      // Returns true if, in case of reply, replyAll or forward, any new recipient is added
      for (const newRecipient of this.recipients) {
        if (!this.initialRecipients.includes(newRecipient)) {
          return true
        }
      }
      return false
    }
  },
  created () {
    if (this.$store.state.documentsProperties === undefined) {
      this.$store.dispatch('documents/getGlobalDocumentsProperties')
    }

    this.$store.dispatch('misc/incrementModalCount')
    this.init()
  },
  mounted () {
    if (this.messageParameters.isNew && !this.mq.phone && !this.mq.tablet) {
      const input = this.$refs.tagsinput.$el.firstChild.lastChild
      input.focus()
    }
    this.getToolTipPosition()
  },
  updated () {
    this.getToolTipPosition()
  },
  methods: {
    importDocument () {
      // Create hidden inputFile
      const input = document.createElement('input')
      input.style.display = 'none'
      input.type = 'file'
      input.accept = '*/*'
      input.multiple = true

      input.onchange = e => {
        returnAddedFiles(e, this.$store).then((files) => {
          if (files.length !== 0) {
            this.$store.dispatch('currentActions/setImportFileList', files)
            this.$store.dispatch('currentActions/displayUploadProgression')

            importDocuments(undefined, files).then((data) => {
              this.addNewFiles(this.$store.state.currentActions.listUploadedFiles)
              this.$store.dispatch('currentActions/hideUploadProgression')
            })
          } else {
            alertNoFile()
          }
        })
      }

      // Click it
      input.click()
    },
    toggleContactsPicker () {
      if (!this.isContactPickerInitialized) {
        this.isContactPickerInitialized = true
      }
      this.isContactPickerModalDisplayed = !this.isContactPickerModalDisplayed
    },
    init () {
      // If a message is selected -> action on this message
      // Else -> pick last thread's message
      if (!this.messageParameters.isNew &&
        (this.$store.state.messaging.selectedMessages.length === 1 || this.$store.state.messaging.selectedThreads.length === 1)) {
        if (this.messageParameters.isDraft) {
          // Draft
          this.originMessage = { messageId: this.messageParameters.draftMessageId }
        } else {
          // Reply, replyAll, Forward
          if (this.$store.state.messaging.selectedMessages.length === 1) {
            // Message is selected -> use it
            this.originMessage = this.$store.state.messaging.selectedMessages[0]
          } else if (this.$store.state.messaging.selectedThreads.length === 1) {
            // Thread is selected -> pick last message
            this.originMessage = messagingUtils.getThreadLastMessage(this.$store.state.messaging.selectedThreads[0])
          }
        }
        messageService.getMessageAnswerForwardInfos(
          this.originMessage.messageId,
          this.messageParameters.isReply,
          this.messageParameters.isReplyAll,
          this.messageParameters.isForward,
          this.messageParameters.isDraft).then((data) => {
          if (data.success) {
            if (this.messageParameters.isDraft || this.messageParameters.isForward) {
              this.initialContent.contentValue = data.content
            } else {
              // Reply, replyAll, forward
              this.initialContent.contentValue = ''
              this.buildPreviousContent(data.content)
            }
            this.subject = data.subject
            this.initialRecipients = data.recipients
            this.recipients = data.recipients
            this.attachedFiles = data.attachedFiles

            // Prefix content with signature except for draft edition
            if (!this.messageParameters.isDraft && this.$store.state.messaging.signature !== '') {
              this.initialContent.contentValue = this.initialContent.contentValue + '</br></br>' + this.$store.state.messaging.signature
            }
            this.isInitialized = true
            this.currentContent.contentValue = this.initialContent.contentValue
          }
        })
      } else if (!this.messageParameters.isNew) {
        console.error('More than 1 thread or 1 message selected and NO new message -> closing create message modal')
        this.onClose()
      } else {
        this.originMessage = {}
        if (this.messageParameters.recipientList) {
          this.recipients = this.messageParameters.recipientList
        }
        // Prefix content with signature except for draft edition
        if (!this.messageParameters.isDraft && this.$store.state.messaging.signature !== '') {
          this.initialContent.contentValue = '</br></br>' + this.$store.state.messaging.signature
        }
        this.isInitialized = true
      }

      this.currentContent.contentValue = this.initialContent.contentValue
    },
    updateContent (value) {
      this.currentContent.contentValue = value
    },
    getToolTipPosition () {
      const windowContainer = this.$refs.createMessageModal.getElementsByClassName('window-container')[0]
      this.initTooltipPosition.x = windowContainer.getBoundingClientRect().x
      this.initTooltipPosition.y = this.$refs.createMessageSubjectInput.$el.getBoundingClientRect().y
      this.initTooltipPosition.minHeight = windowContainer.getBoundingClientRect().bottom - this.initTooltipPosition.y
    },
    searchTimeOut () {
      this.autocompleteItems = []
      clearTimeout(timeout)
      // Make a new timeout set to go off in 800ms
      timeout = setTimeout(() => {
        if (this.$refs.tagsinput.inputValue.length >= 2) {
          this.getCompletion(this.$refs.tagsinput.inputValue)
        }
      }, 300)
    },
    getCompletion (query) {
      messageService.getUsersCompletion(query).then((data) => {
        if (data.success) {
          this.autocompleteItems = data.results
          addContactFieldsToContactList(data.results)
        } else {
          console.error('Error while getting users', data.error)
        }
      })
    },
    checkFields () {
      if (this.recipients.length === 0) {
        this.error = 'missingRecipient'
      } else if ((this.subject.trim() === '')) {
        this.error = ''
        this.$store.dispatch('warningModal/addWarning', {
          text: this.$t('Messaging.noObjectWarning'),
          lastAction: { fct: this.sendMessage, params: [] }
        })
      } else {
        this.sendMessage()
      }
    },
    sendMessage () {
      const successMessage = this.$t('successMessage')
      // In case of reply, replyAll or forward
      // previous content is added in case of forward OR (reply or replyAll AND no recipient added)
      messageService.sendMessage(
        this.recipients,
        this.subject,
        (this.areNewRecipientsAdded && this.previousContent.contentValue) ? this.currentContent.contentValue + this.previousContent.contentValue : this.currentContent.contentValue,
        this.attachedFiles,
        this.messageParameters.draftMessageId,
        this.originMessage.messageId === undefined ? '0' : this.originMessage.messageId,
        this.messageParameters.isReply,
        this.messageParameters.isForward,
        false).then((data) => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: successMessage, type: 'success' })
          if (this.$store.state.messaging.selectedMessages.length > 0) {
            // Message is selected -> reload parent thread
            for (const thread of this.$store.state.messaging.threads) {
              if (thread.threadId === this.$store.state.messaging.selectedMessages[0].threadId) {
                messagingUtils.reloadThread(thread)
                break
              }
            }
          } else {
            // Thread is selected
            if (this.$store.state.messaging.lastSelectedThread !== undefined) {
              messagingUtils.reloadThread(this.$store.state.messaging.lastSelectedThread)
            }
          }
          // Refresh thread list if this is a reply, a forward or a draft
          if (this.messageParameters.isReply || this.messageParameters.isReplyAll || this.messageParameters.isForward || this.messageParameters.isDraft) {
            this.$store.dispatch('messaging/selectFolder', this.$store.state.messaging.currentFolder)
          }
          // Reload messages panel if this is a reply
          if ((this.messageParameters.isReply || this.messageParameters.isReplyAll) && this.$store.state.messaging.selectedThreads.length === 1) {
            console.log('select Thread ', this.$store.state.messaging.selectedThreads[0], 'to reload messages thread')
            messagingUtils.selectThread(this.$store.state.messaging.selectedThreads[0]) // Assume there is one selected thread to respond to a message
          }
          // Refresh thread list if this is a new message and if current folder is sentBox
          if (this.$store.state.messaging.currentFolder.type === constants.messagingSentFolderType) {
            this.$store.dispatch('messaging/selectFolder', this.$store.state.messaging.currentFolder)
          }
        }
      })
      this.onClose()
    },
    buildPreviousContent (previousContent) {
      this.previousContent.contentValue = '</br><details><summary>' + this.$t('at') +
        dayjs(this.originMessage.sendDate, 'YYYY/MM/DD HH:mm:ss').format('DD/MM/YYYY HH:mm') +
        ' ' + this.originMessage.senderName + this.$t('wrote') + '</summary>' +
        '</br> ' + "<div style='border-left:1px solid #000; padding-left:20px'>" +
        previousContent +
        '</div>' +
        '</details>'
    },
    saveDraft () {
      const successMessage = this.$t('draftSaved')
      messageService.saveDraft(this.recipients, this.subject, this.currentContent.contentValue, this.attachedFiles, this.messageParameters.draftMessageId, false).then((data) => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: successMessage, type: 'info' })
          messagingUtils.refresh() // Useless because of the running thread in backend
        }
      })
      this.onClose()
    },
    onConfirmClose () {
      if (!this.isFilePickerModalDisplayed && !this.isAttachedFileOpen) {
        // TODO: Save initial recipients and subject to be accurate on drafts
        if (this.currentContent.contentValue !== this.initialContent.contentValue || this.recipients.length > 0 || this.subject !== '') {
          this.$store.dispatch('warningModal/addWarning', {
            text: this.$t('closeWarning'),
            lastAction: { fct: this.onClose }
          })
        } else {
          this.onClose()
        }
      }
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
      this.recipients = []
      this.subject = ''
      this.initialContent = {}
      this.currentContent = {}
      this.closeFilePicker()
      this.$store.dispatch('messaging/closeCreateMessageModal')
    },
    addRecipients (contactList) {
      this.recipients = [...this.recipients, ...contactList]
    },
    removeRecipients (contactList) {
      contactList.forEach((contact) => {
        this.removeRecipient(contact)
      })
    },
    removeRecipient (contact) {
      const index = this.recipients.map(recipient => recipient.id).indexOf(contact.id)
      if (index !== -1) {
        this.recipients.splice(index, 1)
      } else {
        console.error('Cannot remove ', contact, 'from recipientList: ', this.recipients)
      }
    },
    displayFilePicker () {
      this.isFilePickerModalDisplayed = true
    },
    closeFilePicker () {
      this.isFilePickerModalDisplayed = false
    },
    addNewFiles (newFiles) {
      this.attachedFiles = [...this.attachedFiles, ...newFiles]
    },
    removeAttachedFile (fileToRemove) {
      this.attachedFiles.splice(this.attachedFiles.indexOf(fileToRemove), 1)
    }
  }
}
</script>

<style lang="scss">
.create-message-modal.modal-mask .window-container .window-body {
  max-height: 70vh;
  overflow-y: auto;
}

.create-message-modal.phone .window-container .window-body {
  max-height: none;
}

.create-message-modal {
  .ck-editor {
    p {
      margin: 5px 0;
      line-height: 1.25rem;
    }
  }

  .ck-editor__editable {
    min-height: 15rem;
  }

  &.phone .ck-editor__editable {
    min-height: 12rem;
  }
}

@supports(height: 100dvh) {
  :not(.phone).create-message-modal.modal-mask .window-container .window-body {
    max-height: 70dvh;
  }

  .create-message-modal.phone .window-container .window-body.full-screen {
    max-height: 80dvh;
  }
}

</style>

<style lang="scss" scoped>
@import "@design";

#create-message-subject-input, .tags {
  min-width: 65vw;

  &.phone {
    min-width: 0;
  }
}

.create-message-modal {
  padding: 20px;
  display: flex;

  &.phone {
    padding: 0;
  }
}

.recipients-panel{
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  .create-button {
    margin-left: 1em;
  }
}

.recipients {
  width: 90%;
  max-width: calc(100% - 55px)
}

.recipients-panel, .subject {
  padding-bottom: 10px;
}

.error-container {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.content {
  border: 1px solid $color-border;
  width: 100%;
  min-width: 30rem;

  &.phone {
    min-width: 0;
  }
}

.attached-label {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.add-document-button {
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  margin: 0;
  border: none;
  display: flex;
  align-items: center;

  .icon {
    width: 20px;
    height: 20px;
  }
}

.footer {
  width: 100%;

  &.desktop {
    .draftButton {
      margin-left: auto;
      margin-right: 20px;
    }
  }

  &.phone{
    display: flex;
    justify-content: space-between;
  }
}
</style>

<i18n locale="fr">
{
  "attachedFiles": "Pièces jointes :",
  "header": "Nouveau message",
  "headerForward": "Transférer",
  "headerReply": "Répondre",
  "headerReplyAll": "Répondre à tous",
  "submitButton": "Envoyer",
  "recipientsPlaceHolder": "Destinataires",
  "subjectPlaceHolder": "Objet",
  "contentPlaceHolder": "Contenu",
  "addAttachFileButton": "Ajouter une pièce jointe depuis mes documents",
  "addLocalAttachFileButton": "Ajouter une pièce jointe depuis mon poste de travail",
  "draftButton": "Enregistrer en brouillon",
  "draftSaved": "Brouillon enregistré!",
  "successMessage": "Message envoyé",
  "required": "Champ requis",
  "notBeginByDot": "Ne doit pas commencer par un '.'",
  "containsNoCotes": "Ne doit pas contenir de caractères spéciaux",
  "missingRecipient": "Sélectionnez au moins un destinataire",
  "sizeLimit1": "Ne doit pas dépasser ",
  "sizeLimit2": " caractères",
  "addRecipients": "Ajouter des destinataires",
  "closeWarning": "Souhaitez-vous fermer cette fenêtre ? (Vous perdrez son contenu)",
  "displayDetails": "Afficher les détails",
  "at": "Le ",
  "wrote": " a écrit :",
  "othersLabel": "et {nbOthers} autres"
}
</i18n>
