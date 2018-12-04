<template>
  <div>
    <ForumEntryItem
      v-for="(entry, index) in entryList"
      :key="index"
      :entry="entry"
    />
  </div>
</template>

<script>
import ForumEntryItem from '@/components/Forums/ForumEntryItem'

export default {
  name: 'ForumEntryList',
  components: {
    ForumEntryItem
  },
  computed: {
    entryList () {
      return this.$store.state.forums.entryList
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
