<template>
  <PentilaWindow
    :modal="true"
    class="student-list-modal"
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
        <h1>{{ slotType.label }}</h1>
        <div class="slot">
          <span v-t="'NotUsualSlots.StudentListModal.slot'" />
          <span>{{ formattedSlot }}</span>
        </div>
        <div class="student-list">
          <div class="list-header">
            <div
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
      </div>
    </template>

    <template #footer />
  </PentilaWindow>
</template>

<script>

import schoolLifeService from '@/api/schoolLife-portlet.service'
import StudentListItem from '@components/NotUsualSlotManager/StudentListModal/StudentListItem'
import notUsualSlotsConstants from '@/constants/notUsualSlots'
import moment from 'moment'

export default {
  name: 'StudentListModal',
  components: { StudentListItem },
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      studentList: []
    }
  },
  computed: {
    slotType () {
      return notUsualSlotsConstants.getSlotTypeByNumber(this.event.extendedProps.type)
    },
    formattedSlot () {
      return moment(this.event.start, 'YYYY-MM-DDTHH:mm').format('DD/MM/YYYY ' + this.$t('Moment.at') + ' HH:mm')
    },
    currentUser () {
      return this.$store.state.user
    },
    isCurrentTeacher () {
      return this.currentUser.userId === this.event.extendedProps.teacher.teacherId
    }
  },
  created () {
    this.loadStudentList()
  },
  methods: {
    loadStudentList () {
      schoolLifeService.getSessionMembers(this.event.extendedProps.id).then((data) => {
        if (data.success) {
          this.studentList = data.members
        }
      },
      (err) => {
        console.log(err)
      })
    },
    markStudentPresents () {
      const jsonStudentPresence = JSON.stringify(this.studentList)
      schoolLifeService.markStudentsPresent(this.event.extendedProps.id, jsonStudentPresence).then((data) => {
        if (data.success) {
          this.studentList = data.members
        }
      },
      (err) => {
        console.log(err)
      })
    },
    setPresent ({ student, isPresent }) { // Todo, not get currentStudent by event but directly from for method
      student.isPresent = isPresent
    },
    closeModal () {
      if (this.isCurrentTeacher) {
        this.markStudentPresents()
      }
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
  .student-list-modal .window-body {
    overflow: auto;
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
  }

  .student-list {
    padding-left: 35px;
    padding-right: 5px;

    .list-header {
      width: 100%;
      display: flex;

      .present-label {
        margin-left: auto;
        margin-right: 33px;
        font-size: 0.90em;
      }
    }
  }
</style>
