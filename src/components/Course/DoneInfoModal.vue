<template>
  <WeprodeWindow
    :modal="true"
    :full-screen="mq.phone || mq.tablet"
    :max-width="1000"
    data-test="doneInfoModal"
    :hidden-footer="true"
    @close="$emit('close')"
  >
    <template #header>
      <span v-if="studentList">{{ $tc('Course.DoneInfoModal.header', doneStudents.length, {n: doneStudents.length, totalCount: studentList.length}) }}</span>
    </template>

    <template #body>
      <div
        v-if="isLoading"
        class="placeholder"
      >
        <WeprodeSpinner />
      </div>
      <div
        v-else-if="error === true"
        v-t="'Course.DoneInfoModal.errorPlaceholder'"
        class="placeholder"
      />
      <div
        v-else-if="studentList && studentList.length === 0"
        v-t="'Course.DoneInfoModal.emptyPlaceholder'"
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
  </WeprodeWindow>
</template>

<script>
import InfoModalUser from '@components/Dashboard/ReadInfos/InfoModalUser.vue'
import { getFullName } from '@utils/commons.util'
import WeprodeUtils from '@utils/weprode.utils'

import { getStudentsDoneStatus } from '@/api/homework.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'DoneInfoModal',
  components: { InfoModalUser, WeprodeSpinner, WeprodeWindow },
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
      return WeprodeUtils.sortArrayWithString(this.doneStudents, false, 'fullName')
    },
    sortedUndoneStudents () {
      return WeprodeUtils.sortArrayWithString(this.undoneStudents, false, 'fullName')
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
