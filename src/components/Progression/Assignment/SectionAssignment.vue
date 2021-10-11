<template>
  <div class="section-assignment">
    <span>{{ section.name }}</span>
    <hr>
    <SubSectionAssignment
      v-for="subSection in section.subSections"
      :key="subSection.folderId"
      :sub-section="subSection"
      class="subSection"
    />
    <ItemAssignment
      v-for="item in section.items"
      :key="item.itemId"
      :item="item"
      class="item"
    />
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
  margin-left:10px;
}
hr {
  margin-top: 10px;
  margin-right: 20px;
  border: 0;
  border-top: 1px solid #D4D4D4;
}
.subSection {
  margin-top:10px;
  margin-left:10px;
  margin-bottom:10px;
}
.item {
  margin-top:10px;
  margin-left:10px;
  margin-bottom:10px;
}
</style>

<i18n locale="fr">
{
  "add": "Créer",
}
</i18n>
