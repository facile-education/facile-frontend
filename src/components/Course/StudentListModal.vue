<template>
  <PentilaWindow
    :modal="true"
    :draggable="true"
    :width="400"
    class="studentListWindow"
    :full-screen="mq.phone || mq.tablet"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'title'" />
    </template>

    <template #body>
      <div
        class="class-selector"
      >
        <PentilaRadioButton
          v-model="isWholeClass"
          rb-value="true"
          :label="$t('whole-class')"
          class="radio"
        />

        <PentilaRadioButton
          v-model="isWholeClass"
          rb-value="false"
          :label="$t('specific')"
          class="radio"
        />
      </div>

      <div
        v-if="sortedStudents.length === 0 && !isWholeClass"
        v-t="'errorPlaceholder'"
        class="placeholder"
      />
      <ul v-else>
        <li
          v-for="student in sortedStudents"
          :key="student.userId"
          class="student"
        >
          <PentilaCheckbox
            :model-value="isSelected(student)"
            :disabled="isWholeClass==='true'"
            :label="student.lastName + ' ' + student.firstName"
            @update:model-value="changeStudentStatus(student, $event)"
          />
        </li>
      </ul>
      <div />
    </template>

    <template #footer>
      <div class="footer">
        <PentilaButton
          :label="$t('save')"
          class="button"
          @click="closeModal"
        />
      </div>
    </template>
  </PentilaWindow>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'StudentListModal',
  inject: ['mq'],
  props: {
    studentList: {
      type: Array,
      required: true
    },
    initialState: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close'],
  data () {
    return {
      isWholeClass: 'true',
      selectedStudents: []
    }
  },
  computed: {
    sortedStudents () {
      return _.orderBy(this.studentList, 'lastName', 'asc')
    }
  },
  created () {
    if (this.initialState) {
      this.isWholeClass = this.initialState.isWholeClass ? 'true' : 'false'
      this.selectedStudents = this.initialState.selectedStudents
    }
  },
  methods: {
    isSelected (student) {
      return this.selectedStudents.map(student => student.userId).indexOf(student.userId) !== -1
    },
    changeStudentStatus (student, selectedValue) {
      if (selectedValue) {
        this.selectedStudents.push(student)
      } else {
        const index = this.selectedStudents.map(student => student.userId).indexOf(student.userId)
        if (index !== -1) {
          this.selectedStudents.splice(index, 1)
        } else {
          console.error('Cannot unselect student ', student)
        }
      }
    },
    closeModal () {
      this.$emit('close', this.isWholeClass === 'true', this.selectedStudents)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../design/index";
ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.class-selector {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  margin-bottom: 1rem;
}

.placeholder {
  @extend %content-placeholder;
}

input {
  margin-right: 5px;
}

span {
  text-align: center;
  margin: 10px;
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "title": "Elèves destinataires",
  "whole-class": "Toute la classe",
  "specific": "Spécifique",
  "save": "Enregistrer"
}
</i18n>
