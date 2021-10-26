<template>
  <div class="container">
    <NeroToolbar>
      <PentilaButton
        class="create-button"
        @click="toggleEditModalDisplay()"
      >
        <NeroIcon
          name="fa-plus"
        />
        <span>{{ $t('add') }}</span>
      </PentilaButton>

      <span class="filters">{{ $t('filterBy') }}</span>
      <PentilaDropdown
        v-if="(subjectList && subjectList.length > 1)"
        v-model="selectedSubject"
        :list="subjectList"
        :sort="false"
        class="filter"
        display-field="name"
      />
      <PentilaDropdown
        v-if="(voleeList && voleeList.length > 1)"
        v-model="selectedVolee"
        :sort="false"
        :list="voleeList"
        class="filter"
      />
    </NeroToolbar>

    <div
      v-if="progressionList && progressionList.length > 0"
      class="list"
    >
      <ProgressionItem
        v-for="progression in progressionList"
        :key="progression.progressionId"
        :progression="progression"
        class="progression"
        @edit="toggleEditModalDisplay"
      />
    </div>
    <div
      v-else
      class="empty-container"
    >
      <span v-t="'noContentFound'" />
      <a
        v-t="'addProgression'"
        href="#"
        class="link"
        @click="toggleEditModalDisplay()"
      />
    </div>
    <teleport to="body">
      <EditProgressionModal
        v-if="isEditModalDisplayed"
        :updated-progression="selectedProgression"
        win-width="500px"
        @close="toggleEditModalDisplay"
      />
    </teleport>
  </div>
</template>

<script>
import NeroIcon from '@/components/Nero/NeroIcon'
import NeroToolbar from '@/components/Nero/NeroToolbar'
import PentilaUtils from 'pentila-utils'

import { defineAsyncComponent } from 'vue'
const EditProgressionModal = defineAsyncComponent(() => import('@/components/Progression/EditProgressionModal'))
const ProgressionItem = defineAsyncComponent(() => import('@/components/Progression/ProgressionItem'))

export default {
  name: 'ProgressionList',
  components: { EditProgressionModal, NeroIcon, NeroToolbar, ProgressionItem },
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
    this.$store.dispatch('progression/setCurrentProgression', undefined)
    if (this.progressionList === undefined) {
      this.$store.dispatch('progression/initProgressionList')
    }
  },
  methods: {
    toggleEditModalDisplay (progression) {
      this.selectedProgression = progression
      this.isEditModalDisplayed = !this.isEditModalDisplayed
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.create-button {
  margin-left: 30px;
  width: 140px;
  border-radius: 32px;

  span {
    margin-left: 12px;
  }
}

.filters {
  margin-left: auto;
}

.filter {
  margin: 0 5px;
  min-width: 200px;
}

.list {
  margin: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, 235px);
  grid-gap: 1rem;
}

.empty-container {
  margin: 1rem;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid $color-border;
  border-radius: $border-radius;
}

.link {
  font-weight: bold;
  margin-top: 1rem;
}
</style>

<i18n locale="fr">
{
  "add": "NOUVEAU",
  "filterBy": "Filtrer par :",
  "subject": "Discipline",
  "volee": "Volée",
  "noContentFound": "Aucun contenu existant.",
  "addProgression": "Ajouter votre progression !"
}
</i18n>
