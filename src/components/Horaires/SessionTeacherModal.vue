<template>
  <PentilaWindow
    :modal="true"
    @close="closeModal"
  >
    <template #header>
      <span v-t="{ path: 'teacherManagement', args: { course: sessionEvent.title }}" />
    </template>

    <template #body>
      <form id="teacherform">
        <p v-t="{ path: 'firstSession', args: { date: sessionDate, start: sessionStart, end: sessionEnd }}" />
        <div
          v-for="teacher in teacherList"
          :key="teacher.id"
        >
          <span>{{ sessionEvent.extendedProps.teachers }} remplacé par </span>
          <UserCompletion
            style="display: inline-block;"
            user-type="teacher"
            :placeholder="$t('substitute')"
            @selectUser="updateSubstitute"
          />
          <!-- :initial-user-list="newEvent.extendedProps.teacher? [newEvent.extendedProps.teacher] : undefined" -->
          <!-- @blur="v$.newEvent.extendedProps.teacher.teacherId.$touch()" -->
          <br>
          <PentilaCheckbox
            v-model="teacher.allSlotsTargeted"
            :label="$t('allSessions', {course: sessionEvent.title})"
          />
          <p v-t="'lastSession'" />
          <PentilaDropdown
            v-if="teacher.sessionList.length > 0"
            v-model="targetSession"
            :list="teacher.sessionList"
          />
        </div>
      </form>
    </template>

    <template #footer>
      <PentilaButton
        form="teacherform"
        :label="$t('confirm')"
        @click="onConfirm"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import dayjs from 'dayjs'

import UserCompletion from '@components/NotUsualSlotManager/UserCompletion'

// TODO Get teachers details for the selected session + refresh after save
// JSON Struct send to back ?
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
      targetSession: {}
    }
  },
  computed: {
    sessionDate () {
      return dayjs(this.sessionEvent.start).format('DD/MM/YYYY')
    },
    sessionEnd () {
      return dayjs(this.sessionEvent.start).format('HH:mm')
    },
    teacherList () {
      return [{ id: 0, sessionList: [], allSlotsTargeted: false }, { id: 1, sessionList: [], allSlotsTargeted: false }]
    },
    sessionStart () {
      return dayjs(this.sessionEvent.end).format('HH:mm')
    }
  },
  created () {
    // Get teacher list from backend.
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    onConfirm (e) {
      e.preventDefault()

      this.closeModal()
    },
    updateSubstitute (value) {
      console.log(value)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n locale="fr">
{
  "allSessions": "Appliquer le remplacement pour toute les séances du {course}",
  "confirm": "Valider",
  "firstSession": "Première séance affectée : le {date} de {start} à {end}",
  "lastSession": "Dernière séance affectée :",
  "substitute": "Remplaçant",
  "teacherManagement": "Gérer les maîtres du {course}"
}
</i18n>
