<template>
  <div
    class="progression-item"
  >
    <p>1 item</p>
  </div>
</template>

<script>

export default {
  name: 'ProgressionItem',
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
.progression-item {
  height: 400px;
  width: 100%;
  border: 1px solid black;
}
</style>

<i18n locale="fr">
{
  "add": "Créer",
}
</i18n>
