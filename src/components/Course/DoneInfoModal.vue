<template>
  <PentilaWindow
    :modal="true"
    :is-full-screen="mq.phone"
    :max-width="1000"
    data-test="doneInfoModal"
    :hidden-footer="true"
    @close="$emit('close')"
  >
    <template #header>
      <span v-if="studentList">{{ $tc('header', doneStudents.length, {n: doneStudents.length, totalCount: studentList.length}) }}</span>
    </template>

    <template #body>
      <div
        v-if="isLoading"
        class="placeholder"
      >
        <PentilaSpinner />
      </div>
      <div
        v-else-if="error === true"
        v-t="'errorPlaceholder'"
        class="placeholder"
      />
      <div
        v-else-if="studentList && studentList.length === 0"
        v-t="'emptyPlaceholder'"
        class="placeholder"
      />

      <ul
        v-else-if="studentList"
        :class="{'phone': mq.phone}"
      >
        <li
          v-for="student in sortedDoneStudents"
          :key="student.userId"
        >
          <InfoModalUser
            :user="student"
            field="isDone"
          />
        </li>
        <li
          v-for="student in sortedUndoneStudents"
          :key="student.userId"
        >
          <InfoModalUser
            :user="student"
            field="isDone"
          />
        </li>
      </ul>
    </template>
  </PentilaWindow>
</template>

<script>
import InfoModalUser from '@components/Dashboard/ReadInfos/InfoModalUser.vue'
import { getFullName } from '@utils/commons.util'
import PentilaUtils from 'pentila-utils'

import { getStudentsDoneStatus } from '@/api/homework.service'

export default {
  name: 'DoneInfoModal',
  components: { InfoModalUser },
  inject: ['mq'],
  props: {
    homework: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      studentList: undefined,
      isLoading: true,
      error: false
    }
  },
  computed: {
    doneStudents () {
      return this.studentList.filter(student => student.isDone === true)
    },
    undoneStudents () {
      return this.studentList.filter(student => student.isDone === undefined)
    },
    sortedDoneStudents () {
      return PentilaUtils.Array.sortWithString(this.doneStudents, false, 'fullName')
    },
    sortedUndoneStudents () {
      return PentilaUtils.Array.sortWithString(this.undoneStudents, false, 'fullName')
    }
  },
  created () {
    this.getStudentsDoneStatus()
  },
  methods: {
    getStudentsDoneStatus () {
      this.isLoading = true
      getStudentsDoneStatus(this.homework.homeworkId).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.studentList = data.selectedStudents
          // Add fullName field
          this.studentList.forEach(student => {
            student.fullName = getFullName(student)
          })
        }
      }, (err) => {
        this.isLoading = false
        this.error = true
        console.error(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.placeholder {
  position: relative;
  height: 100px;
  @extend %content-placeholder;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;

  li {
    border-bottom: 1px solid $color-border;

    &:last-child {
      border-bottom: none;
    }
  }
}

</style>

<i18n locale="fr">
{
  "header": "Fait par {n} élève sur {totalCount} | Fait par {n} élève sur {totalCount} | Fait par {n} élèves sur {totalCount}",
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "ce devoir n'a été distribué à aucun élève"
}
</i18n>