<template>
  <div class="entry">
    <ForumCategoryItem
      v-if="isCategory"
      :entry="entry"
    />
    <ForumThreadItem
      v-else
      :entry="entry"
    />
  </div>
</template>

<script>
import ForumCategoryItem from '@/components/Forums/ForumCategoryItem'
import ForumThreadItem from '@/components/Forums/ForumThreadItem'

export default {
  name: 'ForumEntryItem',
  components: {
    ForumCategoryItem,
    ForumThreadItem
  },
  props: {
    entry: {
      type: Object,
      required: true
    }
  },
  computed: {
    isCategory () {
      return this.entry.type.toLowerCase() === 'category'
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.entry {
  border-bottom: $border;
  height: 60px;
  padding-left: 6px;
}
</style>
