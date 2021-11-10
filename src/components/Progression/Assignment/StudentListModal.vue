<template>
  <PentilaWindow
    :modal="true"
    win-width="400px"
    class="studentListWindow"
    :class="{ mobile: mq.phone }"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'title'" />
    </template>

    <template #body>
      <div
        class="whole-class"
      >
        <input
          id="wholeClass"
          v-model="isWholeClass"
          type="radio"
          :value="true"
        >
        {{ $t('whole-class') }}
      </div>

      <div
        class="specific"
      >
        <input
          id="specific"
          v-model="isWholeClass"
          type="radio"
          :value="false"
        >
        {{ $t('specific') }}
      </div>

      <div
        v-for="student in sortedStudents"
        :key="student.userId"
        class="student"
      >
        <input
          v-model="student.isSelected"
          :disabled="isWholeClass"
          type="checkbox"
          label=""
        >
        {{ student.fullName }}
      </div>
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
        console.log('mounted modal : 1 stuednt is selected -> not whole class')
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
.studentListWindow {
  .whole-class {
    margin-right: 20px;
  }
  .specific {
    margin-bottom: 20px;
  }
  input {
    margin-right: 5px;
  }
  span {
    text-align: center;
    margin: 10px;
  }
}

.footer {
  display: flex;
  justify-content: space-around;
  .button {
    width: 150px;
  }
}
</style>

<i18n locale="fr">
{
  "title": "Elèves destinataires",
  "whole-class": "Toute la classe",
  "specific": "Spécifique",
  "save": "Enregistrer"
}
</i18n>
