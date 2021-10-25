<template>
  <div class="subsection-assignment">
    <span>{{ subSection.name }}</span>
    <div v-if="filteredItems">
      <ItemAssignment
        v-for="item in filteredItems"
        :key="item.itemId"
        :item="item"
        class="item"
      />
    </div>
  </div>
</template>

<script>
import ItemAssignment from '@/components/Progression/Assignment/ItemAssignment'

export default {
  name: 'SubSectionAssignment',
  components: { ItemAssignment },
  props: {
    subSection: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    filteredItems () {
      return this.subSection.items
      // if (this.$store.state.progression.filterCours.groupId === 0) {
      //   // No cours selected -> all items
      //   return this.subSection.items
      // } else {
      //   const filteredItems = []
      //   for (let itemIdx = 0; itemIdx < this.subSection.items.length; ++itemIdx) {
      //     const item = this.subSection.items[itemIdx]
      //     // Loop over assignments to match cours name
      //     const assignmentIndex = item.assignments.map(assignment => assignment.groupName).indexOf(this.$store.state.progression.filterCours.groupName)
      //     if (assignmentIndex !== -1) {
      //       filteredItems.push(item)
      //     }
      //   }
      //   return filteredItems
      // }
    }

  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
span {
  margin-top:10px;
  margin-bottom:10px;
  font-size: 14px;
  font-weight: 500;
}
.item {
  margin-top:10px;
  margin-bottom:10px;
}
</style>

<i18n locale="fr">
{
  "add": "Créer",
}
</i18n>
