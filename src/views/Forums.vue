<template>
  <div class="forums">
    <ForumList class="list" />
    <ForumDetails class="details" />
  </div>
</template>

<script>
import ForumList from '@/components/Forums/ForumList'
import ForumDetails from '@/components/Forums/ForumDetails'

export default {
  name: 'Forums',
  components: {
    ForumList,
    ForumDetails
  }
}
</script>

<style lang="scss" scoped>
.forums {
  display: flex;
  height: 80vh;
}

.list {
  flex: 1;
  min-width: 0;
  height: 80vh;
}

.details {
  flex: 3;
  min-width: 0;
  height: 80vh;
}
</style>
