<template>
  <div class="container">
    <div class="signing-info">
      <div
        v-if="data.nbStudents === 1"
        class="one-student"
      >
        <h3>{{ isAuthorization ? $t('Logbook.entriesItem.authorization') : $t('Logbook.entriesItem.signing') }}</h3>
        <ul>
          <li
            v-for="parent in data.populations.students[0].parents"
            :key="parent.userId"
            :class="parent.hasSigned ? 'theme-text-color' : 'waiting'"
          >
            <span v-if="!parent.hasSigned">{{ $t('Logbook.entriesItem.waiting') }}</span>
            <span v-else-if="!isAuthorization">
              <CustomIcon icon-name="icon-check" />
            </span>
            <span v-else-if="parent.hasAuthorized">
              <CustomIcon icon-name="icon-check" />
            </span>
            <span v-else>
              <CustomIcon icon-name="icon-cross-s" />
            </span>
            {{ parent.lastName + ' ' + parent.firstName }}
          </li>
        </ul>
      </div>
      <div
        v-else
        class="multi-students"
      >
        <h3 :class="data.nbAuthorization && data.nbAuthorization === data.nbStudents && 'theme-text-color'">
          {{ nbSignedInfos }}
        </h3>
        <WeprodeButton
          v-if="data.isAllowedToReadStatus"
          :label="$t('Logbook.entriesItem.entryReadStatusButton')"
          @click="isDisplayStatusModal = true"
        />
      </div>
    </div>
    <div
      v-if="data.nbSignatures !== nbStudents"
      class="followup"
    >
      <WeprodeButton
        v-if="data.isAllowedToReadStatus"
        :label="$t('Logbook.entriesItem.followupButton')"
        @click="confirmFollowup"
      />
      <div
        v-if="data.reminders"
        class="reminders-infos"
      >
        <p>{{ $t('Logbook.totalReminders', {nbReminders: data.reminders.length}) }}</p>
        <p>{{ $t('Logbook.lastReminderDate', {reminderDate: lastRemindersDate}) }}</p>
      </div>
    </div>
  </div>
  <teleport to="body">
    <EntrySignatureStatusModal
      v-if="isDisplayStatusModal"
      :entry="data"
      @close="isDisplayStatusModal = false"
      @refresh="$emit('refresh')"
    />
  </teleport>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import dayjs from 'dayjs'

import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import EntrySignatureStatusModal from '@/components/Logbook/EntryStatusModal/EntryStatusModal.vue'
import logbookConstants from '@/constants/logbookConstants'

import { followupUnsigned } from '../../api/logbook.service'
export default {
  name: 'AgentSigningSection',
  components: {
    WeprodeButton,
    EntrySignatureStatusModal,
    CustomIcon
  },
  inject: ['mq'],
  props: {
    data: {
      type: Object,
      default: undefined
    },
    isStudentEntries: {
      type: Boolean,
      default: false
    }
  },
  emits: ['refresh'],
  data () {
    return {
      isDisplayStatusModal: false
    }
  },
  computed: {
    nbSignedInfos () {
      if (this.isAuthorization) {
        return this.$t('Logbook.entriesItem.agentNbAuthorizationInfos', { nbSigned: this.data.nbSignaturesCompleted, nbStudents: this.data.nbStudents })
      } else {
        return this.$t('Logbook.entriesItem.agentNbSignedInfos', { nbSigned: this.data.nbSignaturesCompleted, nbStudents: this.data.nbStudents })
      }
    },
    isAuthorization () {
      return this.data.type === logbookConstants.ENTRY_TYPE_AUTHORIZATION
    },
    lastRemindersDate () {
      return dayjs(this.data.reminders[this.data.reminders.length - 1].date).format('DD/MM/YYYY')
    }
  },
  methods: {
    confirmFollowup () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('Logbook.confirmReminderTextModal', { nbParents: this.data.nbNotifiedParents }),
        lastAction: { fct: this.followupParents }
      })
    },
    followupParents () {
      followupUnsigned(this.data.logbookEntryId).then(data => {
        if (data.success) {
          this.$emit('refresh')
        }
      }, err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.one-student,
.multi-students {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.multi-students button {
  background-color: transparent;
  color: $neutral-100;
  border: 1px solid $neutral-40 !important;
}

.followup {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.reminders-infos{
  text-align: center;
}

button {
  padding: 6px 12px !important;
  margin-bottom: 16px;
  @extend %font-regular-m;
}

h3 {
  @extend %font-medium-m;
  margin: 0;
  margin-bottom: 16px
}

p {
  @extend %font-regular-xs;
  margin: 0;
}

ul {
  padding: 0;
  margin: 0;
  margin-bottom: 16px;

  li {
    list-style: none;
    @extend %font-regular-s;
    text-align: center;

    &.waiting {
      color: $neutral-60;
    }

    &:first-child {
      margin-bottom: 8px;
    }
  }
}
</style>
