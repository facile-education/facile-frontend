<template>
  <div class="entries-list-item theme-border-color">
    <header>
      <h2>{{ data.title }}</h2>
      <div class="publication-infos">
        <p>{{ publicationDate }}</p>
        <a
          href="#"
          style="color: black;"
          class="toggle-user-card"
          @click.stop="openUserCardModal(data.author)"
        >
          {{ data.author.userName }}
        </a>
      </div>
    </header>
    <p
      class="content"
      v-html="data.content"
    />
    <div
      v-if="isTeacher || isDirector || isSecretariat"
      class="bottomAdmin"
    >
      <p
        class="read-infos"
        :class="data.isAllowedToReadStatus && 'clickable'"
        @click="isDisplayStatusModal = true"
      >
        {{ nbSignedInfos }}
      </p>
    </div>
    <div
      class="entry-options"
    >
      <button
        v-if="data.nbSignatures === 0 && data.isEditable"
        class="option"
        :aria-label="'Modifier'"
        :title="$t('Logbook.entriesItem.editButtonLabel')"
        data-test="buttonUpdateEntry"
        @click="isDisplayEditModal = true"
        @keyup.stop
      >
        <CustomIcon
          class="icon"
          icon-name="icon-edit"
        />
      </button>
      <button
        v-if="data.isDeletable"
        class="option"
        :aria-label="'Supprimer'"
        :title="$t('Logbook.entriesItem.deleteButtonLabel')"
        data-test="buttonDeleteEntry"
        @click.stop="confirmDeleteEntry"
        @keyup.stop
      >
        <CustomIcon
          class="icon"
          icon-name="icon-trash"
        />
      </button>
    </div>
    <div
      v-if="isParent || isStudent"
      class="bottom"
    >
      <p class="entry-type">
        {{ entryType }}
      </p>
      <ul class="parent-status">
        <li
          v-for="(parent, index) in data.parents"
          :key="index"
        >
          <a
            href="#"
            style="color: black;"
            class="toggle-user-card"
            @click.stop="openUserCardModal(parent)"
          >
            {{ parent.firstName + ' ' + parent.lastName }}
          </a>
          <div v-if="isParent && !data.isAuthorization">
            <p
              v-if="parent.hasSigned"
              class="theme-text-color"
            >
              {{ parent.userId === currentUser.userId ? $t('Logbook.entriesItem.youSigned', {signatureDate: formateDate(parent.signatureDate)}) : $t('Logbook.entriesItem.hasSigned', {signatureDate: formateDate(parent.signatureDate)}) }}
            </p>
            <WeprodeButton
              v-else-if="parent.userId === currentUser.userId"
              :disabled="data.limitDate < currentDate"
              :title="data.limitDate < currentDate && $t('Logbook.entriesItem.deadlinePassed')"
              :label="$t('Logbook.entriesItem.signButtonLabel')"
              @click="handleSignEntry(data.logbookEntryId, data.isAuthorization)"
            />
            <p v-else>
              {{ $t('Logbook.entriesItem.waitingSigning') }}
            </p>
          </div>
          <div v-if="isParent && data.isAuthorization">
            <p
              v-if="parent.hasSigned && parent.hasAuthorized"
              :class="{'theme-text-color':parent.userId === currentUser.userId}"
            >
              {{ parent.userId === currentUser.userId ? $t('Logbook.entriesItem.youAuthorized', {date: formateDate(parent.signatureDate)}) : $t('Logbook.entriesItem.hasAuthorized', {date: formateDate(parent.signatureDate)}) }}
            </p>
            <p
              v-if="parent.hasSigned && !parent.hasAuthorized"
              :class="{'theme-text-color':parent.userId === currentUser.userId}"
            >
              {{ parent.userId === currentUser.userId ? $t('Logbook.entriesItem.youNotAuthorized') : $t('Logbook.entriesItem.hasNotAuthorized') }}
            </p>
            <p v-if="!parent.hasSigned && parent.userId != currentUser.userId">
              {{ $t('Logbook.entriesItem.waitingAuthorization') }}
            </p>
            <div
              v-if="parent.userId === currentUser.userId && !parent.hasSigned"
              class="authorization-options"
            >
              <WeprodeButton
                :disabled="data.limitDate < currentDate"
                :label="$t('Logbook.entriesItem.authorizeButtonLabel')"
                @click="handleSignEntry(data.logbookEntryId, true)"
              />
              <WeprodeButton
                :disabled="data.limitDate < currentDate"
                :label="$t('Logbook.entriesItem.notAuthorizeButtonLabel')"
                @click="handleSignEntry(data.logbookEntryId, false)"
              />
            </div>
          </div>
          <div v-if="isStudent">
            <p v-if="parent.hasSigned && !data.isAuthorization">
              {{ $t('Logbook.entriesItem.hasSigned', {signatureDate: formateDate(parent.signatureDate)}) }}
            </p>
            <p v-if="parent.hasSigned && parent.hasAuthorized">
              {{ $t('Logbook.entriesItem.hasAuthorized', {date: formateDate(parent.signatureDate)}) }}
            </p>
            <p v-if="!parent.hasSigned && !data.isAuthorization">
              {{ $t('Logbook.entriesItem.waitingSigning') }}
            </p>
            <p v-if="!parent.hasSigned && !parent.hasAuthorized && data.isAuthorization">
              {{ $t('Logbook.entriesItem.waitingAuthorization') }}
            </p>
            <p v-if="parent.hasSigned && !parent.hasAuthorized && data.isAuthorization">
              {{ $t('Logbook.entriesItem.hasNotAuthorized') }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <teleport to="body">
    <EntriesEditModal
      v-if="isDisplayEditModal"
      :init-entry="data"
      @close="isDisplayEditModal = false"
      @entry-edited="$emit('entryEdited')"
    />
  </teleport>
  <teleport to="body">
    <EntrySignatureStatusModal
      v-if="isDisplayStatusModal"
      :entry="data"
      @close="isDisplayStatusModal = false"
    />
  </teleport>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'

import { deleteEntry, signLogbookEntry } from '../../api/logbook.service'
import EntriesEditModal from '../../components/Logbook/EntriesEditModal.vue'
import EntrySignatureStatusModal from '../../components/Logbook/EntryStatusModal/EntryStatusModal.vue'
export default {
  name: 'EntriesListItem',
  components: {
    WeprodeButton,
    CustomIcon,
    EntriesEditModal,
    EntrySignatureStatusModal
  },
  props: {
    data: {
      type: Object,
      default: undefined
    }
  },
  emits: ['deleteEntry', 'signed', 'entryEdited'],
  data () {
    return {
      currentDate: dayjs().format(DATE_EXCHANGE_FORMAT),
      authorization: '',
      isDisplayEditModal: false,
      isDisplayStatusModal: false
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user
    },
    isTeacher () {
      return this.$store.state.user.isTeacher
    },
    isDirector () {
      return this.$store.state.user.isDirectionMember
    },
    isSecretariat () {
      return this.$store.state.user.isSecretariat
    },
    isParent () {
      return this.$store.state.user.isParent
    },
    isStudent () {
      return this.$store.state.user.isStudent
    },
    publicationDate () {
      return this.$t('Logbook.entriesItem.entryPublicationDate', { date: this.formateDate(this.data.modificationDate) })
    },
    nbSignedInfos () {
      if (this.data.isAuthorization) {
        return this.$t('Logbook.entriesItem.agentNbAuthorizationInfos', { nbSigned: this.data.nbSignatures, nbStudents: this.data.nbSignaturesNeeded })
      } else {
        return this.$t('Logbook.entriesItem.agentNbSignedInfos', { nbSigned: this.data.nbSignatures, nbStudents: this.data.nbSignaturesNeeded })
      }
    },
    entryType () {
      if (this.data.isAuthorization) {
        return this.$t('Logbook.entriesItem.authorization')
      } else {
        return this.$t('Logbook.entriesItem.signing')
      }
    }
  },
  methods: {
    formateDate (date) {
      return dayjs(date).format('DD/MM/YY')
    },
    handleSignEntry (entryId, hasAuthorized) {
      signLogbookEntry(entryId, hasAuthorized).then(data => {
        this.$emit('signed')
      }, err => {
        console.log(err)
      })
    },
    confirmDeleteEntry () {
      this.$store.dispatch('warningModal/addWarning', {
        text: 'Voulez vous vraiment supprimer ce mot ?',
        lastAction: { fct: this.deleteEntry }
      })
    },
    deleteEntry () {
      deleteEntry(this.data.logbookEntryId).then((data) => {
        if (data.success) {
          this.$emit('deleteEntry')
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    openUserCardModal (user) {
      this.$store.dispatch('userCard/initUserCard', user)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';
.entries-list-item{
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: solid 1px;
  padding: 10px;
  border-radius: 10px;
  min-height: 150px;
    header{
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      h2{
        margin: 0;
        @extend %font-heading-xs;
      }
      .publication-infos{
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        a, p{
          margin: 0;
          @extend %font-regular-s
        }
      }
    }
    .content{
      margin: 0;
      @extend %font-regular-m;
    }
    .clickable{
      cursor: pointer;
      align-self: flex-end;
      margin-bottom: 0;
      text-decoration: underline
    }
    .entry-type{
      @extend %font-bold-l;
    }
    .bottom{
      border-top: solid 1px;
      .parent-status{
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
        li{
          display: flex;
          justify-content: space-between;
          align-items: center;
          list-style: none;
          @extend %font-regular-m;
          p{
            margin: 0;
            @extend %font-regular-m;
          }
          button{
            padding: 5px 10px;
            @extend %font-regular-m;
          }
        }
      }
    }
    .bottomAdmin{
      position: relative;
    }
    .authorization-options{
      display: flex;
      gap: 10px;
      button{
        padding: 10px;
      }
    }
    .entry-options{
      position: absolute;
      bottom: 10px;
      right: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      button{
        cursor: pointer;
        border: none;
      }
    }
}
</style>./EntryStatusModal/EntrySignatureStatusModal.vue
