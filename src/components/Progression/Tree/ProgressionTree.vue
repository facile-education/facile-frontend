<template>
  <div
    class="tree"
  >
    <div
      class="summary"
    >
      {{ $t('summary') }}
    </div>

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
  }
}
</script>

<style lang="scss" scoped>
.tree {

  .summary {
    text-align: center;
    margin-top: 25px;
    margin-bottom: 10px;
  }
  .section {
    margin-left: 10px;
  }
}
</style>

<i18n locale="fr">
{
  "add": "Créer",
  "summary": "Sommaire"
}
</i18n>
