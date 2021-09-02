<template>
  <PentilaButton @click="toggleEditModalDisplay">
    <NeroIcon
      name="fa-plus"
    />
    {{ $t('add') }}
  </PentilaButton>
  <PentilaDropdown
    v-if="(voleeList && voleeList.length > 1)"
    v-model="selectedVolee"
    :sort="false"
    :list="voleeList"
  />
  <PentilaDropdown
    v-if="(subjectList && subjectList.length > 1)"
    v-model="selectedSubject"
    :list="subjectList"
    :sort="false"
    display-field="name"
  />
  <div class="progression-list">
    <div
      v-for="progression in progressionList"
      :key="progression.progressionId"
      class="progression"
    >
      <h4>
        {{ progression.name }}
        <NeroIcon
          name="fa-pencil-alt"
          @click="toggleEditModalDisplay(progression)"
        />
        <NeroIcon
          name="fa-trash"
          @click="confirmProgressionDeletion(progression)"
        />
      </h4>
      <div>
        {{ progression.imageId }}
        {{ progression.volee }}
        {{ progression.description }}
        {{ progression.subjectId }}
        {{ progression.modifiedDate }}
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
    }
  }
}
</script>

<style lang="scss" scoped>
.progression-list {
  margin: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  grid-gap: 1rem;
}

.progression {
  border: 1px solid black;

  h4 {
    margin: 0;
    color: white;
    background: darkslategray;
  }

  div {
    padding: 10px;
  }
}
// <i18n src="./myLang.json"></i18n>
</style>

<i18n locale="fr">
{
  "add": "Créer",
  "subject": "Discipline",
  "volee": "Volée",
  "warning": "La suppression de cette progression est définitive."
}
</i18n>
