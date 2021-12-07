<template>
  <div
    class="homework-assignment"
    :class="{'mobile': mq.phone}"
    @close="closeModal"
  >
    <!-- Header -->
    <div
      class="header"
    >
      <div
        class="item-title"
      >
        <img
          class="item-type-icon"
          src="@assets/devoir.svg"
          :alt="$t('homework')"
          :title="$t('homework')"
        >
        <div
          class="labels"
        >
          <span
            class="label"
          >{{ $t('precision') }}</span>
          <span
            class="item-name"
          >{{ item.name }}</span>
        </div>
      </div>
      <img
        class="close-button"
        src="@assets/big-cross-black.svg"
        :alt="$t('close')"
        :title="$t('close')"
        @click="closeHomeworkAssignment()"
      >
    </div>

    <div
      v-if="newSessions.length > 0"
      class="sessions"
    >
      <HomeworkAssignment
        v-for="session in newSessions"
        :key="session.sessionId"
        :session="session"
        class="session"
        @edited-homework="updateHomework"
      />
    </div>
    <div
      v-else
      class="sessions"
    >
      <span
        class="no-session"
      >{{ $t('no-session-selected') }}</span>
    </div>
    <div
      class="footer"
    >
      <PentilaButton
        :label="$t('cancel')"
        class="button cancel-button"
        @click="closeHomeworkAssignment"
      />
      <PentilaButton
        :label="getButtonLabel()"
        class="button create-button"
        @click="registerAssignments()"
      />
    </div>
  </div>
</template>

<script>
import HomeworkAssignment from '@/components/Progression/Assignment/HomeworkAssignment'

export default {
  name: 'HomeworkAssignmentPanel',
  components: { HomeworkAssignment },
  inject: ['mq'],
  props: {
  },
  data () {
    return {
      homeworks: []
    }
  },
  computed: {
    item () {
      return this.$store.state.progression.assignedItem
    },
    newSessions () {
      // Homework assignment is based on initial sessions minus the remove ones plus the added ones
      const sessionsToAssign = []
      for (let idx = 0; idx < this.item.assignments.length; ++idx) {
        const initialSession = this.item.assignments[idx]
        sessionsToAssign.push(initialSession)
      }
      for (let idx = 0; idx < this.$store.state.progression.addedAssignedSessions.length; ++idx) {
        const addedSession = this.$store.state.progression.addedAssignedSessions[idx]
        sessionsToAssign.push(addedSession)
      }
      for (let idx = 0; idx < this.$store.state.progression.removedAssignedSessions.length; ++idx) {
        const removedSession = this.$store.state.progression.removedAssignedSessions[idx]
        const removedSessionIndex = sessionsToAssign.map(session => session.sessionId).indexOf(removedSession.sessionId)
        if (removedSessionIndex !== -1) {
          sessionsToAssign.splice(removedSessionIndex, 1)
        }
      }
      return sessionsToAssign
    }
  },
  created () {
  },
  methods: {
    closeHomeworkAssignment () {
      this.$store.dispatch('progression/setHomeworkAssignmentMode', false)
    },
    registerAssignments () {
      // Register assignments and propagate content
      if (this.homeworks.length > 0) {
        this.$store.dispatch('progression/addHomeworkAssignment', { itemId: this.item.itemId, homeworks: this.homeworks })
      }

      for (let idx = 0; idx < this.$store.state.progression.removedAssignedSessions.length; ++idx) {
        const session = this.$store.state.progression.removedAssignedSessions[idx]
        this.$store.dispatch('progression/deleteAssignment', { itemId: this.item.itemId, sessionId: session.sessionId })
      }
      // Reset the added and removed affected session ids lists
      this.$store.dispatch('progression/resetAffectedSessions')

      this.closeHomeworkAssignment()
    },
    updateHomework (updatedHomework) {
      updatedHomework.targetSessionId = updatedHomework.targetSession.sessionId
      const sourceSessionIndex = this.homeworks.map(homework => homework.sourceSessionId).indexOf(updatedHomework.sourceSessionId)
      if (sourceSessionIndex !== -1) {
        this.homeworks.splice(sourceSessionIndex, 1)
      }
      this.homeworks.push(updatedHomework)
    },
    getButtonLabel () {
      if (this.newSessions.length === 0) {
        return this.$t('save')
      } else {
        return this.$t('add')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.homework-assignment {
  .header {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 10px;
    .item-title {
      margin-left: 20px;
      display: flex;
      flex-basis: content;
      .item-type-icon {
        width: 35px;
        height: 35px;
        margin: auto;
      }
      .labels {
        margin: auto;
        display: flex;
        flex-direction: column;
        .label {
          font-size: 12px;
        }
        .item-name {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
    .close-button {
      float: right;
      margin-top: 20px;
      margin-right: 20px;
      width: 20px;
      height: 20px;
    }
  }
  .sessions {
    .session {
      margin-bottom: 10px;
    }
    .no-session {
      margin-top: 50px;
      margin-left: 50px;
    }
  }
  .footer {
    display: flex;
    justify-content: space-around;
    width: 500px;
    margin: auto;
    margin-top: 20px;
    z-index: 10;
    .button {
      width: 200px;
    }
  }
}
</style>

<i18n locale="fr">
{
  "precision": "Précisions pour l'affectation de ",
  "add": "Donner le devoir",
  "save": "Enregistrer",
  "cancel": "Annuler",
  "close": "Fermer",
  "homework": "Devoir",
  "session": "Séance",
  "no-session-selected": "Aucune séance n'est sélectionnée"
}
</i18n>
