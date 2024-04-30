<template>
  <WeprodeWindow
    :modal="true"
    class="student-list-modal"
    data-test="student-list-modal"
    :full-screen="mq.phone || mq.tablet"
    :max-width="750"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'NotUsualSlots.StudentListModal.header'" />
    </template>

    <template #body>
      <div class="body">
        <div class="slot">
          <span>{{ formattedSlot }}</span>
        </div>
        <WeprodeSpinner v-if="isLoading" />
        <div
          v-else-if="studentList.length > 0"
          class="student-list"
        >
          <div class="list-header">
            <div
              v-if="isRollCallable"
              v-t="'NotUsualSlots.StudentListModal.present'"
              class="present-label"
            />
          </div>
          <StudentListItem
            v-for="(student, index) in studentList"
            :key="index"
            :student="student"
            :event="event"
            :is-current-teacher="isCurrentTeacher"
            @update:is-present="setPresent"
            @deregister-student="loadStudentList"
          />
        </div>
        <div
          v-else
          v-t="'NotUsualSlots.StudentListModal.noStudentPresent'"
          class="no-students-placeholder"
        />
      </div>
    </template>

    <template #footer>
      <WeprodeButton
        v-if="isRollCallable"
        :label="$t('NotUsualSlots.StudentListModal.callRollButton')"
        :disabled="isRollLoading"
        @click="callRoll()"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import StudentListItem from '@components/NotUsualSlotManager/StudentListModal/StudentListItem'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import offScheduleService from '@/api/offSchedule.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import notUsualSlotsConstants from '@/constants/notUsualSlots'

export default {
  name: 'StudentListModal',
  components: { WeprodeButton, StudentListItem, WeprodeSpinner, WeprodeWindow },
  inject: ['mq'],
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      studentList: [],
      isLoading: false,
      isRollLoading: false
    }
  },
  computed: {
    slotType () {
      return notUsualSlotsConstants.getSlotTypeByNumber(this.event.type)
    },
    formattedSlot () {
      return this.$t(this.slotType.i18nKey) + ' ' + this.$t('Moment.of') + ' ' + dayjs(this.event.startDate).format('DD MMMM YYYY ' + this.$t('Moment.at') + ' HH:mm')
    },
    currentUser () {
      return this.$store.state.user
    },
    isCurrentTeacher () {
      return this.event.teachers.map(teacher => teacher.teacherId).indexOf(this.currentUser.userId) !== -1
    },
    isRollCallable () {
      return this.isCurrentTeacher &&
        !(this.slotType.type === notUsualSlotsConstants.firedType) &&
        !(this.slotType.type === notUsualSlotsConstants.tutoringType) &&
        dayjs().isAfter(dayjs(this.event.startDate, DATE_EXCHANGE_FORMAT))
    }
  },
  created () {
    this.loadStudentList()
  },
  methods: {
    loadStudentList () {
      this.isLoading = true
      offScheduleService.getSessionMembers(this.event.sessionId).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.studentList = data.members
        }
      })
    },
    setPresent ({ student, isPresent }) { // Todo, not get currentStudent by event but directly from for method
      student.isPresent = isPresent
    },
    callRoll () {
      this.isRollLoading = true
      const jsonStudentPresence = JSON.stringify(this.studentList)
      offScheduleService.markStudentsPresent(this.event.sessionId, jsonStudentPresence).then((data) => {
        this.isRollLoading = false
        if (data.success) {
          this.studentList = data.members
          this.closeModal()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  .body {
    width: 100%;
    height: 100%;
  }

  .slot {
    font-weight: bold;
  }

  .student-list {
    margin-top: 20px;
    padding-left: 35px;

    .list-header {
      width: 100%;
      display: flex;

      .present-label {
        margin-left: auto;
        margin-right: 13px;
        font-size: 0.90em;
      }
    }
  }

  .no-students-placeholder {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
