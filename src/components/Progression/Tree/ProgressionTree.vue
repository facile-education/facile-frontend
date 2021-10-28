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
  computed: {
    progression () {
      return this.$store.state.progression.currentProgression
    }
  }
}
</script>

<style lang="scss" scoped>

.tree {
  padding-left: 25px;

  .summary {
    text-align: center;
    margin-top: 24px;
    height: 48px;
    display: flex;
    align-items: center;
  }
}
</style>

<i18n locale="fr">
{
  "summary": "Sommaire"
}
</i18n>
