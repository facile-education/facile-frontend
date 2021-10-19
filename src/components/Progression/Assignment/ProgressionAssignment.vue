<template>
  <div class="assignment">
    <div
      class="filters"
    >
      <PentilaDropdown
        v-if="(folders && folders.length > 1)"
        v-model="selectedFolder"
        class="filter"
        :list="folders"
        display-field="name"
        @dropdown-select="onFolderSelect"
      />
      <PentilaDropdown
        v-if="(coursList && coursList.length > 1)"
        v-model="selectedCours"
        class="filter"
        :list="coursList"
        display-field="groupName"
        @dropdown-select="onCoursSelect"
      />
    </div>
    <div v-if="filteredSections.length > 0">
      <SectionAssignment
        v-for="section in filteredSections"
        :key="section.folderId"
        :section="section"
        class="section"
      />
    </div>
  </div>
</template>

<script>
import SectionAssignment from '@/components/Progression/Assignment/SectionAssignment'
import { isCoursNameInItemsList } from '@/utils/progression.util'

export default {
  name: 'ProgressionAssignment',
  components: { SectionAssignment },
  props: {
  },
  data () {
    return {
      defaultSelectedCours: { groupName: this.$t('all-cours'), groupId: 0 },
      defaultSelectedFolder: { name: this.$t('whole-progression'), folderId: 0 }
    }
  },
  computed: {
    progression () {
      return this.$store.state.progression.currentProgression
    },
    folders () {
      const allFolders = [{ name: this.$t('whole-progression'), folderId: 0 }, ...this.progression.sections]
      // Loop over sections
      for (let sectionIdx = 0; sectionIdx < this.progression.sections.length; ++sectionIdx) {
        const section = this.progression.sections[sectionIdx]
        Array.prototype.push.apply(allFolders, section.subSections)
      }
      return allFolders
    },
    coursList () {
      return [...this.$store.state.progression.coursList, { groupName: this.$t('all-cours'), groupId: 0 }]
    },
    selectedFolder: {
      get () {
        return this.$store.state.progression.filterFolder
      },
      set (folder) {
        this.$store.commit('progression/setFilterFolder', folder)
      }
    },
    selectedCours: {
      get () {
        return this.$store.state.progression.filterCours
      },
      set (cours) {
        this.$store.commit('progression/setFilterCours', cours)
      }
    },
    filteredSections () {
      const filteredSections = []
      // Loop over sections
      for (let sectionIdx = 0; sectionIdx < this.progression.sections.length; ++sectionIdx) {
        const section = this.progression.sections[sectionIdx]

        const sectionNameMatches = this.$store.state.progression.filterFolder.folderId === 0 || section.folderId === this.$store.state.progression.filterFolder.folderId
        const sectionCoursMatches = this.$store.state.progression.filterCours.groupId === 0 || isCoursNameInItemsList(section.items, this.$store.state.progression.filterCours.groupName)

        // Add section if both folder name and cours name match at section level
        if (sectionNameMatches && sectionCoursMatches) {
          filteredSections.push(section)
        } else {
          // Test at sub-section level -> loop over sub-sections
          for (let subIdx = 0; subIdx < section.subSections.length; ++subIdx) {
            const subSection = section.subSections[subIdx]
            const subSectionNameMatches = this.$store.state.progression.filterFolder.folderId === 0 || subSection.folderId === this.$store.state.progression.filterFolder.folderId
            const subSectionCoursMatches = this.$store.state.progression.filterCours.groupId === 0 || isCoursNameInItemsList(subSection.items, this.$store.state.progression.filterCours.groupName)
            if (subSectionNameMatches && subSectionCoursMatches) {
              filteredSections.push(section)
            }
          }
        }
      }
      return filteredSections
    }
  },
  mounted () {
    // this.selectedCours = { groupName: this.$t('all-cours'), groupId: 0 }
    // this.selectedFolder = { name: this.$t('whole-progression'), folderId: 0 }
  },
  methods: {
    onFolderSelect (folder) {
      this.selectedFolder = folder
      this.$store.dispatch('progression/setFilterFolder', folder)
    },
    onCoursSelect (cours) {
      this.selectedCours = cours
      this.$store.dispatch('progression/setFilterCours', cours)
    }
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
