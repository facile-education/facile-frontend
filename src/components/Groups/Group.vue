<template>
  <div>{{ group.name }}</div>
</template>

<script>
export default {
  name: 'Group',
  props: {
    groupId: {
      type: Number,
      required: true
    }
  },
  computed: {
    group () {
      return this.$store.state.groups.currentGroup
    }
  },
  created () {
    this.$store.dispatch('group/getGroup', this.groupId)
  }
}
</script>

<style lang="scss" scoped>

</style>
