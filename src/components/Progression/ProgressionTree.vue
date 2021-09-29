<template>
  <p>Tree</p>
</template>

<script>

export default {
  name: 'ProgressionTree',
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
