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
        {{ $t('add') }}
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
          <NeroIcon
            name="fa-pencil-alt"
            class="button"
            @click="toggleEditModalDisplay(progression)"
          />
          <NeroIcon
            name="fa-trash"
            class="button"
            @click="confirmProgressionDeletion(progression)"
          />
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
      this.$store.dispatch('progression/getProgressionContent', progression.progressionId)
      this.$store.dispatch('progression/setCurrentProgression', progression)
      this.$store.dispatch('progression/setListMode', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.list {

  .header {
    display: flex;
    justify-content: space-between;
    height: 50px;
    vertical-align: middle;
    margin-top: 10px;
    .create-button {
      margin-left: 30px;
      height: 48px;
      width: 140px;
      border-radius: 32px;
      background-color: #306CD3;
    }
    .filters {
      display: flex;
      margin-right: 10px;
      height: 70%;
      p {
        float: left;
        margin-right: 10px;
      }
      .filter {
        margin-right: 10px;
        min-width: 200px;
      }
    }
  }

  .progression-list {
    margin: 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, 15rem);
    grid-gap: 1rem;
    background: rgb(239, 243, 255);

    .progression {
      height: 15rem;
      max-height: 15rem;
      width: 15rem;
      background: white;

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
        margin-right: 2rem;
        float: right;
        .button {
          margin: 7px;
          margin-left: 30px;
          &:hover {
            border: 1px solid black;
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
  "warning": "La suppression de cette progression est définitive."
}
</i18n>
