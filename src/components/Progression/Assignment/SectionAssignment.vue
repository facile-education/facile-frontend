<template>
  <div class="section-assignment">
    <span>{{ section.name }}</span>
    <hr>
    <div v-if="filteredSubSections">
      <SubSectionAssignment
        v-for="subSection in filteredSubSections"
        :key="subSection.folderId"
        :sub-section="subSection"
        class="subSection"
      />
    </div>
    <div v-if="filteredSectionItems.length > 0">
      <ItemAssignment
        v-for="item in filteredSectionItems"
        :key="item.itemId"
        :item="item"
        class="item"
      />
    </div>
  </div>
</template>

<script>
import SubSectionAssignment from '@/components/Progression/Assignment/SubSectionAssignment'
import ItemAssignment from '@/components/Progression/Assignment/ItemAssignment'

export default {
  name: 'SectionAssignment',
  components: { SubSectionAssignment, ItemAssignment },
  props: {
    section: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    progression () {
      return this.$store.state.progression.currentProgression
    },
    filteredSubSections () {
      const filteredSubSections = []
      const sectionNameMatches = this.$store.state.progression.filterFolder.folderId === 0 || this.section.folderId === this.$store.state.progression.filterFolder.folderId
      // Loop over sub-sections
      for (let subIdx = 0; subIdx < this.section.subSections.length; ++subIdx) {
        const subSection = this.section.subSections[subIdx]
        const subSectionNameMatches = this.$store.state.progression.filterFolder.folderId === 0 || subSection.folderId === this.$store.state.progression.filterFolder.folderId

        // Sub-section matches if its name (or parent's section name) matches and its cours matches
        if (sectionNameMatches || subSectionNameMatches) {
          filteredSubSections.push(subSection)
        }
      }
      return filteredSubSections
    },
    filteredSectionItems () {
      return this.section.items
      // const sectionNameMatches = this.$store.state.progression.filterFolder.folderId === 0 || this.section.folderId === this.$store.state.progression.filterFolder.folderId
      // if (!sectionNameMatches) {
      //   // If section is not selected -> skip all
      //   return []
      // } else if (this.$store.state.progression.filterCours.groupId === 0) {
      //   // Else if no cours filter -> add all items
      //   return this.section.items
      // }
      // const filteredItems = []
      // for (let itemIdx = 0; itemIdx < this.section.items.length; ++itemIdx) {
      //   const item = this.section.items[itemIdx]
      //   // Loop over assignments to match cours name
      //   const assignmentIndex = item.assignments.map(assignment => assignment.groupName).indexOf(this.$store.state.progression.filterCours.groupName)
      //   if (assignmentIndex !== -1) {
      //     filteredItems.push(item)
      //   }
      // }
      // return filteredItems
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.section-assignment {
  margin-top: 10px;
  span {
    margin-top:10px;
    font-size: 18px;
    font-weight: 500;
    text-transform: uppercase;
  }
  hr {
    margin-top: 10px;
    margin-right: 20px;
    border: 0;
    border-top: 1px solid #D4D4D4;
  }
  .subSection {
    margin-top:10px;
    margin-bottom:10px;
  }
  .item {
    margin-top:10px;
    margin-bottom:10px;
  }
}
</style>

<i18n locale="fr">
{
  "add": "Créer",
}
</i18n>
