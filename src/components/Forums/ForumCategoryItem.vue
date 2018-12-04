<template>
  <div>
    <h5>{{ entry.name }} -- {{ entry.type }}</h5>
    <i class="fa fa-folder-open" />
    <span>{{ entry.description }}</span>
    TODO label
  </div>
</template>

<script>
export default {
  name: 'ForumCategoryItem',
  props: {
    entry: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
