<template>
  <div
    class="item"
  >
    <div class="item-name-wrapper">
      <div class="item-name">
        <img
          v-if="item.isHomework"
          class="item-type-icon"
          src="@assets/devoir.svg"
          :alt="$t('homework')"
          :title="$t('homework')"
        >
        <img
          v-else
          class="item-type-icon"
          src="@assets/seance.svg"
          :alt="$t('session')"
          :title="$t('session')"
        >
        <span>{{ item.name }}</span>
      </div>
    </div>

    <!-- Calendar icon -->
    <div
      class="affect"
      @click="displayCalendarPicker()"
    >
      <img
        class="calendar"
        src="@assets/calendar.svg"
        :alt="$t('session')"
        :title="$t('session')"
      >
    </div>

    <!-- Item sessions -->
    <div
      v-if="item.assignments"
      class="item-sessions"
    >
      <div
        v-for="assignment in item.assignments"
        :key="assignment.assignmentId"
        class="session"
      >
        <!-- Session -->
        <div
          class="cours-name"
          :style="getColor(assignment)"
        >
          <span>{{ assignment.coursName }}</span>
          <img
            class="remove-cours-assignment"
            src="@assets/big-cross-black.svg"
            :alt="$t('session')"
            :title="$t('session')"
            @click="deleteAssignment(assignment)"
          >
        </div>
        <!-- Session date and hours -->
        <span class="assignment-date">{{ getSessionDate(assignment) }}</span>
        <!-- Homework send date -->
        <!-- Modified content -->
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'ItemAssignment',
  components: {},
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    displayCalendarPicker () {
      this.$store.dispatch('progression/setAffectedItem', this.item)
      this.$store.dispatch('progression/setCalendarPickerMode', true)
    },
    getSessionDate (assignment) {
      return dayjs(assignment.sessionStartDate, 'YYYY-MM-DD HH:mm').format('DD MMMM') +
      ' de ' + dayjs(assignment.sessionStartDate, 'YYYY-MM-DD HH:mm').format('HH[h]mm') +
      ' à ' + dayjs(assignment.sessionEndDate, 'YYYY-MM-DD HH:mm').format('HH[h]mm')
    },
    deleteAssignment (assignment) {
      this.$store.dispatch('progression/deleteAssignment', { itemId: assignment.itemId, sessionId: assignment.sessionId })
    },
    getColor (assignment) {
      return 'background-color: ' + assignment.color
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  display: grid;
  grid-template-columns: 15% 5% 70%;
  grid-gap: 10px;
  justify-items: center;
  .item-name-wrapper {
    width: 100%;
    display: flex;
    .item-name {
      margin-left: 20px;
      display: flex;

      .item-type-icon {
        margin: auto;
        width: 20px;
        height: 20px;
      }
      span {
        margin: auto;
      }
      &:hover .affect {
        display: flex;
      }
    }
  }
  .affect {
    margin: auto;
  }
  .item-sessions {
    width: 70%;
    max-width: 70%;
    display: flex;
    flex-direction: column;
    margin: auto;
    .session {
      display: grid;
      grid-template-columns: 20% 30% 25% 25%;
      grid-gap: 10px;
      margin-top: 2px;
      margin-bottom: 2px;
      .cours-name {
        border: 1px solid black;
        display: flex;
        padding: 5px;
        span {
          margin: auto;
          margin-right: 10px;
        }
        .remove-cours-assignment {
          margin: auto;
          width: 10px;
          height: 10px;
        }
      }
      span {
        margin: auto;
      }
    }
  }
}
</style>

<i18n locale="fr">
{
  "session": "Séance",
  "homework": "Devoir"
}
</i18n>
