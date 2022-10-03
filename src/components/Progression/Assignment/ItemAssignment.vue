<template>
  <div
    class="item"
  >
    <div
      class="item-name-wrapper"
      :class="{ 'is-sub-section-item': isSubSectionItem }"
      :title="$t('display')"
      @click="togglePreviewModalDisplay"
    >
      <div
        class="item-name"
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
      :title="$t('affect')"
      @click="displayCalendarPicker()"
    >
      <img
        class="calendar"
        src="@assets/calendar.svg"
        :alt="$t('affect')"
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
          :style="getColor(assignment) + '19'"
          @mouseenter="setColor($event, assignment.color + '40') "
          @mouseleave="setColor($event, assignment.color + '19') "
        >
          <span
            :title="$t('edit')"
            @click="editSessionSpecificContent(assignment)"
          >{{ assignment.groupName }}</span>
          <img
            class="remove-cours-assignment"
            src="@assets/big-cross-black.svg"
            :alt="$t('remove')"
            :title="$t('remove')"
            @click="confirmAssignmentDeletion(assignment)"
          >
        </div>
        <!-- Session date and hours -->
        <span class="assignment-date"><span class="day">{{ getSessionDate(assignment) }}</span> <span style="white-space: nowrap">{{ getSessionHour(assignment) }}</span></span>
        <!-- Homework send date -->
        <span
          v-if="item.isHomework"
          class="todo-date"
        >{{ getTargetDate(assignment.targetDate) }}</span>
        <span v-else-if="assignment.modifiedDate" />
        <!-- Modified content -->
        <span
          v-if="assignment.modifiedDate"
          class="modified-date"
        >
          <NeroIcon
            name="fa-exclamation-triangle"
            class="icon"
          />
          {{ $t('modifiedContent') + formattedModifiedDate(assignment.modifiedDate) }}
        </span>
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
import NeroIcon from '@components/Nero/NeroIcon'

export default {
  name: 'ItemAssignment',
  components: { NeroIcon, PreviewModal },
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
  methods: {
    formattedModifiedDate (date) {
      return dayjs(date, 'YYYY-MM-DD HH:mm').format('DD/MM')
    },
    setColor (e, color) {
      e.target.style.backgroundColor = color
    },
    displayCalendarPicker () {
      this.$store.dispatch('progression/setAssignedItem', this.item)
      this.$store.dispatch('progression/setCalendarPickerMode', true)
    },
    getSessionDate (assignment) {
      return dayjs(assignment.sessionStartDate, 'YYYY-MM-DD HH:mm').format('dddd DD/MM')
    },
    getSessionHour (assignment) {
      return dayjs(assignment.sessionStartDate, 'YYYY-MM-DD HH:mm').format('HH[h]mm') +
        ' à ' + dayjs(assignment.sessionEndDate, 'YYYY-MM-DD HH:mm').format('HH[h]mm')
    },
    getTargetDate (targetDate) {
      return this.$t('to-do-for') + ' ' + dayjs(targetDate, 'YYYY-MM-DD HH:mm').format('DD/MM')
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
      return 'background-color: ' + assignment.color
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
    display: flex;
    &.is-sub-section-item {
      padding-left: 20px;
    }
    &:hover {
      cursor: pointer;
      background-color: #EFF3FB;
    }
    .item-name {
      display: flex;
      padding: 5px 0;
      color: black;

      .item-type-icon {
        width: 20px;
        height: 20px;
      }
      span {
        font-size: 14px;
      }
    }
  }
  .affect {
    cursor: pointer;
    display: flex;
    justify-content: center;
    margin-top: 3px;

    img {
      height: 23px;
    }

    &:hover {
      img {
        height: 26px;
      }
    }
  }
  .item-sessions {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: auto;
    .session {
      width: 100%;
      display: grid;
      grid-template-columns: 3% 20% 25% 20% 32%;
      grid-gap: 10px;
      margin-top: 3px;
      margin-bottom: 3px;
      .colored-circle {
        margin: auto;
        width: 12px;
        height: 12px;
        border-radius: 6px;
      }
      .cours-name {
        //border: 1px solid black;
        display: flex;
        justify-content: space-between;
        padding: 3px;
        cursor: pointer;
        background-color: #ffffffdd;
        font-weight: bold;
        height: 28px;
        margin-top: auto;
        margin-bottom: auto;

        span {
          margin: auto;
          margin-left: 10px;
          width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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

      .assignment-date {
        //color: black;
        //font-weight: bold;

        .day {
          display:inline-block;
          width: 105px;
          text-transform: capitalize;
        }
      }

      .modified-date {
        .icon {
          margin-right: 5px;
          vertical-align: text-bottom;
          font-size: 0.75rem;
          color: orange;
        }
      }
    }
  }
  .no-assignment {
    margin-top: 5px;
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
  "no-assignment": "Non assigné",
  "to-do-for": "A rendre le ",
  "deleteAssignmentWarning": "Supprimer cette affectation ?",
  "affect": "Affecter ce contenu",
  "display": "Visualiser ce contenu",
  "edit": "Modifier le contenu pour cette affectation",
  "remove": "Supprimer",
  "modifiedContent": "Contenu modifié le "
}
</i18n>
