<template>
  <div>
    <div class="breadcrumb">
      Home -> niveau1 -> niveau2...
    </div>
    <div>Action bar -> Add dropdown / Sort (name, new messages, no sort) / Search / Return</div>
    <ForumEntryList />
  </div>
</template>

<script>
import ForumEntryList from '@/components/Forums/ForumEntryList'

export default {
  name: 'ForumThreads',
  components: {
    ForumEntryList
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  color: grey;
}
</style>
