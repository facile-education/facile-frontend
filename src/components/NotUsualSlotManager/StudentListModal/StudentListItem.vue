<template>
  <div class="student">
    <span v-t="formattedStudent" />
    <PentilaCheckbox
      class="is-present-checkbox"
      label=""
      :model-value="isPresent"
      @update:modelValue="handleCheck"
    />
    <div @click="isStudentDeregistrationModalDisplayed = true">
      <i
        class="fas fa-sign-out-alt"
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
    }
  },
  emits: ['deregistreStudent'],
  data () {
    return {
      isPresent: false,
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
      if (check) {
        // mark as present
      } else {
        // mark as absent
      }
      this.notifyParents = check
    }
  }
}
</script>

<style scoped>
.student {
  display: flex;
}

.is-present-checkbox {
  margin-left: auto;
}

</style>
