<template>
  <WeprodeWindow
    :modal="true"
    :draggable="true"
    :full-screen="mq.phone || mq.tablet"
    :class="{'session-teacher': mq.phone}"
    class="session-teacher-modal"
    data-test="sessionTeacherModal"
    @close="closeModal"
  >
    <template #header>
      <span v-t="{ path: 'Horaires.SessionTeacherModal.teacherManagement', args: { course: sessionEvent.groupName }}" />
    </template>

    <template #body>
      <div id="teacherform">
        <p v-t="{ path: 'Horaires.SessionTeacherModal.firstSession', args: { date: sessionDate, start: sessionStart, end: sessionEnd }}" />
        <ul>
          <li
            v-for="teacher in teacherList"
            :key="teacher.id"
            class="teacher"
          >
            <div class="name">
              <span>
                <a
                  href="#"
                  class="toggle-user-card"
                  style="color: black;"
                  @click.stop="openUserCardModal(teacher)"
                >
                  <b>{{ `${teacher.firstName.substring(0, 1)}. ${teacher.lastName} ` }}</b>
                </a>{{ $t('Horaires.SessionTeacherModal.substitutedBy') }}
              </span>
              <UserCompletion
                v-model="teacher.substitutes"
                style="display: inline-block;"
                user-type="teacher"
                :placeholder="$t('Horaires.SessionTeacherModal.substitute')"
              />
            <!-- @blur="v$.newEvent.extendedProps.teacher.teacherId.$touch()" -->
            </div>
            <WeprodeCheckbox
              v-model="teacher.allSlots"
              :label="$t('Horaires.SessionTeacherModal.allSessions', {course: sessionEvent.groupName})"
              :disabled="teacher.substitutes.length === 0"
              class="all-slots"
              @update:model-value="filterSessionList(teacher)"
            />
            <div>
              <span v-t="'Horaires.SessionTeacherModal.lastSession'" />
              <WeprodeDropdown
                v-if="teacher.filteredSessions.length > 0"
                v-model="teacher.targetSession"
                :list="teacher.filteredSessions"
                display-field="displayDate"
                :sort="false"
                :disabled="teacher.substitutes.length === 0"
              />
            </div>
          </li>
        </ul>
      </div>
    </template>

    <template #footer>
      <!-- form="teacherform" -->
      <WeprodeButton
        :label="$t('Horaires.SessionTeacherModal.confirm')"
        @click="onConfirm"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import { getSessionTeachersAndSubstitutes, saveTeacherSubstitutes } from '@/api/schedule.service'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeCheckbox from '@/components/Base/Weprode/WeprodeCheckbox.vue'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import UserCompletion from '@/components/NotUsualSlotManager/UserCompletion'

export default {
  name: 'SessionTeacherModal',
  components: { UserCompletion, WeprodeButton, WeprodeCheckbox, WeprodeDropdown, WeprodeWindow },
  inject: ['mq'],
  props: {
    sessionEvent: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      replaceSlotOnly: false,
      teacherList: []
    }
  },
  computed: {
    sessionDate () {
      return dayjs(this.sessionEvent.startDate, DATE_EXCHANGE_FORMAT).format('DD/MM/YYYY')
    },
    sessionEnd () {
      return dayjs(this.sessionEvent.endDate, DATE_EXCHANGE_FORMAT).format('HH:mm')
    },
    sessionStart () {
      return dayjs(this.sessionEvent.startDate, DATE_EXCHANGE_FORMAT).format('HH:mm')
    }
  },
  created () {
    // Get teacher list from backend.
    this.teacherList.length = 0
    getSessionTeachersAndSubstitutes(this.sessionEvent.sessionId).then(
      (data) => {
        if (data.success) {
          data.teachers.forEach((teacher) => {
            this.filterSessionList(teacher)
            teacher.substitutes = (teacher.substitute) ? [teacher.substitute] : []

            teacher.nextSessions.forEach((session) => {
              session.displayDate = dayjs(session.startDate, DATE_EXCHANGE_FORMAT).format('DD/MM/YYYY HH:mm')
            })
          })

          this.teacherList = data.teachers
        } else {
          console.error('Cannot get cdt config')
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      }
    )
  },
  methods: {
    closeModal (refresh = false) {
      this.$emit('close', refresh)
    },
    filterSessionList (teacher) {
      if (teacher.allSlots) {
        teacher.filteredSessions = teacher.nextSessions
      } else {
        teacher.filteredSessions = teacher.nextSessions.filter((item) => {
          return item.isSameSlot
        })
      }
      teacher.targetSession = teacher.filteredSessions[0]
    },
    onConfirm (e) {
      e.preventDefault()
      const teacherArray = []

      this.teacherList.forEach((teacher) => {
        teacherArray.push({
          allSlots: teacher.allSlots,
          teacherId: teacher.teacherId,
          substituteId: (teacher.substitutes[0]) ? teacher.substitutes[0].teacherId : 0,
          lastSessionId: teacher.targetSession.sessionId
        })
      })

      saveTeacherSubstitutes(this.sessionEvent.sessionId, teacherArray).then(
        (data) => {
          if (data.success) {
            this.closeModal(true)
          } else {
            // Toastr error
          }
        },
        (err) => {
          // TODO toastr
          console.error(err)
        }
      )
    },
    openUserCardModal (user) {
      this.$store.dispatch('userCard/initUserCard', {
        userId: user.teacherId
      })
    },
    updateSubstitute (value) {
      // TODO
      // console.log(value)
    }
  }
}
</script>

<style lang="scss">
.session-teacher-modal .window-body {
  overflow: visible !important;
}
</style>

<style lang="scss" scoped>
#teacherform p {
  margin-top: 0;
}

#teacherform ul {
  padding-left: 20px;
}

.teacher {
  margin-top: 20px;
}

.all-slots {
  display: inline-block;
  margin: 10px 0;
}

.name {
  display: flex;
  align-items: center;

  span {
    margin-right: 5px;
  }
}
</style>
