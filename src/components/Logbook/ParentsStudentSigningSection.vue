<template>
  <div
    v-if="isAllParentsRequired"
    class="two-parent-required"
    :class="mq.phone && 'mobile'"
  >
    <div
      v-for="(parent, index) in data.parents"
      :key="index"
      class="parent"
    >
      <div>
        <h3 v-if="!isAuthorization">
          {{ parent.userId === currentUser.userId ? $t('Logbook.entriesItem.yourSigningTitle', { signingType: $t('Logbook.entriesItem.signing') }) : $t('Logbook.entriesItem.signingParentTitle', { parentFullName: parent.lastName + ' ' + parent.firstName }) }}
        </h3>
        <h3 v-else>
          {{ parent.userId === currentUser.userId ? $t('Logbook.entriesItem.yourSigningTitle', { signingType: $t('Logbook.entriesItem.authorization') }) : $t('Logbook.entriesItem.authorizationParentTitle', { parentFullName: parent.lastName + ' ' + parent.firstName }) }}
        </h3>
        <div>
          <div v-if="isAuthorization">
            <p
              v-if="parent.hasSigned && parent.hasAuthorized"
              class="theme-text-color"
            >
              <span>
                <CustomIcon icon-name="icon-check" />
              </span>
              {{ parent.userId === currentUser.userId ? $t('Logbook.entriesItem.youAuthorized', { date: formateDate(parent.signatureDate) }) : $t('Logbook.entriesItem.hasAuthorized', { date: formateDate(parent.signatureDate) }) }}
            </p>
            <p
              v-if="parent.hasSigned && !parent.hasAuthorized"
              class="theme-text-color"
            >
              <span>
                <CustomIcon icon-name="icon-cross-s" />
              </span>
              {{ parent.userId === currentUser.userId ? $t('Logbook.entriesItem.youNotAuthorized') : $t('Logbook.entriesItem.hasNotAuthorized') }}
            </p>
            <div
              v-if="!parent.hasSigned && parent.userId === currentUser.userId"
              class="authorization-options"
              :class="mq.phone && 'mobile'"
            >
              <WeprodeButton
                :disabled="data.limitDate < currentDate"
                :label="$t('Logbook.entriesItem.authorizeButtonLabel')"
                data-test="authorize-button"
                :title="data.limitDate < currentDate && $t('Logbook.entriesItem.deadlinePassed')"
                @click="confirmAuthorize"
              />
              <WeprodeButton
                :disabled="data.limitDate < currentDate"
                :label="$t('Logbook.entriesItem.notAuthorizeButtonLabel')"
                data-test="not-authorize-button"
                :title="data.limitDate < currentDate && $t('Logbook.entriesItem.deadlinePassed')"
                @click="confirmNotAuthorize"
              />
            </div>
            <p v-if="!parent.hasSigned && !(parent.userId === currentUser.userId)">
              <span><CustomIcon
                icon-name="icon-warning"
                class="warning-icon"
              /></span>{{ $t('Logbook.entriesItem.waitingAuthorization') }}
            </p>
          </div>
          <div v-else>
            <p
              v-if="parent.hasSigned"
              class="theme-text-color"
            >
              <span>
                <CustomIcon icon-name="icon-check" />
              </span>
              {{ parent.userId === currentUser.userId ? $t('Logbook.entriesItem.youSigned', { signatureDate: formateDate(parent.signatureDate) }) : $t('Logbook.entriesItem.hasSigned', { signatureDate: formateDate(parent.signatureDate) }) }}
            </p>
            <WeprodeButton
              v-else-if="parent.userId === currentUser.userId"
              :disabled="data.limitDate < currentDate"
              :title="data.limitDate < currentDate && $t('Logbook.entriesItem.deadlinePassed')"
              :label="$t('Logbook.entriesItem.signButtonLabel')"
              data-test="signing-button"
              @click="confirmSigning"
            />
            <p v-else>
              <span><CustomIcon
                icon-name="icon-warning"
                class="warning-icon"
              /></span>{{ $t('Logbook.entriesItem.waitingSigning') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-else
    class="one-parent-required"
  >
    <h3>
      {{ isAuthorization ? $t('Logbook.entriesItem.oneAuthorizationRequiredTitle') : $t('Logbook.entriesItem.oneSignatureRequiredTitle') }}
    </h3>
    <div v-if="isAuthorization">
      <p
        v-if="isOneAuthorized"
        class="theme-text-color"
      >
        <span>
          <CustomIcon icon-name="icon-check" />
        </span>
        <span v-if="parentConnected.hasAuthorized">{{ $t('Logbook.entriesItem.youAuthorized', {
          date:
            formateDate(parentConnected.signatureDate)
        }) }}</span>
        <span v-else>{{ parentWhoAuthorize.lastName + ' ' + parentWhoAuthorize.firstName + ' ' +
          $t('Logbook.entriesItem.hasAuthorized', { date: formateDate(parentWhoAuthorize.signatureDate) }) }}</span>
      </p>
      <p
        v-if="isOneNotAuthorized"
        class="theme-text-color"
      >
        <span>
          <CustomIcon icon-name="icon-cross-s" />
        </span>
        <span v-if="!parentConnected.hasAuthorized && parentConnected.hasSigned">{{ $t('Logbook.entriesItem.youNotAuthorized', {
          date:
            formateDate(parentConnected.signatureDate)
        }) }}</span>
        <span v-else>{{ parentWhoSigned.lastName + ' ' + parentWhoSigned.firstName + ' ' +
          $t('Logbook.entriesItem.hasNotAuthorized', { date: formateDate(parentWhoSigned.signatureDate) }) }}</span>
      </p>
      <div
        v-if="!isOneParentSigned && !isStudent && isUserCanSigned"
        class="authorization-options"
        :class="mq.phone && 'mobile'"
      >
        <WeprodeButton
          :disabled="data.limitDate < currentDate"
          :label="$t('Logbook.entriesItem.authorizeButtonLabel')"
          data-test="authorize-button"
          :title="data.limitDate < currentDate && $t('Logbook.entriesItem.deadlinePassed')"
          @click="confirmAuthorize"
        />
        <WeprodeButton
          :disabled="data.limitDate < currentDate"
          :label="$t('Logbook.entriesItem.notAuthorizeButtonLabel')"
          data-test="not-authorize-button"
          :title="data.limitDate < currentDate && $t('Logbook.entriesItem.deadlinePassed')"
          @click="confirmNotAuthorize"
        />
      </div>
      <span v-else-if="!isUserCanSigned">
        <CustomIcon
          icon-name="icon-warning"
          class="warning-icon"
        />
        {{ $t('Logbook.entriesItem.waitingAuthorization') }}
      </span>
    </div>
    <div v-else>
      <p
        v-if="isOneParentSigned"
        class="theme-text-color"
      >
        <span>
          <CustomIcon icon-name="icon-check" />
        </span>
        <span v-if="parentConnected.hasSigned">{{ $t('Logbook.entriesItem.youSigned', {
          signatureDate:
            formateDate(parentConnected.signatureDate)
        }) }}</span>
        <span v-else>{{ parentWhoSigned.lastName + ' ' + parentWhoSigned.firstName + ' ' +
          $t('Logbook.entriesItem.hasSigned', { signatureDate: formateDate(parentWhoSigned.signatureDate) }) }}</span>
      </p>
      <WeprodeButton
        v-else-if="!isStudent && isUserCanSigned"
        :disabled="data.limitDate < currentDate"
        :title="data.limitDate < currentDate && $t('Logbook.entriesItem.deadlinePassed')"
        :label="$t('Logbook.entriesItem.signButtonLabel')"
        data-test="signing-button"
        @click="confirmSigning"
      />
      <span v-else-if="!isUserCanSigned || isStudent">
        <CustomIcon
          icon-name="icon-warning"
          class="warning-icon"
        />
        {{ isStudent ? $t('Logbook.entriesItem.waiting') : $t('Logbook.entriesItem.waitingOtherParent', {parentFullName: parentWhoCanSigned.lastName + ' ' + parentWhoCanSigned.firstName}) }}
      </span>
    </div>
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import logbookConstants from '@/constants/logbookConstants'

import { signLogbookEntry } from '../../api/logbook.service'
export default {
  name: 'ParentsStudentsSigningSection',
  components: {
    WeprodeButton,
    CustomIcon
  },
  inject: ['mq'],
  props: {
    data: {
      type: Object,
      default: undefined
    }
  },
  emits: ['signed'],
  data () {
    return {
      currentDate: dayjs().format(DATE_EXCHANGE_FORMAT),
      authorization: '',
      isDisplayEditModal: false,
      isDisplayStatusModal: false,
      hasAuthorized: false
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user
    },
    isStudent () {
      return this.$store.state.user.isStudent
    },
    parentConnected () {
      return this.data.parents.find((parent) => parent.userId === this.currentUser.userId)
    },
    parentWhoSigned () {
      return this.data.parents.find((parent) => parent.hasSigned)
    },
    parentWhoAuthorize () {
      return this.data.parents.find((parent) => parent.hasAuthorized)
    },
    isOneParentSigned () {
      return this.data.parents.some(parent => parent.hasSigned)
    },
    isOneAuthorized () {
      return this.data.parents.some(parent => parent.hasAuthorized && parent.hasSigned)
    },
    isOneNotAuthorized () {
      return this.data.parents.some(parent => !parent.hasAuthorized && parent.hasSigned)
    },
    isAuthorization () {
      return this.data.type === logbookConstants.ENTRY_TYPE_AUTHORIZATION
    },
    isAllParentsRequired () {
      return this.data.parents.every(parent => parent.isMandatory)
    },
    parentWhoCanSigned () {
      return this.data.parents.find(parent => parent.isMandatory)
    },
    isUserCanSigned () {
      if (this.data.parents.some(parent => parent.isMandatory) && !this.parentConnected.isMandatory) {
        return false
      } else if (this.data.parents.some(parent => parent.isMandatory) && this.parentConnected.isMandatory) {
        return true
      } else {
        return true
      }
    }
  },
  methods: {
    formateDate (date) {
      return dayjs(date).format('DD/MM/YY')
    },
    confirmSigning () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('Logbook.confirmSigningTextModal', {
          entryType: this.data.type === logbookConstants.ENTRY_TYPE_INFORMATION
            ? this.$t('Logbook.entriesItem.entryTypeInformation')
            : this.$t('Logbook.entriesItem.entryTypeObservation')
        }),
        lastAction: { fct: this.handleSignEntry }
      })
    },
    confirmAuthorize () {
      this.hasAuthorized = true
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('Logbook.confirmAuthorizationTextModal'),
        lastAction: { fct: this.handleSignEntry }
      })
    },
    confirmNotAuthorize () {
      this.hasAuthorized = false
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('Logbook.notConfirmAuthorizationTextModal'),
        lastAction: { fct: this.handleSignEntry }
      })
    },
    handleSignEntry () {
      signLogbookEntry(this.data.logbookEntryId, this.hasAuthorized).then(data => {
        this.$emit('signed')
        this.$store.dispatch('menu/updateLogbookNotification', 1)
      }, err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

.two-parent-required {
  display: flex;
  flex-direction: row;
  gap: 50px;

  &.mobile {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0;
  }

  .parent {
    flex: 1;
  }
}

.warning-icon{
  margin-right: 5px;
}

button {
    padding: 6px 12px !important;
    text-transform: uppercase;
    @extend %font-regular-m;
  }

h3 {
  @extend %font-medium-m;
  text-transform: uppercase;
}

p, span {
  @extend %font-regular-xs
}

.authorization-options {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.mobile {
    align-items: center;
  }

  button {
    width: fit-content;
  }
}
</style>
