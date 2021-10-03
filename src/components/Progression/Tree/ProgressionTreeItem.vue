<template>
  <div
    class="tree-item"
  >
    <p>{{ item.name }}</p>
  </div>
</template>

<script>

export default {
  name: 'ProgressionTreeItem',
  components: { },
  props: {
    item: {
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
.tree-item {
  margin-left: 30px;
}
</style>

<i18n locale="fr">
{
}
</i18n>
