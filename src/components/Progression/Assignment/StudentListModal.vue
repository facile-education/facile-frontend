<template>
  <PentilaWindow
    :modal="true"
    :draggable="true"
    :width="400"
    class="studentListWindow"
    :class="{ mobile: mq.phone }"
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
          :rb-value="true"
          :label="$t('whole-class')"
          class="radio"
        />

        <PentilaRadioButton
          v-model="isWholeClass"
          :rb-value="false"
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
            v-model="student.isSelected"
            :disabled="isWholeClass"
            :label="student.lastName + ' ' + student.firstName"
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
    students: {
      type: Array,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      isWholeClass: true
    }
  },
  computed: {
    sortedStudents () {
      return _.orderBy(this.students, 'lastName', 'asc')
    }
  },
  mounted () {
    for (let idx = 0; idx < this.students.length; ++idx) {
      if (this.students[idx].isSelected) {
        this.isWholeClass = false
      }
    }
  },
  methods: {
    closeModal () {
      this.$emit('close', this.students, this.isWholeClass)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";
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
