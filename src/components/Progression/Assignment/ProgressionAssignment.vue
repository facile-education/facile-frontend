<template>
  <div class="assignment">
    <div
      class="filters"
    >
      <PentilaDropdown
        v-if="(sections && sections.length > 1)"
        v-model="selectedFolder"
        class="filter"
        :list="sections"
        display-field="name"
      />
      <PentilaDropdown
        v-if="(coursList && coursList.length > 1)"
        v-model="selectedCours"
        class="filter"
        :list="coursList"
        display-field="groupName"
      />
    </div>
    <SectionAssignment
      v-for="section in progression.sections"
      :key="section.folderId"
      :section="section"
      class="section"
    />
  </div>
</template>

<script>
import SectionAssignment from '@/components/Progression/Assignment/SectionAssignment'

export default {
  name: 'ProgressionAssignment',
  components: { SectionAssignment },
  props: {
  },
  data () {
    return {
      selectedCours: {},
      selectedFolder: {}
    }
  },
  computed: {
    progression () {
      return this.$store.state.progression.currentProgression
    },
    sections () {
      console.log('sections=', this.progression.sections)
      return this.progression.sections
    },
    filteredSections () {
      if (this.selectedFolder === undefined) {
        return this.progression.sections
      } else {
        const sectionIndex = this.progression.sections.map(section => section.folderId).indexOf(this.selectedFolder.folderId)
        if (sectionIndex !== -1) {
          return this.progression.sections[sectionIndex]
        }
      }
      return []
    },
    coursList () {
      if (this.$store.state.progression.coursList !== undefined) {
        const toto = [{ groupName: this.$t('cours'), groupId: 0 }, ...this.$store.state.progression.coursList]
        console.log('cours list is ', toto)
        return toto
      }
      return []
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.assignment {
  display: flex;
  flex-direction: column;
  .filters {
    width: 100%;
    .filter {
      width: 200px;
    }
  }
  .section {
    margin-top: 20px;
    margin-left: 20px;
  }
}
</style>

<i18n locale="fr">
{
  "cours": "Séance"
}
</i18n>
