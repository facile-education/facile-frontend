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
      <h1>{{ slotType.label }}</h1>
      <div class="slot">
        <span v-t="'NotUsualSlots.StudentListModal.slot'" />
        <span>{{ formattedSlot }}</span>
      </div>
      <StudentListItem
        v-for="(student, index) in studentList"
        :key="index"
        :student="student"
        :event="event"
        @deregistreStudent="loadStudentList"
      />
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
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

.student-list-modal {
  font-family: "Roboto", sans-serif;
  color: #0B3C5F;
}

</style>
