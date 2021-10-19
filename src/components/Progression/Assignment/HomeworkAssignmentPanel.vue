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
          >Affectation de</span>
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
        v-for="session in selectedSessions"
        :key="session.sessionId"
        :session="session"
        class="session"
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
    }
  },
  computed: {
    item () {
      return this.$store.state.progression.affectedItem
    },
    selectedSessions () {
      return this.$store.state.progression.selectedSessions
    }
  },
  created () {
  },
  methods: {
    closeHomeworkAssignment () {
      this.$store.dispatch('progression/setHomeworkAssignmentMode', false)
    },
    registerAssignments () {
      // TODO
      this.closeHomeworkAssignment()
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
  "add": "Donner le devoir",
  "cancel": "Annuler",
  "close": "Fermer",
  "homework": "Devoir",
  "session": "Séance"
}
</i18n>
