<template>
  <div
    class="tree"
  >
    <ProgressionCreateButton class="create-button" />

    <div
      class="summary"
    >
      {{ $t('summary') }}
    </div>

    <!-- Sections -->
    <ProgressionTreeSection
      v-for="(section, index) in progression.sections"
      :key="section.folderId"
      :index="index"
      :section="section"
      :is-last="index === (progression.sections.length - 1)"
      class="section"
    />
  </div>
</template>

<script>
import ProgressionTreeSection from '@/components/Progression/Tree/ProgressionTreeSection'
import ProgressionCreateButton from '@components/Progression/Tree/ProgressionCreateButton'

export default {
  name: 'ProgressionTree',
  components: { ProgressionCreateButton, ProgressionTreeSection },
  computed: {
    progression () {
      return this.$store.state.progression.currentProgression
    }
  }
}
</script>

<style lang="scss" scoped>

.tree {
  padding-left: 20px;

  .create-button {
    height: 62px;
    margin-top: 15px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
  }

  .summary {
    text-align: center;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
}
</style>

<i18n locale="fr">
{
  "summary": "Sommaire"
}
</i18n>
