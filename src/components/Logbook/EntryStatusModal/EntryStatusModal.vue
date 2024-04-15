<template>
  <WeprodeWindow
    class="status-entries-modal"
    :class="{ 'phone': mq.phone || mq.tablet }"
    :full-screen="mq.phone || mq.tablet"
    :modal="true"
    :draggable="true"
  >
    <template #header>
      <span v-t="$t('Logbook.statusModal.titleModal')" />
    </template>

    <template #body>
      <div
        class="container"
        :class="{ 'phone': mq.phone || mq.tablet }"
      >
        <div class="students-list">
          <EntryStatusStudent
            v-for="(student, index) in sortedStudents"
            :key="index"
            :student="student"
            :is-authorization="entry.isAuthorization"
          />
        </div>
        <div
          class="followup"
        >
          <WeprodeButton
            v-if="entry.isAllowedToReadStatus"
            :label="$t('Logbook.entriesItem.followupButton')"
            @click="confirmFollowup"
          />
          <div
            v-if="entry.reminders"
            class="reminders-infos"
          >
            <p>{{ 'Relancé déjà' + ' ' + entry.reminders.length + ' ' + 'fois' }}</p>
            <p>{{ 'Dernière relance le' + ' ' + lastRemindersDate }}</p>
          </div>
        </div>
        <WeprodeSpinner
          v-if="isLoading"
          style="z-index: 1"
        />
      </div>
    </template>
  </WeprodeWindow>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import dayjs from 'dayjs'
import _ from 'lodash'

import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import EntryStatusStudent from '@/components/Logbook/EntryStatusModal/EntryStatusStudent'

import { followupUnsigned, getEntryReadStatus } from '../../../api/logbook.service'

export default {
  name: 'EntriesEditModal',
  components: {
    WeprodeWindow,
    EntryStatusStudent,
    WeprodeButton,
    WeprodeSpinner
  },
  inject: ['mq'],
  props: {
    entry: {
      type: Object,
      default: undefined
    }
  },
  emits: ['refresh'],
  data () {
    return {
      isLoading: true,
      error: false,
      allStudents: undefined
    }
  },
  computed: {
    sortedStudents () {
      return _.orderBy(this.allStudents, 'lastName', 'asc')
    },
    lastRemindersDate () {
      return dayjs(this.entry.reminders[this.entry.reminders.length - 1].date).format('DD/MM/YYYY')
    }
  },
  created () {
    getEntryReadStatus(this.entry.logbookEntryId).then(data => {
      if (data.success) {
        this.isLoading = false
        this.error = false
        this.allStudents = data.readStatus
      } else {
        this.error = true
      }
    }, (err) => {
      this.error = true
      console.error(err)
    })
  },
  methods: {
    confirmFollowup () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('Logbook.confirmReminderTextModal', { nbParents: this.entry.nbNotifiedParents }),
        lastAction: { fct: this.followupParents }
      })
    },
    followupParents () {
      followupUnsigned(this.entry.logbookEntryId).then(data => {
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
  max-height: 70vh;

  &.phone {
    max-height: 100%;
  }
}

.students-list {
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
}

.followup {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24px;
}

.reminders-infos{
  text-align: center;
}

button {
  padding: 10px 72px !important;
  margin-bottom: 16px;
  @extend %font-regular-l;
}

p {
  @extend %font-regular-xs;
  margin: 0;
}
</style>
