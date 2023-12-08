<template>
  <div ref="createMessageModal">
    <WeprodeWindow
      :modal="true"
      :draggable="true"
      :full-screen="mq.phone || mq.tablet"
      data-test="createMessageModal"
      class="create-message-modal"
      :class="{'phone': (mq.phone || mq.tablet)}"
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
          <WeprodeTagsInput
            ref="tagsinput"
            v-model="recipients"
            data-test="recipientsInput"
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
          <WeprodeButton
            ref="openContactTooltipButton"
            :class="{'phone': mq.phone, 'close-contact': isContactPickerModalDisplayed}"
            class="create-button"
            data-test="openContactPicker"
            @click="toggleContactsPicker"
          >
            <NeroIcon
              name="fa-plus"
              class="icon"
            />
          </WeprodeButton>
        </div>
        <div class="error-container">
          <WeprodeErrorMessage
            v-if="error==='missingRecipient'"
            :error-message="$t('missingRecipient')"
          />
        </div>

        <!-- Subject -->
        <WeprodeInput
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
            class="ck-editor"
            :content="content"
            @input="content=$event"
            @keydown.stop
            @keyup.stop
          />
        </div>

        <!-- Attached files -->
        <div
          class="attached-files"
          data-test="attached-files-section"
        >
          <AttachedFiles
            v-model="attachedFiles"
            :read-only="false"
            @remove-attached-file="removeAttachedFile"
          />
        </div>

        <!-- Original message in case of reply -->
        <div
          v-if="(messageParameters.isReply || messageParameters.isReplyAll) && originMessage.content !== ''"
          class="replied-message"
          v-html="originMessage.content"
        />
      </template>

      <template #footer>
        <div
          class="footer"
          :class="device"
        >
          <WeprodeButton
            data-test="draftButton"
            class="draftButton"
            :label="$t('draftButton')"
            @click="saveDraft"
          />
          <WeprodeButton
            data-test="submitButton"
            class="dark"
            :label="$t('submitButton')"
            :disabled="isLoading"
            @click="checkFields"
          />
        </div>
      </template>
    </WeprodeWindow>
  </div>
  <teleport to="body">
    <ContactPickerModal
      v-if="mq.phone && isContactPickerModalDisplayed"
      :selected-contacts="recipients"
      @add-contacts="addRecipients"
      @remove-contacts="removeRecipients"
      @close="isContactPickerModalDisplayed=false"
    />
    <ContactPickerToolTip
      v-else-if="isContactPickerInitialized"
      v-show="isContactPickerModalDisplayed"
      :selected-contacts="recipients"
      :create-button="$refs.openContactTooltipButton"
      :init-coordinates="initTooltipPosition"
      @add-contacts="addRecipients"
      @remove-contacts="removeRecipients"
      @close="isContactPickerModalDisplayed=false"
    />
  </teleport>
</template>

<script>
import AttachedFiles from '@components/AttachedFiles/AttachedFiles.vue'
import TextContent from '@components/Base/TextContent.vue'
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import ContactPickerToolTip from '@components/ContactPicker/ContactPickerToolTip.vue'
import { addContactFieldsToContactList } from '@utils/contacts.utils'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import messageService from '@/api/messaging/message.service'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeTagsInput from '@/components/Base/Weprode/WeprodeTagsInput.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import NeroIcon from '@/components/Nero/NeroIcon'
import constants from '@/constants/messagingConstants'
import messagingUtils from '@/utils/messaging.utils'
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
    AttachedFiles,
    NeroIcon,
    WeprodeButton,
    WeprodeErrorMessage,
    WeprodeInput,
    WeprodeTagsInput,
    WeprodeWindow
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
      content: '',
      attachedFiles: [],
      initialForm: undefined,
      isInitialized: false,
      search: '',
      error: '',
      autocompleteItems: [],
      isContactPickerModalDisplayed: false,
      isLoading: false,
      originMessage: {},
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
    }
  },
  created () {
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
            this.originMessage = { ...this.$store.state.messaging.selectedMessages[0] }
          } else if (this.$store.state.messaging.selectedThreads.length === 1) {
            // Thread is selected -> pick last message
            this.originMessage = { ...messagingUtils.getThreadLastMessage(this.$store.state.messaging.selectedThreads[0]) }
          }
        }
        messageService.getMessageAnswerForwardInfos(
          this.originMessage.messageId,
          this.messageParameters.isReply,
          this.messageParameters.isReplyAll,
          this.messageParameters.isForward,
          this.messageParameters.isDraft).then((data) => {
          if (data.success) {
            if (this.messageParameters.isDraft) {
              this.content = data.content
            } else if (this.messageParameters.isForward) {
              this.content = this.formatPreviousContent(data.content)
            } else {
              // Reply, replyAll
              this.content = ''
              this.originMessage.content = this.formatPreviousContent(data.content)
            }
            this.subject = data.subject
            messagingUtils.formatContacts(data.recipients)
            this.recipients = data.recipients
            this.attachedFiles = data.attachedFiles

            // Suffix content with signature except for draft edition
            if (!this.messageParameters.isDraft && this.$store.state.messaging.signature !== '') {
              this.content = this.content + '</br></br>' + this.$store.state.messaging.signature
            }

            this.isInitialized = true
          }
          this.saveInitialForm()
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
          this.content = '</br></br>' + this.$store.state.messaging.signature
        }
        this.isInitialized = true
        this.saveInitialForm()
      }
    },
    saveInitialForm () {
      this.initialForm = JSON.stringify({
        recipients: this.recipients,
        subject: this.subject,
        content: this.content,
        attachedFiles: this.attachedFiles
      })
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
      this.isLoading = true
      // In case of reply, replyAll or forward
      // previous content is added in case of forward OR (reply or replyAll AND no recipient added)
      messageService.sendMessage(
        this.recipients,
        this.subject,
        this.content,
        this.attachedFiles,
        this.messageParameters.draftMessageId,
        this.originMessage.messageId === undefined ? '0' : this.originMessage.messageId,
        this.messageParameters.isReply || this.messageParameters.isReplyAll,
        this.messageParameters.isForward,
        false).then((data) => {
        this.isLoading = false

        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: successMessage, type: 'success' })
          // Wait a little before refreshing because sending is done in a new thread
          setTimeout(() => {
            if (this.$store.state.messaging.selectedMessages.length > 0) {
            // Message is selected -> reload parent thread
              for (const thread of this.$store.state.messaging.threads) {
                if (thread.threadId === this.$store.state.messaging.selectedMessages[0].threadId) {
                  messagingUtils.reloadThread(thread)
                  break
                }
              }
            } else if (this.$store.state.messaging.lastSelectedThread !== undefined) { // Thread is selected
              messagingUtils.reloadThread(this.$store.state.messaging.lastSelectedThread)
            }
            // Refresh thread list if this is a reply, a forward or a draft
            if (this.messageParameters.isReply || this.messageParameters.isReplyAll || this.messageParameters.isForward || this.messageParameters.isDraft) {
              this.$store.dispatch('messaging/selectFolder', this.$store.state.messaging.currentFolder)
            }
            // Reload messages panel if this is a reply
            if ((this.messageParameters.isReply || this.messageParameters.isReplyAll) && this.$store.state.messaging.selectedThreads.length === 1) {
              messagingUtils.selectThread(this.$store.state.messaging.selectedThreads[0]) // Assume there is one selected thread to respond to a message
            }
            // Refresh thread list if this is a new message and if current folder is sentBox
            if (this.$store.state.messaging.currentFolder.type === constants.messagingSentFolderType) {
              this.$store.dispatch('messaging/selectFolder', this.$store.state.messaging.currentFolder)
            }
            this.onClose()
          }, 500)
        } else {
          console.error('Error while sending files')
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
          this.onClose()
        }
      }, (err) => {
        this.isLoading = false
        console.error(err)
        this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        this.onClose()
      })
    },
    formatPreviousContent (content) {
      return '</br><details><summary>' + this.$t('at') +
        dayjs(this.originMessage.sendDate, 'YYYY/MM/DD HH:mm:ss').format('DD/MM/YYYY HH:mm') +
        ' ' + this.originMessage.senderName + this.$t('wrote') + '</summary>' +
        '</br> ' + "<div style='border-left:1px solid #000; padding-left:20px'>" +
        content +
        '</div>' +
        '</details>'
    },
    saveDraft () {
      const successMessage = this.$t('draftSaved')
      const originThreadId = (this.originMessage !== undefined && this.originMessage.threadId !== undefined ? this.originMessage.threadId : 0)
      messageService.saveDraft(this.recipients, this.subject, this.content, this.attachedFiles, this.messageParameters.draftMessageId, originThreadId, false).then((data) => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: successMessage, type: 'info' })
          // Refresh origin message if draft made from a reply
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
          messagingUtils.refresh() // Useless because of the running thread in backend
        }
      })
      this.onClose()
    },
    onConfirmClose () {
      if (!this.isAttachedFileOpen) {
        const currentForm = JSON.stringify({
          recipients: this.recipients,
          subject: this.subject,
          content: this.content,
          attachedFiles: this.attachedFiles
        })
        if (currentForm !== this.initialForm) {
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
      this.initialForm = undefined
      this.recipients = []
      this.subject = ''
      this.content = ''
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
    removeAttachedFile (fileToRemove) {
      this.attachedFiles.splice(this.attachedFiles.indexOf(fileToRemove), 1)
    }
  }
}
</script>

<style lang="scss">
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
</style>

<style lang="scss" scoped>
@import "@design";

#create-message-subject-input, .tags {
  min-width: 65vw;

  &.phone {
    min-width: 0;
  }
}

.recipients-panel{
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  .create-button {
    margin-left: 1em;

    &.close-contact {
      .icon {
        transform: rotate(45deg);
      }
    }
  }
}

.recipients {
  width: 90%;
  max-width: calc(100% - 55px)
}

.recipients-panel, .subject {
  padding-bottom: 10px;
}

.replied-message {
  background-color: $neutral-20;
  &:hover {
    cursor: pointer;
  }
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
  "header": "Nouveau message",
  "headerForward": "Transférer",
  "headerReply": "Répondre",
  "headerReplyAll": "Répondre à tous",
  "submitButton": "Envoyer",
  "recipientsPlaceHolder": "Destinataires",
  "subjectPlaceHolder": "Objet",
  "draftButton": "Enregistrer en brouillon",
  "draftSaved": "Brouillon enregistré",
  "successMessage": "Message envoyé",
  "required": "Champ requis",
  "missingRecipient": "Sélectionnez au moins un destinataire",
  "addRecipients": "Ajouter des destinataires",
  "closeWarning": "Souhaitez-vous fermer cette fenêtre ? (Vous perdrez son contenu)",
  "at": "Le ",
  "wrote": " a écrit :",
  "othersLabel": "et {nbOthers} autres"
}
</i18n>
