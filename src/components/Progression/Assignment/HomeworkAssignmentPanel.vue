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
      class="sessions"
    >
      <HomeworkAssignment
        v-for="session in newSessions"
        :key="session.id"
        :session="session"
        class="session"
        @edited-homework="updateHomework"
      />
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
        :label="$t('add')"
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
      return this.$store.state.progression.affectedItem
    },
    newSessions () {
      // Homework assignment is based on initial sessions minus the remove ones plus the added ones
      const res = []
      for (let idx = 0; idx < this.$store.state.progression.affectedItem.assignments.length; ++idx) {
        const initialSession = this.$store.state.progression.affectedItem.assignments[idx]
        console.log('homework aff : initial session ', initialSession)
        res.push(initialSession)
      }
      for (let idx = 0; idx < this.$store.state.progression.addedAssignedSessions.length; ++idx) {
        const addedSession = this.$store.state.progression.addedAssignedSessions[idx]
        res.push(addedSession)
        console.log('homework aff : add session ', addedSession)
      }
      for (let idx = 0; idx < this.$store.state.progression.removedAssignedSessions.length; ++idx) {
        const removedSession = this.$store.state.progression.removedAssignedSessions[idx]
        if (res.includes(removedSession)) {
          console.log('homework aff : remove session ', removedSession)
          const index = res.indexOf(removedSession)
          res.splice(index, 1)
        }
      }
      return res
    }
  },
  created () {
  },
  methods: {
    closeHomeworkAssignment () {
      this.$store.dispatch('progression/setHomeworkAssignmentMode', false)
    },
    registerAssignments () {
      console.log('About to register new homeworks ', this.homeworks)
      this.closeHomeworkAssignment()
    },
    updateHomework (updatedHomework) {
      console.log('received updated homework ', updatedHomework)
      const sourceSessionIndex = this.homeworks.map(sourceSession => sourceSession.sessionId).indexOf(updatedHomework.sourceSession.sessionId)
      if (sourceSessionIndex !== -1) {
        this.homeworks.splice(sourceSessionIndex, 1)
      } else {
        this.homeworks.push(updatedHomework)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.homework-assignment {
  .header {
    display: block ruby;
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
  "cancel": "Annuler",
  "close": "Fermer",
  "homework": "Devoir",
  "session": "Séance"
}
</i18n>
