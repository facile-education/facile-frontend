<template>
  <WeprodeWindow
    :modal="true"
    :full-screen="mq.phone || mq.tablet"
    :draggable="true"
    data-test="callModal"
    class="callModal"
    @close="confirmClosure"
  >
    <template #header>
      <header>
        <h1>
          {{ $t('Call.callModalHeader') }}
        </h1>
        <CallStatus
          v-if="call"
          :is-editable="canEditCall"
          :call="call"
        />
      </header>
    </template>

    <template #body>
      <WeprodeSpinner v-if="isLoading" />
      <div
        v-if="error"
        v-t="'Call.errorPlaceholder'"
        class="placeholder"
      />
      <div v-else-if="call">
        <CallSessionHeader
          :call="call"
          :session="session"
        />

        <component
          :is="mq.phone ? 'VFragment' : 'table'"
          :aria-describedby="!mq.phone ? 'Call table' : undefined"
        >
          <thead v-if="!mq.phone">
            <tr>
              <th scope="col" />
              <th
                scope="col"
                class="presence"
              >
                {{ $t('Call.presence') }}
              </th>
              <th scope="col">
                <div class="call-separator" />
              </th>

              <th scope="col">
                {{ $t('Call.late') }}
              </th>
              <th scope="col">
                {{ $t('Call.firing') }}
              </th>
              <th scope="col">
                {{ $t('Call.infirmary') }}
              </th>
              <th scope="col">
                {{ $t('Call.comment') }}
              </th>
            </tr>
          </thead>

          <component :is="mq.phone ? 'ul' : 'tbody'">
            <CallStudent
              v-for="student in sortedStudents"
              :key="student.userId"
              :student="student"
              :session="session"
              :is-in-edition="canEditCall"
              :is-done="call.callDate !== undefined"
              @update-student="updateStudent(student, $event)"
            />
          </component>
        </component>
      </div>
    </template>
    <template #footer>
      <CallModalFooter
        v-if="!isLoading && !error && call"
        :call="call"
        :can-edit-call="canEditCall"
        @do-call="doCall"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import VFragment from '@components/Base/VFragment.vue'
import WeprodeSpinner from '@components/Base/Weprode/WeprodeSpinner.vue'
import CallModalFooter from '@components/Call/CallModalFooter.vue'
import CallSessionHeader from '@components/Call/CallSessionHeader.vue'
import CallStatus from '@components/Call/CallStatus.vue'
import CallStudent from '@components/Call/CallStudent.vue'
import WeprodeUtils from '@utils/weprode.utils.js'

import { doCall, getCallDetails } from '@/api/call.service.js'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
export default {
  name: 'CallModal',
  components: {
    CallStatus,
    CallSessionHeader,
    VFragment,
    WeprodeSpinner,
    WeprodeWindow,
    CallModalFooter,
    CallStudent
  },
  inject: ['mq'],
  props: {
    session: {
      type: Object,
      required: true
    },
    canEditCall: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  data () {
    return {
      isLoading: false,
      error: undefined,
      call: undefined,
      isSubmit: false,
      callInfos: [],
      initialForm: undefined
    }
  },
  computed: {
    sortedStudents () {
      return WeprodeUtils.sortArrayWithString(this.call.students, false, 'lastName')
    }
  },
  created () {
    this.getCallDetails()
  },
  methods: {
    updateStudent (student, event) {
      student.isFired = event.isFired
      const index = this.call.students.map(student => student.userId).indexOf(event.userId)
      if (index !== -1) {
        this.call.students[index] = event
      }
    },
    confirmClosure () {
      if (JSON.stringify(this.call.students) !== this.initialForm) {
        this.$store.dispatch('warningModal/addWarning', {
          text: this.$t('Call.confirmClosure'),
          lastAction: { fct: this.onClose }
        })
      } else {
        this.onClose()
      }
    },
    getCallDetails () {
      this.isLoading = true
      getCallDetails(this.session.sessionId).then(data => {
        this.isLoading = false
        if (data.success) {
          this.error = undefined
          this.call = data.call
          this.formatStudents()
          this.initialForm = JSON.stringify(this.call.students)
        } else {
          this.error = true
          console.error('Error while fetching call')
        }
      }, (err) => {
        this.isLoading = false
        this.error = err
        console.error(err)
      })
    },
    doCall () {
      this.isLoading = true
      this.formatStudents()
      doCall(this.session.sessionId, this.call.students).then(data => {
        this.isLoading = false
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Call.callSaved'), type: 'success' })

          this.getCallDetails()
          // this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
          console.error('Error while doing call')
        }
      }, (err) => {
        this.isLoading = false
        this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        console.error(err)
      })
    },
    formatStudents () { // Prevent to have undefined fields in form and force booleans for backend
      this.call.students.forEach(student => {
        student.isAbsent = !!student.isAbsent
        student.isFired = !!student.isFired
        student.isLate = !!student.isLate
        student.lateDuration = student.delay?.lateDuration
        student.isMedical = !!student.isMedical
        if (!student.comment) {
          student.comment = ''
        }

        // To simulate data
        // student.isExpectedAbsent = student.isAbsent = Math.random() < 0.3
        // student.isAbsentOnPreviousSession = Math.random() < 0.3
        // student.memo = Math.random() < 0.2 ? 'Dislexique' : ''
        // student.nbUnjustified = Math.random() < 0.3 ? (Math.random() < 0.5 ? 2 : 1) : 0
      })
    },
    onClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.callModal {
  .window-body {
    min-height: 3.5rem;
    position: relative;
  }
}
</style>

<style lang="scss" scoped>
@import "@design";

header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

h1{
  margin: 0;
  @extend %font-heading-s;
  text-transform: uppercase;
}

.placeholder {
  @extend %content-placeholder;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th {
  @extend %font-regular-s;

  &:last-child {
    padding-left: 0.75rem;
    text-align: left;
  }
}

th.presence {
  padding: 0 1rem;
}

</style>
