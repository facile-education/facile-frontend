<template>
  <div class="student">
    <span v-t="formattedStudent" />
    <div class="right-section">
      <PentilaCheckbox
        v-if="isCurrentTeacher"
        class="is-present-checkbox"
        label=""
        :model-value="student.isPresent"
        @update:modelValue="handleCheck"
      />
      <i
        class="fas fa-sign-out-alt"
        @click="isStudentDeregistrationModalDisplayed = true"
      />
    </div>

    <teleport
      v-if="isStudentDeregistrationModalDisplayed"
      to="body"
    >
      <StudentRegistrationModal
        :student="student"
        :event="event"
        :deregistration="true"
        @deregistre="deregistreStudent"
        @close="isStudentDeregistrationModalDisplayed = false"
      />
    </teleport>
  </div>
</template>

<script>
import StudentRegistrationModal from '@components/NotUsualSlotManager/StudentRegistrationModal/StudentRegistrationModal'
export default {
  name: 'StudentListItem',
  components: { StudentRegistrationModal },
  props: {
    student: {
      type: Object,
      required: true
    },
    event: {
      type: Object,
      required: true
    },
    isCurrentTeacher: {
      type: Boolean,
      default: true
    }
  },
  emits: ['deregistreStudent', 'update:isPresent'],
  data () {
    return {
      isStudentDeregistrationModalDisplayed: false
    }
  },
  computed: {
    formattedStudent () {
      return this.student.firstName + ' ' + this.student.lastName + ' ' + this.student.className
    }
  },
  created () {
    this.isPresent = this.student.isPresent
  },
  methods: {
    deregistreStudent () {
      this.$emit('deregistreStudent')
    },
    handleCheck (check) {
      this.$emit('update:isPresent', { student: this.student, isPresent: check })
    }
  }
}
</script>

<style scoped>
.student {
  display: flex;
}

.right-section {
  display: flex;
  margin-left: auto;
}

</style>
