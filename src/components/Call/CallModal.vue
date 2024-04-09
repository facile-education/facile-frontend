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
      <h1>
        {{ $t('Call.callModalHeader') }}
      </h1>
    </template>

    <template #body>
      <WeprodeSpinner v-if="isLoading" />
      <div
        v-if="error"
        v-t="'Call.errorPlaceholder'"
        class="placeholder"
      />
      <component
        :is="mq.phone ? 'VFragment' : 'table'"
        v-else-if="call"
        :aria-describedby="!mq.phone ? 'Call table' : undefined"
      >
        <thead v-if="!mq.phone">
          <tr>
            <th scope="col" />
            <th scope="col">
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
              {{ $t('Call.comments') }}
            </th>
          </tr>
        </thead>

        <component :is="mq.phone ? 'ul' : 'tbody'">
          <CallStudentRow
            v-for="student in sortedStudents"
            :key="student.userId"
            :student="student"
            :is-in-edition="canEditCall"
            @update-student="updateStudent(student, $event)"
          />
        </component>
      </component>
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
import CallStudentRow from '@components/Call/CallStudentRow.vue'
import WeprodeUtils from '@utils/weprode.utils.js'

import { doCall, getCallDetails } from '@/api/call.service.js'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
export default {
  name: 'CallModal',
  components: {
    VFragment,
    WeprodeSpinner,
    WeprodeWindow,
    CallModalFooter,
    CallStudentRow
  },
  inject: ['mq'],
  props: {
    sessionId: {
      type: Number,
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
      getCallDetails(this.sessionId).then(data => {
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
      doCall(this.sessionId, this.call.students).then(data => {
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

<style scoped lang="scss">
@import "@design";
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
  font-size: 0.8rem;
  letter-spacing: 1px;
  width: 100%;
}

th {
  @extend %font-regular-s;
}

</style>
