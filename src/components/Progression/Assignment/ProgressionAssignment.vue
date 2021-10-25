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
        :sort="false"
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
import _ from 'lodash'

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
      const orderedSections = _.orderBy(this.progression.sections, 'order', 'asc')
      const allFolders = [{ name: this.$t('whole-progression'), folderId: 0 }]
      // Loop over sections
      for (let sectionIdx = 0; sectionIdx < orderedSections.length; ++sectionIdx) {
        const section = orderedSections[sectionIdx]
        allFolders.push(section)
        Array.prototype.push.apply(allFolders, section.subSections)
      }
      return allFolders
    },
    coursList () {
      const cours = [{ groupName: this.$t('all-cours'), groupId: 0 }]
      // Filter cours with current progression's volee
      for (let idx = 0; idx < this.$store.state.progression.teacherGroups.length; ++idx) {
        const school = this.$store.state.progression.teacherGroups[idx]

        // Personal groups -> add all
        if (school.schoolId === undefined || school.schoolId === 0) {
          Array.prototype.push.apply(cours, school.groups)
        } else {
          // Loop over school's cours and filter by current progression's volee
          for (let j = 0; j < school.groups.length; j++) {
            if (school.groups[j].groupName.includes(this.$store.state.progression.currentProgression.volee)) {
              cours.push(school.groups[j])
            }
          }
        }
      }

      return cours
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
      if (this.progression.sections !== undefined) {
        for (let sectionIdx = 0; sectionIdx < this.progression.sections.length; ++sectionIdx) {
          const section = this.progression.sections[sectionIdx]

          // Add section if both folder name and cours name match at section level
          if (this.$store.state.progression.filterFolder.folderId === 0 || section.folderId === this.$store.state.progression.filterFolder.folderId) {
            filteredSections.push(section)
          } else {
            // Test at sub-section level -> loop over sub-sections
            for (let subIdx = 0; subIdx < section.subSections.length; ++subIdx) {
              const subSection = section.subSections[subIdx]
              if (this.$store.state.progression.filterFolder.folderId === 0 || subSection.folderId === this.$store.state.progression.filterFolder.folderId) {
                filteredSections.push(section)
              }
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
