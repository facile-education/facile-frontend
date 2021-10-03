<template>
  <div class="items-list">
    <p>Assignment</p>
    <div
      v-for="item in itemList"
      :key="item.itemId"
      class="item"
    >
      <h4>
        {{ item.name }}
      </h4>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProgressionAssignmentMode',
  components: { },
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
