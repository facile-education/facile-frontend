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
      <StudentListItem
        v-for="(student, index) in studentList"
        :key="index"
        :student="student"
      />
    </template>

    <template #footer />
  </PentilaWindow>
</template>

<script>

import schoolLifeService from '@/api/schoolLife-portlet.service'
import StudentListItem from '@components/NotUsualSlotManager/StudentListModal/StudentListItem'

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
  created () {
    schoolLifeService.getSessionMembers(this.event.extendedProps.id).then((data) => {
      if (data.success) {
        this.studentList = data.members
      }
    },
    (err) => {
      console.log(err)
    })
  },
  methods: {
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
