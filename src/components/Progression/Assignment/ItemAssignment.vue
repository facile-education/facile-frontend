<template>
  <div
    class="item"
  >
    <div
      class="item-name-wrapper"
      :class="{ 'is-sub-section-item': isSubSectionItem }"
    >
      <div
        class="item-name"
        @click="togglePreviewModalDisplay"
      >
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
        :alt="$t('affect')"
        :title="$t('affect')"
      >
    </div>

    <!-- Item sessions -->
    <div
      v-if="filteredAssignments && filteredAssignments.length > 0"
      class="item-sessions"
    >
      <div
        v-for="assignment in filteredAssignments"
        :key="assignment.assignmentId"
        class="session"
      >
        <!-- Colored circle -->
        <div
          class="colored-circle"
          :style="getColor(assignment)"
        />

        <!-- Session -->
        <div
          class="cours-name"
          :style="getColor(assignment)"
        >
          <span
            @click="editSessionSpecificContent(assignment)"
          >{{ assignment.groupName }}</span>
          <img
            class="remove-cours-assignment"
            src="@assets/big-cross-black.svg"
            :alt="$t('session')"
            :title="$t('session')"
            @click="confirmAssignmentDeletion(assignment)"
          >
        </div>
        <!-- Session date and hours -->
        <span class="assignment-date">{{ getSessionDate(assignment) }}</span>
        <!-- Homework send date -->
        <span
          v-if="item.isHomework"
          class="todo-date"
        >{{ getTargetDate(assignment.targetDate) }}</span>
        <!-- Modified content -->
      </div>
    </div>
    <div
      v-else
      class="no-assignment"
    >
      <span>{{ $t('no-assignment') }}</span>
    </div>
    <teleport to="body">
      <PreviewModal
        v-if="isItemPreviewDisplayed"
        height="30em"
        :item="item"
        @close="togglePreviewModalDisplay"
      />
    </teleport>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import PreviewModal from '@/components/Progression/Edit/PreviewModal'
import _ from 'lodash'

export default {
  name: 'ItemAssignment',
  components: { PreviewModal },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isItemPreviewDisplayed: false
    }
  },
  computed: {
    isSubSectionItem () {
      return false
    },
    filteredAssignments () {
      if (this.$store.state.progression.filterCours.groupId === 0) {
        // No cours selected -> all items
        return _.orderBy(this.item.assignments, 'sessionStartDate', 'asc')
      } else {
        const assignmentIndex = this.item.assignments.map(assignment => assignment.groupName).indexOf(this.$store.state.progression.filterCours.groupName)
        if (assignmentIndex !== -1) {
          return [this.item.assignments[assignmentIndex]]
        }
      }
      return []
    }
  },
  created () {
  },
  methods: {
    displayCalendarPicker () {
      this.$store.dispatch('progression/setAssignedItem', this.item)
      this.$store.dispatch('progression/setCalendarPickerMode', true)
    },
    getSessionDate (assignment) {
      return dayjs(assignment.sessionStartDate, 'YYYY-MM-DD HH:mm').format('DD MMMM') +
      ' de ' + dayjs(assignment.sessionStartDate, 'YYYY-MM-DD HH:mm').format('HH[h]mm') +
      ' à ' + dayjs(assignment.sessionEndDate, 'YYYY-MM-DD HH:mm').format('HH[h]mm')
    },
    getTargetDate (targetDate) {
      return this.$t('to-do-for') + ' ' + dayjs(targetDate, 'YYYY-MM-DD HH:mm').format('DD MMMM')
    },
    confirmAssignmentDeletion (assignment) {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('deleteAssignmentWarning'),
        lastAction: { fct: this.deleteAssignment, params: [assignment] }
      })
    },
    deleteAssignment (assignment) {
      this.$store.dispatch('progression/deleteAssignment', { itemId: assignment.itemId, sessionId: assignment.sessionId })
    },
    getColor (assignment) {
      return 'background-color: ' + assignment.color + '50' // 50 is for opacity
    },
    togglePreviewModalDisplay () {
      this.isItemPreviewDisplayed = !this.isItemPreviewDisplayed
    },
    editSessionSpecificContent (assignment) {
      console.log('edit content for assignment=', assignment)
      this.$store.dispatch('progression/setAssignedItem', this.item)
      this.$store.dispatch('progression/setEditedAssignment', assignment)
      this.$store.dispatch('progression/setSessionContentEditMode', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  display: grid;
  grid-template-columns: 20% 5% auto;
  grid-gap: 10px;
  .item-name-wrapper {
    width: 100%;
    width: 300px;
    min-width: 300px;
    max-width: 300px;
    display: block ruby;
    &.is-sub-section-item {
      padding-left: 20px;
    }
    .item-name {
      display: flex;

      .item-type-icon {
        margin: auto;
        width: 20px;
        height: 20px;
      }
      span {
        margin: auto;
        font-size: 14px;
      }
      &:hover {
        cursor: pointer;
        background-color: #EFF3FB;
      }
    }
  }
  .affect img {
    display: none;
  }
  &:hover .affect img {
    display: flex;
    cursor: pointer;
  }
  .item-sessions {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: auto;
    .session {
      width: 100%;
      display: grid;
      grid-template-columns: 3% 20% 25% 25%;
      grid-gap: 10px;
      margin-top: 2px;
      margin-bottom: 2px;
      .colored-circle {
        margin: auto;
        width: 15px;
        height: 15px;
        border-radius: 8px;
      }
      .cours-name {
        border: 1px solid black;
        display: flex;
        justify-content: space-between;
        padding: 3px;
        &:hover {
          cursor: pointer;
        }

        span {
          margin: auto;
          margin-left: 10px;
          width: 90%;
        }
        .remove-cours-assignment {
          margin: auto;
          margin-right: 5px;
          width: 10px;
          height: 10px;
          &:hover {
            cursor: pointer;
          }
        }
      }
      span {
        margin: auto;
        font-size: 13px;
      }
    }
  }
  .no-assignment {
    width: 100%;
    span {
      float: left;
      font-size: 12px;
      font-style: italic;
    }
  }
}
</style>

<i18n locale="fr">
{
  "session": "Séance",
  "homework": "Devoir",
  "no-assignment" : "Non assigné",
  "to-do-for": "A rendre le ",
  "deleteAssignmentWarning": "Supprimer cette affectation ?",
  "affect": "Affecter ce contenu"
}
</i18n>
