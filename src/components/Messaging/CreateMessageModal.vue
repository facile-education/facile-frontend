<template>
  <div>
    <PentilaWindow
      :modal="true"
      :is-full-screen="mq.phone"
      :height="650"
      data-test="createMessageModal"
      class="create-message-modal"
      :class="{'phone': mq.phone}"
      @close="onClose"
      @keydown.exact.backspace.stop=""
      @keydown.exact.delete.stop=""
      @keydown.exact.f2.stop=""
      @keydown.ctrl.stop=""
      @keydown.exact.escape.stop="onClose"
    >
      <template #header>
        <span
          v-if="messageParameters.isForward"
          v-t="'headerForward'"
        />
        <span
          v-else-if="messageParameters.isReply || messageParameters.isReplyAll"
          v-t="'headerReply'"
        />
        <span
          v-else
          v-t="'header'"
        />
      </template>

      <template #body>
        <!-- Recipients -->
        <div
          class="recipients"
          data-test="recipients-section"
        >
          <PentilaTagsInput
            ref="tagsinput"
            v-model="recipients"
            :close-on-select="true"
            :completion-only="true"
            :min-length="1"
            :placeholder="$t('recipientsPlaceHolder')"
            display-field="name"
            id-field="id"
            :list="autocompleteItems"
            class="tags"
            :class="device"
            @input="searchTimeOut"
          />
        </div>
        <div class="error-container">
          <ErrorMessage
            v-if="error==='missingRecipient'"
            class="error-message"
            :error-message="$t('missingRecipient')"
          />
        </div>

        <!-- Subject -->
        <div
          class="subject"
          data-test="subject-section"
        >
          <PentilaInput
            id="create-message-subject-input"
            v-model="subject"
            :class="device"
            class="subject-input"
            data-test="subject-input"
            :placeholder="$t('subjectPlaceHolder')"
          />
        </div>

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
          />
        </div>

        <!-- Attached files -->
        <div
          class="attached-files"
          data-test="attached-files-section"
        >
          <p v-t="'attachedFiles'" />
          <PentilaButton
            :label="$t('addAttachFileButton')"
            @click="displayFilePicker"
          />
          <AttachedFiles
            :initial-attached-files="attachedFiles"
            :read-only="false"
            class="files"
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
  <teleport to="body">
    <FilePickerModal
      v-if="isFilePickerModalDisplayed"
      class="file-picker-mode"
      height="30em"
      :multi-selection="true"
      @addedFiles="addNewFiles"
      @close="closeFilePicker"
    />
  </teleport>
</template>

<script>
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
    TextContent,
    FilePickerModal,
    ErrorMessage,
    AttachedFiles
  },
  inject: ['mq'],
  props: {
  },
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
      originMessage: {},
      initialRecipients: []
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
    this.init()
  },
  mounted () {
    if (this.messageParameters.isNew && !this.mq.phone && !this.mq.tablet) {
      const input = this.$refs.tagsinput.$el.firstChild.lastChild
      input.focus()
    }
  },
  methods: {
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
    searchTimeOut () {
      clearTimeout(timeout)
      // Make a new timeout set to go off in 800ms
      timeout = setTimeout(() => {
        if (this.$refs.tagsinput.inputValue.length >= 2) {
          this.getCompletion(this.$refs.tagsinput.inputValue)
        }
      }, 500)
    },
    getCompletion (query) {
      console.log('get completion with query: ' + query)
      messageService.getUsersCompletion(query).then((data) => {
        if (data.success) {
          this.autocompleteItems = data.results
          this.autocompleteItems.forEach((item) => { item.type = 1 }) // Override generic getUserCompletion results to have the good type
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
          if (this.messageParameters.isReply || this.messageParameters.isForward || this.messageParameters.isDraft) {
            this.$store.dispatch('messaging/selectFolder', this.$store.state.messaging.currentFolder)
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
      this.previousContent.contentValue = '</br><details><summary>Afficher les détails</summary>' +
        '</br> ' + "<div style='border-left:1px solid #000; padding-left:20px'>" +
        'Le ' + dayjs(this.originMessage.sendDate, 'YYYY/MM/DD HH:mm:ss').format('DD/MM/YYYY HH:mm') +
        ' ' + this.originMessage.senderName + ' a écrit :</br> ' +
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
    onClose () {
      this.recipients = []
      this.subject = ''
      this.initialContent = {}
      this.currentContent = {}
      this.closeFilePicker()
      this.$store.dispatch('messaging/closeCreateMessageModal')
    },
    displayFilePicker () {
      this.isFilePickerModalDisplayed = true
    },
    closeFilePicker () {
      this.isFilePickerModalDisplayed = false
    },
    addNewFiles (newFiles) {
      this.attachedFiles = [...newFiles]
    },
    removeAttachedFile (fileToRemove) {
      this.attachedFiles.splice(this.attachedFiles.indexOf(fileToRemove), 1)
    }
  }
}
</script>

<style lang="scss">
.phone {
  .window-container {
    .window-body.full-screen {
      max-height: 80vh;

      .ck-editor__editable {
        min-height: 10rem;
      }
    }
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

  .recipients {
    display: flex;
    margin: auto;
    width: 100%;

    p {
      margin: auto;
      width: 50px;
    }
    .tags {
      width: 100%;
      max-width: 650px;
    }
  }

  .error-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .subject {
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    margin: auto;
    width: 100%;

    p {
      margin: auto;
      width: 50px;
    }
    .subject-input {
      width: 100%;
      max-width: 650px;
    }
  }

  .content {
    border: 1px solid $color-border;
    width: 100%;
    min-width: 30rem;

    &.phone {
      min-width: 0;
    }
  }

  .attached-files {
    padding-top: 30px;
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

  &.phone {
    padding: 0;

    .attached-files {
      padding-top: 0;
    }
  }
}
</style>

<i18n locale="fr">
{
  "attachedFiles": "Pièces jointes",
  "header": "Nouveau message",
  "headerForward": "Transférer",
  "headerReply": "Répondre",
  "submitButton": "Envoyer",
  "recipientsPlaceHolder": "Destinataires",
  "subjectPlaceHolder": "Objet",
  "contentPlaceHolder": "Contenu",
  "addAttachFileButton": "Ajouter une pièce jointe",
  "draftButton": "Enregistrer en brouillon",
  "draftSaved": "Brouillon enregistré!",
  "successMessage": "Message envoyé",
  "required": "Champ requis",
  "notBeginByDot": "Ne doit pas commencer par un '.'",
  "containsNoCotes": "Ne doit pas contenir de caractères spéciaux",
  "missingRecipient": "Sélectionnez au moins un destinataire",
  "sizeLimit1": "Ne doit pas dépasser ",
  "sizeLimit2": " caractères"
}
</i18n>
