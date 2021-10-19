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
    sections () {
      return [...this.progression.sections, { name: this.$t('whole-progression'), folderId: 0 }]
    },
    coursList () {
      return [...this.$store.state.progression.coursList, { groupName: this.$t('all-cours'), groupId: 0 }]
    },
    selectedFolder: {
      get () {
        return this.$store.state.progression.selectedFolder
      },
      set (folder) {
        this.$store.commit('progression/setFilterFolder', folder)
      }
    },
    selectedCours: {
      get () {
        return this.$store.state.progression.selectedCours
      },
      set (cours) {
        this.$store.commit('progression/setFilterCours', cours)
      }
    },
    filteredSections () {
      console.log('filteredSections: filterFolder=', this.$store.state.progression.filterFolder)
      console.log('filteredSections: filterCours=', this.$store.state.progression.filterCours)
      if (this.$store.state.progression.filterFolder.folderId === 0 && this.$store.state.progression.filterCours.groupId === 0) {
        // No folder nor cours selected -> all folders
        return this.progression.sections
      } else {
        const filteredSections = []
        // Loop over sections
        for (let sectionIdx = 0; sectionIdx < this.progression.sections.length; ++sectionIdx) {
          let sectionMatches = this.$store.state.progression.filterFolder.folderId === 0
          let coursMatches = this.$store.state.progression.filterCours.groupId === 0
          const section = this.progression.sections[sectionIdx]
          if (this.$store.state.progression.filterFolder.folderId !== 0 &&
              section.folderId === this.$store.state.progression.filterFolder.folderId &&
              this.$store.state.progression.filterCours.groupId === 0) {
            console.log('filter1 section ', section)
            sectionMatches = true
          } else {
            // Loop over sub-sections
            for (let subIdx = 0; subIdx < section.subSections.length; ++subIdx) {
              const subSection = section.subSections[subIdx]
              // If matching -> return the parent section
              if (this.$store.state.progression.filterFolder.folderId !== 0 &&
                  subSection.folderId === this.$store.state.progression.filterFolder.folderId &&
                  this.$store.state.progression.filterCours.groupId === 0) {
                console.log('filter2 section ', section)
                sectionMatches = true
              } else if (this.$store.state.progression.filterCours.groupId !== 0) {
                // Filter cours is selected -> loop over items
                for (let itemIdx = 0; itemIdx < subSection.items.length; ++itemIdx) {
                  const item = subSection.items[itemIdx]
                  // Loop over assignments to match cours name
                  const assignmentIndex = item.assignments.map(assignment => assignment.coursName).indexOf(this.$store.state.progression.filterCours.name)
                  if (assignmentIndex !== -1) {
                    console.log('filter3 section ', section)
                    coursMatches = true
                  }
                }
              }
            }
          }
          if (sectionMatches && coursMatches) {
            filteredSections.push(section)
          }
        }
        console.log('returning filteredSections=', filteredSections)
        return filteredSections
      }
    }
  },
  mounted () {
    // this.selectedCours = { groupName: this.$t('all-cours'), groupId: 0 }
    // this.selectedFolder = { name: this.$t('whole-progression'), folderId: 0 }
  },
  methods: {
    onFolderSelect (folder) {
      this.selectedFolder = folder
      console.log('onFolderSelect folder=', folder)
      this.$store.dispatch('progression/setFilterFolder', folder)
    },
    onCoursSelect (cours) {
      this.selectedCours = cours
      console.log('onCoursSelect cours=', cours)
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
