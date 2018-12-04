<template>
  <div>
    <h5>{{ entry.name }} -- {{ entry.type }}</h5>
    <i class="fa fa-comment" />
    <span>{{ entry.description }}</span>
    TODO label
    views : {{ entry.viewCount }}
    publications : {{ entry.messageCount }}
    non read : {{ entry.nbMessageNew }}
  </div>
</template>

<script>
export default {
  name: 'ForumThreadItem',
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
