<template>
  <div class="student">
    <span v-t="formattedStudent" />
    <div class="right-section">
      <PentilaCheckbox
        v-if="isCurrentTeacher"
        class="is-present-checkbox"
        label=""
        :title="$t('NotUsualSlots.StudentListModal.present')"
        :model-value="student.isPresent"
        @update:modelValue="handleCheck"
      />
      <i
        class="fas fa-sign-out-alt"
        :title="$t('NotUsualSlots.StudentListModal.unsubscribe')"
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
      return this.toPascalCase(this.student.firstName) + ' ' + this.toPascalCase(this.student.lastName) + ' - ' + this.student.className
    }
  },
  created () {
    this.isPresent = this.student.isPresent
  },
  methods: {
    toPascalCase (string) {
      return string.replace(/(\w)(\w*)/g,
        (g0, g1, g2) => { return g1.toUpperCase() + g2.toLowerCase() })
    },
    deregistreStudent () {
      this.$emit('deregistreStudent')
    },
    handleCheck (check) {
      this.$emit('update:isPresent', { student: this.student, isPresent: check })
    }
  }
}
</script>

<style lang="scss" scoped>
.student {
  display: flex;
  margin: 10px 0;
}

.right-section {
  display: flex;
  margin-left: auto;
}

.is-present-checkbox {
  margin-right: 30px;
}

.fa-sign-out-alt {
  cursor: pointer;
}

</style>
