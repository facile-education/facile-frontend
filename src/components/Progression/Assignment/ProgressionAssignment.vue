<template>
  <div class="assignment">
    <div
      class="filters"
    >
      <PentilaDropdown
        v-if="(sections && sections.length > 0)"
        v-model="selectedFolder"
        class="filter"
        :list="sections"
        display-field="name"
      />
      <PentilaDropdown
        v-if="(coursList && coursList.length > 0)"
        v-model="selectedCours"
        class="filter"
        :list="coursList"
        display-field="groupName"
      />
    </div>
    <SectionAssignment
      v-for="section in filteredSections"
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
      selectedCours: { groupName: this.$t('all-cours'), groupId: 0 },
      selectedFolder: { name: this.$t('whole-progression') }
    }
  },
  computed: {
    progression () {
      return this.$store.state.progression.currentProgression
    },
    sections () {
      return [{ name: this.$t('whole-progression') }, ...this.progression.sections]
    },
    filteredSections () {
      if (this.selectedFolder.folderId === undefined) {
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
        return [{ groupName: this.$t('all-cours'), groupId: 0 }, ...this.$store.state.progression.coursList]
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
    margin-top: 10px;
    margin-bottom: 10px;
    .filter {
      width: 200px;
      margin-left: 20px;
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
  "all-cours": "Tous les cours",
  "whole-progression": "Toute la progression"
}
</i18n>
