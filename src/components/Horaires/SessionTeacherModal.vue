<template>
  <PentilaWindow
    :modal="true"
    :class="{'session-teacher': mq.phone}"
    @close="closeModal"
  >
    <template #header>
      <span v-t="{ path: 'teacherManagement', args: { course: sessionEvent.title }}" />
    </template>

    <template #body>
      <div id="teacherform">
        <p v-t="{ path: 'firstSession', args: { date: sessionDate, start: sessionStart, end: sessionEnd }}" />
        <ul>
          <li
            v-for="teacher in teacherList"
            :key="teacher.id"
            class="teacher"
          >
            <div class="name">
              <span><b>{{ `${teacher.firstName.substring(0, 1)}. ${teacher.lastName} ` }}</b>{{ $t('substitutedBy') }}</span>
              <UserCompletion
                v-model="teacher.substitutes"
                style="display: inline-block;"
                user-type="teacher"
                :placeholder="$t('substitute')"
              />
            <!-- @blur="v$.newEvent.extendedProps.teacher.teacherId.$touch()" -->
            </div>
            <PentilaCheckbox
              v-model="teacher.allSlots"
              :label="$t('allSessions', {course: sessionEvent.title})"
              :disabled="teacher.substitutes.length === 0"
              class="all-slots"
              @update:modelValue="filterSessionList(teacher)"
            />
            <div>
              <span v-t="'lastSession'" />
              <PentilaDropdown
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
      <PentilaButton
        :label="$t('confirm')"
        @click="onConfirm"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { getSessionTeachersAndSubstitutes, saveTeacherSubstitutes } from '@/api/cdt.service'
import dayjs from 'dayjs'

import UserCompletion from '@components/NotUsualSlotManager/UserCompletion'

export default {
  name: 'SessionTeacherModal',
  components: { UserCompletion },
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
      return dayjs(this.sessionEvent.start).format('DD/MM/YYYY')
    },
    sessionEnd () {
      return dayjs(this.sessionEvent.end).format('HH:mm')
    },
    sessionStart () {
      return dayjs(this.sessionEvent.start).format('HH:mm')
    }
  },
  created () {
    // Get teacher list from backend.
    this.teacherList.length = 0
    getSessionTeachersAndSubstitutes(this.sessionEvent.extendedProps.id).then(
      (data) => {
        if (data.success) {
          data.teachers.forEach((teacher) => {
            this.filterSessionList(teacher)
            teacher.substitutes = (teacher.substitute) ? [teacher.substitute] : []

            teacher.nextSessions.forEach((session) => {
              session.displayDate = dayjs(session.startDate).format('DD/MM/YYYY HH:mm')
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

      saveTeacherSubstitutes(this.sessionEvent.extendedProps.id, teacherArray).then(
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
    updateSubstitute (value) {
      console.log(value)
    }
  }
}
</script>

<style lang="scss">
.session-teacher .window-body {
  overflow: auto;
}
</style>

<style lang="scss" scoped>
#teacherform p {
  margin-top: 0
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

<i18n locale="fr">
{
  "allSessions": "Appliquer le remplacement pour toutes les séances du {course}",
  "confirm": "Valider",
  "firstSession": "Première séance affectée : le {date} de {start} à {end}",
  "lastSession": "Dernière séance affectée : ",
  "substitute": "Remplaçant",
  "substitutedBy": " remplacé.e par ",
  "teacherManagement": "Gérer les maîtres du {course}"
}
</i18n>
