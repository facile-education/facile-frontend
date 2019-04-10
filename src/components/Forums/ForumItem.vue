<template>
  <li
    class="forum theme-hover-background-color"
    @click="selectForum"
  >
    {{ forum.displayText }}
  </li>
</template>

<script>
export default {
  name: 'ForumItem',
  props: {
    forum: {
      type: Object,
      required: true
    }
  },
  methods: {
    selectForum () {
      // Set selected forum
      this.$store.dispatch('forums/getForumEntryList')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.forum {
  @extend %no-text-highlight;
}
</style>
