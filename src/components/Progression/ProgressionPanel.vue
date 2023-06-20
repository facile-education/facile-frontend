<template>
  <div
    class="progression-panel"
  >
    <ProgressionSwitchMode
      class="switch"
    />

    <!-- EDIT MODE -->
    <div
      v-if="isEditMode"
      class="tree-edit"
    >
      <ProgressionTree
        class="tree"
      />
      <div
        ref="scrollView"
        class="edit"
        @scroll="updateScrollPosition"
      >
        <FolderHeader
          v-if="currentFolder"
          class="header"
        />
        <ProgressionEdit
          class="section"
          :scroll-top-position="editScrollTop"
        />
      </div>
    </div>

    <!-- ASSIGNMENT MODE -->
    <div v-else>
      <CalendarPicker
        v-if="isCalendarPickerMode"
      />
      <HomeworkAssignmentPanel
        v-else-if="isHomeworkAssignmentMode"
      />
      <SessionContentEditPanel
        v-else-if="isSessionContentEditMode"
      />
      <ProgressionAssignment
        v-else
        class="assignment"
      />
    </div>
  </div>
</template>

<script>
import FolderHeader from '@components/Progression/Edit/FolderHeader'

import CalendarPicker from '@/components/Progression/Assignment/CalendarPicker'
import HomeworkAssignmentPanel from '@/components/Progression/Assignment/HomeworkAssignmentPanel'
import SessionContentEditPanel from '@/components/Progression/Assignment/SessionContentEditPanel'

import ProgressionAssignment from './Assignment/ProgressionAssignment.vue'
import ProgressionEdit from './Edit/ProgressionEdit.vue'
import ProgressionSwitchMode from './ProgressionSwitchMode.vue'
import ProgressionTree from './Tree/ProgressionTree.vue'

export default {
  name: 'ProgressionPanel',
  components: { FolderHeader, ProgressionSwitchMode, ProgressionEdit, ProgressionAssignment, ProgressionTree, CalendarPicker, HomeworkAssignmentPanel, SessionContentEditPanel },
  data () {
    return {
      editScrollTop: 0
    }
  },
  computed: {
    currentFolder () {
      return this.$store.state.progression.currentFolder
    },
    isEditMode () {
      return this.$store.state.progression.isEditMode
    },
    isCalendarPickerMode () {
      return this.$store.state.progression.isCalendarPickerMode
    },
    isHomeworkAssignmentMode () {
      return this.$store.state.progression.isHomeworkAssignmentMode
    },
    isSessionContentEditMode () {
      return this.$store.state.progression.isSessionContentEditMode
    }
  },
  methods: {
    updateScrollPosition () {
      this.editScrollTop = this.$refs.scrollView.scrollTop
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.progression-panel {
  height: 100%;

  .switch {
    width: 100%;
    height: $switch-mode-banner-height;
    border-bottom: 1px solid rgb(204, 204, 204);
  }

  .tree-edit {
    padding-top: 20px;
    display: flex;
    height: calc(100% - #{$switch-mode-banner-height});

    .tree {
      width: 20%;
      height: 100%;
      overflow-y: auto;
    }

    .edit {
      width: 80%;
      height: 100%;
      padding: 0 20px 20px 25px;
      overflow-y: auto;

      .header {
        margin-top: 5px;
        margin-bottom: 5px;
      }
    }
  }

  .assignment {
    display: flex;
    height: 100%;
  }
}
</style>

<i18n locale="fr">
{
  "add": "Créer"
}
</i18n>
