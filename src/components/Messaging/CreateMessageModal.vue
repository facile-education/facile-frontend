<template>
  <div>
    <PentilaWindow
      :modal="true"
      :is-full-screen="mq.phone"
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
          v-t="'Messaging.CreateMessageModal.headerForward'"
        />
        <span
          v-else-if="messageParameters.isReply || messageParameters.isReplyAll"
          v-t="'Messaging.CreateMessageModal.headerReply'"
        />
        <span
          v-else
          v-t="'Messaging.CreateMessageModal.header'"
        />
      </template>

      <template #body>
        <!-- Recipients -->
        <div
          class="recipients"
          data-test="recipients-section"
        >
          <p>A:</p>
          <PentilaTagsInput
            ref="tagsinput"
            v-model="recipients"
            :close-on-select="true"
            :completion-only="true"
            :min-length="1"
            :placeholder="$t('Messaging.CreateMessageModal.recipientsPlaceHolder')"
            display-field="text"
            id-field="id"
            :list="autocompleteItems"
            class="tags"
            :class="device"
          />
        </div>
        <div class="error-container">
          <ErrorMessage
            v-if="error==='missingRecipient'"
            class="error-message"
            :error-message="$t('Messaging.formErrors.missingRecipient')"
          />
        </div>

        <!-- Subject -->
        <div
          class="subject"
          data-test="subject-section"
        >
          <p>Objet:</p>
          <PentilaInput
            id="create-message-subject-input"
            v-model="subject"
            :class="device"
            class="subject-input"
            data-test="subject-input"
            :placeholder="$t('Messaging.CreateMessageModal.subjectPlaceHolder')"
          />
        </div>

        <!-- Content -->
        <div
          v-if="isInitialized"
          class="ck-content"
          data-test="content-section"
          :class="device"
        >
          <CKEditor
            :initial-content="content"
            :options="editorOptions"
            @input="updateContent"
          />
        </div>

        <!-- Attached files -->
        <div
          class="attached-files"
          data-test="attached-files-section"
        >
          <p>Pièces jointes</p>
          <PentilaButton
            :label="$t('Messaging.CreateMessageModal.addAttachFileButton')"
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
            :label="$t('Messaging.CreateMessageModal.draftButton')"
            @click="saveDraft"
          />
          <PentilaButton
            data-test="submitButton"
            class="dark"
            :label="$t('Messaging.CreateMessageModal.submitButton')"
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
import CKEditor from '@components/Base/CKEditor'
import moment from 'moment'

const isRecipientsValid = (str) => {
  return !(str.length > 0) // A recipient at least
}

const isSubjectValid = (str) => {
  return !(str.trim() === '') // Subject must not contain only spaces
}

export default {
  name: 'CreateMessageModal',
  components: {
    FilePickerModal,
    ErrorMessage,
    AttachedFiles,
    CKEditor
  },
  inject: ['mq'],
  props: {
  },
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      recipients: [],
      subject: '',
      content: '',
      isInitialized: false,
      attachedFiles: [],
      search: '',
      error: '',
      autocompleteItems: [],
      isFilePickerModalDisplayed: false,
      originMessage: {},
      editorConfig: {},
      editorOptions: {},
      previousContent: '',
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
    editor () {
      return this.$refs.myQuillEditor.quill
    },
    device () {
      if (this.mq.phone) {
        return 'phone'
      } else {
        return 'desktop'
      }
    },
    messageParameters () {
      return this.$store.state.messaging.createMessageParameters
    }
  },
  created () {
    this.init()
    this.initItems()
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
              this.content = data.content
            } else {
              // Reply, replyAll, forward
              this.content = ''
              this.buildPreviousContent(data.content)
            }
            this.subject = data.subject
            this.initialRecipients = data.recipients
            this.recipients = data.recipients
            this.attachedFiles = data.attachedFiles

            // Prefix content with signature except for draft edition
            if (!this.messageParameters.isDraft && this.$store.state.messaging.signature !== '') {
              this.content = this.$store.state.messaging.signature + '</br></br>' + this.content
            }
            this.isInitialized = true
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
          this.content = this.$store.state.messaging.signature + '</br></br>' + this.content
        }
        this.isInitialized = true
      }
    },
    initItems () {
      messageService.getUsersCompletion(this.search).then((data) => {
        if (data.success) {
          this.autocompleteItems = data.users
        }
      })
    },
    checkFields () {
      if (this.recipients.length === 0) {
        this.error = 'missingRecipient'
      } else if ((this.subject.trim() === '')) {
        this.error = ''
        console.log('open warn modal')
        this.$store.dispatch('warningModal/addWarning', {
          text: this.$t('Messaging.noObjectWarning'),
          lastAction: { fct: this.sendMessage, params: [] }
        })
      } else {
        this.sendMessage()
      }
    },
    sendMessage () {
      const successMessage = this.$t('CreateFolderModal.success')
      // In case of reply, replyAll or forward
      // previous content is added in case of forward OR (reply or replyAll AND no recipient added)
      messageService.sendMessage(
        this.recipients,
        this.subject,
        this.areNewRecipientsAdded() ? this.content + this.previousContent : this.content,
        this.attachedFiles,
        this.messageParameters.draftMessageId,
        this.originMessage.messageId === undefined ? '0' : this.originMessage.messageId,
        this.messageParameters.isReply,
        this.messageParameters.isForward,
        false).then((data) => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: successMessage })
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
    updateContent (newContent) {
      this.content = newContent
    },
    buildPreviousContent (previousContent) {
      this.previousContent = '</br><details><summary>Afficher les détails</summary>' +
        '</br> ' + "<div style='border-left:1px solid #000; padding-left:20px'>" +
        'Le ' + moment(this.originMessage.sendDate, 'YYYY/MM/DD HH:mm:ss SSS').format('DD/MM/YYYY HH:mm') +
        ' ' + this.originMessage.senderName + ' a écrit :</br> ' +
        previousContent +
        '</div>' +
        '</details>'
    },
    areNewRecipientsAdded () {
      // Returns true if, in case of reply, replyAll or forward, any new recipient is added
      for (const newRecipient of this.recipients) {
        if (!this.initialRecipients.includes(newRecipient)) {
          return true
        }
      }
      return false
    },
    saveDraft () {
      messageService.saveDraft(this.recipients, this.subject, this.content, this.attachedFiles, this.messageParameters.draftMessageId, false).then((data) => {
        if (data.success) {
          messagingUtils.refresh() // Useless because of the running thread in backend
        }
      })
      this.onClose()
    },
    onClose () {
      this.recipients = []
      this.subject = ''
      this.content = ''
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
      console.log('addNewFiles, files=', newFiles)
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
      max-height: 80vh
    }
  }
}
</style>

<style lang="scss" scoped>
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

  .ck-content {
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
