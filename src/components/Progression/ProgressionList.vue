<template>
  <div
    class="list"
  >
    <div
      class="header"
    >
      <PentilaButton
        class="create-button"
        @click="toggleEditModalDisplay"
      >
        <NeroIcon
          name="fa-plus"
        />
        <span>{{ $t('add') }}</span>
      </PentilaButton>

      <div
        class="filters"
      >
        <p>{{ $t('filterBy') }}</p>
        <PentilaDropdown
          v-if="(subjectList && subjectList.length > 1)"
          v-model="selectedSubject"
          class="filter"
          :list="subjectList"
          :sort="false"
          display-field="name"
        />
        <PentilaDropdown
          v-if="(voleeList && voleeList.length > 1)"
          v-model="selectedVolee"
          class="filter"
          :sort="false"
          :list="voleeList"
        />
      </div>
    </div>

    <div class="progression-list">
      <div
        v-for="progression in progressionList"
        :key="progression.progressionId"
        class="progression"
      >
        <div
          class="header"
          @click="selectProgression(progression)"
        >
          <p>{{ progression.volee }} {{ progression.subjectName }}</p>
        </div>
        <div
          class="body"
          @click="selectProgression(progression)"
        >
          <p>{{ progression.name }}</p>
        </div>
        <div
          class="buttons"
        >
          <img
            class="button"
            src="@assets/edit.svg"
            :alt="$t('edit')"
            :title="$t('edit')"
            @click="toggleEditModalDisplay(progression)"
          >
          <!-- <img
            class="button"
            src="@assets/duplicate.svg"
            :alt="$t('duplicate')"
            :title="$t('duplicate')"
            @click="duplicate(progression)"
          >
          <img
            class="button"
            src="@assets/share.svg"
            :alt="$t('share')"
            :title="$t('share')"
            @click="toggleShareModalDisplay(progression)"
          > -->
          <img
            class="button"
            src="@assets/trash.svg"
            :alt="$t('delete')"
            :title="$t('delete')"
            @click="confirmProgressionDeletion(progression)"
          >
        </div>
      </div>
    </div>
    <teleport to="body">
      <EditProgressionModal
        v-if="isEditModalDisplayed"
        :updated-progression="selectedProgression"
        @close="toggleEditModalDisplay"
      />
    </teleport>
  </div>
</template>

<script>
import NeroIcon from '@/components/Nero/NeroIcon'
import PentilaUtils from 'pentila-utils'
// import _ from 'lodash'

import { defineAsyncComponent } from 'vue'
const EditProgressionModal = defineAsyncComponent(() => import('@/components/Progression/EditProgressionModal'))

export default {
  name: 'ProgressionList',
  components: { EditProgressionModal, NeroIcon },
  data () {
    return {
      isEditModalDisplayed: false,
      selectedProgression: undefined,
      selectedSubject: undefined,
      selectedVolee: undefined
    }
  },
  computed: {
    progressionList () {
      let list = this.$store.state.progression.progressionList
      if (list && this.selectedVolee !== this.$t('volee')) {
        list = list.filter((el) => el.volee === this.selectedVolee)
      }
      if (list && this.selectedSubject && this.selectedSubject.subjectId !== 0) {
        list = list.filter((el) => el.subjectId === this.selectedSubject.subjectId)
      }
      return list
      // _.orderBy(list, 'modifiedDate', 'desc')
    },
    subjectList () {
      if (this.$store.state.progression.subjectList) {
        const defaultSubject = {
          subjectId: 0,
          name: this.$t('subject')
        }
        return [
          defaultSubject,
          ...PentilaUtils.Array.sortWithString(this.$store.state.progression.subjectList, false, 'name')
        ]
      }
      return []
    },
    voleeList () {
      if (this.$store.state.progression.voleeList) {
        return [this.$t('volee'), ...this.$store.state.progression.voleeList]
      }
      return []
    }
  },
  created () {
    if (this.progressionList === undefined) {
      this.$store.dispatch('progression/initProgressionList')
    }
  },
  methods: {
    confirmProgressionDeletion (progression) {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('warning'),
        lastAction: { fct: this.deleteProgression, params: [progression] }
      })
    },
    deleteProgression (progression) {
      this.$store.dispatch('progression/deleteProgression', progression)
    },
    toggleEditModalDisplay (progression) {
      this.selectedProgression = progression
      this.isEditModalDisplayed = !this.isEditModalDisplayed
    },
    selectProgression (progression) {
      this.$store.dispatch('progression/setCurrentProgression', progression)
      // Set default folder
      if (this.$store.state.progression.currentProgression.sections !== undefined && this.$store.state.progression.currentProgression.sections.length > 0) {
        this.$store.dispatch('progression/setCurrentFolder', this.$store.state.progression.currentProgression.sections[0])
      }
      this.$store.dispatch('progression/setListMode', false)
      this.$store.dispatch('progression/getProgressionContent', progression.progressionId)
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-direction: column;
  height: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    height: 50px;
    margin-top: 1rem;
    margin-bottom: 1rem;
    .create-button {
      margin: auto;
      margin-left: 30px;
      height: 48px;
      width: 140px;
      border-radius: 32px;
      background-color: #306CD3;
      span {
        margin-left: 12px;
      }
    }

    .filters {
      display: flex;
      margin: auto;
      margin-right: 10px;
      height: 70%;
      p {
        float: left;
        margin: auto;
        margin-right: 10px;
        font-size: 14px;
      }
      .filter {
        margin-right: 10px;
        min-width: 200px;
        font-size: 14px;
        button {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }

  .progression-list {
    margin: 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, 15rem);
    grid-gap: 1rem;

    .progression {
      height: 15rem;
      max-height: 15rem;
      width: 15rem;
      border: 1px solid rgba(0, 0, 0, 0.3);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

      &:hover {
        border: 1px solid grey;
      }
      .header {
        margin: 0;
        color: white;
        background: rgb(84, 119, 236);
        p {
          text-align: center;
          margin-left: 20px;
        }
      }

      .body {
        padding: 10px;
        height: 9rem;
        p {
          margin-left: 10px;
        }
      }

      .buttons {
        height: 4rem;
        margin-right: 1rem;
        float: right;
        .button {
          margin-left: 1rem;
          border: 1px solid transparent;
          border-radius: 5px;
          padding: 5px;
          margin: 5px;
          &:hover {
            border: 1px solid grey;
            cursor: pointer;
          }
        }
      }
    }
}

}
</style>

<i18n locale="fr">
{
  "add": "NOUVEAU",
  "filterBy": "Filtrer par :",
  "subject": "Discipline",
  "volee": "Volée",
  "warning": "La suppression de cette progression est définitive.",
  "edit": "Modifier",
  "share": "Partager",
  "duplicate": "Dupliquer",
  "delete": "Supprimer"
}
</i18n>
