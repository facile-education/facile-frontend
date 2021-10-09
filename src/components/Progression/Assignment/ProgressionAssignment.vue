<template>
  <div class="assignment">
    <div
      class="filters"
    >
      <PentilaDropdown
        v-model="selectedSection"
        class="filter"
        :list="progressionFolders"
        display-field="name"
      />
      <PentilaDropdown
        v-model="selectedSession"
        class="filter"
        :list="sessionList"
      />
    </div>
    <div
      v-for="section in progression.sections"
      :key="section.folderId"
      class="section"
    >
      <SectionAssignment
        :section="section"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProgressionAssignment',
  components: { },
  props: {
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
</style>

<i18n locale="fr">
{
  "add": "Créer",
}
</i18n>
