<template>
  <WeprodeWindow
    class="status-entries-modal"
    :class="{'phone': mq.phone || mq.tablet}"
    :full-screen="mq.phone || mq.tablet"
    :modal="true"
    :draggable="true"
  >
    <template #header>
      <span
        v-t="$t('Logbook.statusModal.titleModal')"
      />
    </template>

    <template #body>
      <EntryStatusStudent
        v-for="(student, index) in allStudents"
        :key="index"
        :student="student"
        :is-authorization="entry.isAuthorization"
      />
      <WeprodeSpinner
        v-if="isLoading"
        style="z-index: 1"
      />
    </template>
    <template #footer>
      <div
        class="footer"
      >
        <WeprodeButton
          data-test="followup"
          :label="$t('Logbook.statusModal.followupSubmit')"
          :disabled="isLoading"
          @click="followup"
        />
      </div>
    </template>
  </WeprodeWindow>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'

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
  data () {
    return {
      isLoading: true,
      error: false,
      allStudents: undefined
    }
  },
  computed: {
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
    followup () {
      followupUnsigned(this.entry.logbookEntryId).then(data => {
        if (data.success) {
          this.error = false
        } else {
          this.error = true
        }
      }, (err) => {
        this.error = true
        console.error(err)
      })
    }
  }
}
</script>
