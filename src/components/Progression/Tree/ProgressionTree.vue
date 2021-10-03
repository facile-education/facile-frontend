<template>
  <div
    class="tree"
  >
    <p
      class="expand-all"
      @click="expandAll"
    >
      Tout afficher
    </p>

    <!-- Sections -->
    <ProgressionTreeSection
      v-for="section in progression.sections"
      :key="section.folderId"
      :section="section"
      class="section"
    />
  </div>
</template>

<script>
import ProgressionTreeSection from '@/components/Progression/Tree/ProgressionTreeSection'

export default {
  name: 'ProgressionTree',
  components: { ProgressionTreeSection },
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
    expandAll () {
    }
  }
}
</script>

<style lang="scss" scoped>
.expand-all {
  margin-left: 10px;
}
.section {
  margin-left: 10px;
}
</style>

<i18n locale="fr">
{
  "add": "Créer",
}
</i18n>
