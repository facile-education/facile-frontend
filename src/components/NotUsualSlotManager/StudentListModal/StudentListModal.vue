<template>
  <PentilaWindow
    :modal="true"
    class="student-list-modal"
    :class="{'mobile': mq.phone}"
    @close="closeModal"
    @keydown.exact.enter.stop=""
    @keydown.exact.backspace.stop=""
    @keydown.exact.delete.stop=""
    @keydown.exact.f2.stop=""
    @keydown.ctrl.stop=""
  >
    <template #header>
      <span v-t="'NotUsualSlots.StudentListModal.header'" />
    </template>

    <template #body>
      <div class="body">
        <div class="slot">
          <span>{{ formattedSlot }}</span>
        </div>
        <PentilaSpinner v-if="isLoading" />
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
            @update:isPresent="setPresent"
            @deregistreStudent="loadStudentList"
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
      <PentilaButton
        v-if="isRollCallable"
        :label="$t('NotUsualSlots.StudentListModal.callRollButton')"
        class="call-roll"
        @click="callRoll()"
      />
    </template>
  </PentilaWindow>
</template>

<script>

import schoolLifeService from '@/api/schoolLife-portlet.service'
import StudentListItem from '@components/NotUsualSlotManager/StudentListModal/StudentListItem'
import notUsualSlotsConstants from '@/constants/notUsualSlots'
import dayjs from 'dayjs'

export default {
  name: 'StudentListModal',
  components: { StudentListItem },
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
      isLoading: false
    }
  },
  computed: {
    slotType () {
      return notUsualSlotsConstants.getSlotTypeByNumber(this.event.extendedProps.type)
    },
    formattedSlot () {
      return this.slotType.label + ' ' + this.$t('Moment.of') + ' ' + dayjs(this.event.start).format('DD MMMM YYYY ' + this.$t('Moment.at') + ' HH:mm')
    },
    currentUser () {
      return this.$store.state.user
    },
    isCurrentTeacher () {
      return this.currentUser.userId === this.event.extendedProps.teacher.teacherId
    },
    isRollCallable () {
      return this.isCurrentTeacher &&
        !(this.slotType.type === notUsualSlotsConstants.firedType) &&
        !(this.slotType.type === notUsualSlotsConstants.tutoringType) &&
        dayjs().isAfter(dayjs(this.event.start))
    }
  },
  created () {
    this.loadStudentList()
  },
  methods: {
    loadStudentList () {
      this.isLoading = true
      schoolLifeService.getSessionMembers(this.event.extendedProps.id).then((data) => {
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
      const jsonStudentPresence = JSON.stringify(this.studentList)
      schoolLifeService.markStudentsPresent(this.event.extendedProps.id, jsonStudentPresence).then((data) => {
        if (data.success) {
          this.studentList = data.members
        }
      })
      this.$emit('close')
    },
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
  .student-list-modal .window-wrapper {
    max-width: 500px;
    &.mobile {
      width: 100%;
    }
  }
</style>

<style lang="scss" scoped>
  .student-list-modal {
    font-family: "Roboto", sans-serif;
    color: #0B3C5F;
  }

  .body{
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  h1 {
    font-size: 1.25em;
  }

  .slot {
    font-weight: bold;
    margin-top: 10px;
    margin-left: 20px;
  }

  .student-list {
    margin-top: 20px;
    padding-left: 35px;
    padding-right: 5px;

    .list-header {
      width: 100%;
      display: flex;

      .present-label {
        margin-left: auto;
        margin-right: 63px;
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
    font-size: 1em;
  }

  .call-roll {
    margin-right: 50px;
  }

</style>
