<template>
  <div class="forum-list">
    <h3 v-t="'Forums.ForumList.title'" />
    <ul class="list">
      <ForumItem
        v-for="(forum, index) in forumList"
        :key="index"
        :forum="forum"
      />
    </ul>
  </div>
</template>

<script>
import ForumItem from '@/components/Forums/ForumItem'

export default {
  name: 'ForumList',
  components: {
    ForumItem
  },
  computed: {
    forumList () {
      return this.$store.state.forums.forumList
    }
  },
  created () {
    if (this.forumList === undefined) {
      this.$store.dispatch('forums/initForumList')
    }
  }
}

/**
  //Ajout de mes abonnements
  cur.put("id", -2);
  cur.put("displayText", messages.getString("Mes-Abonnements"));
  cur.put("type", "subsc");
  curr.put("isAdmin", false);
  + nbNotifications
 */
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.forum-list {
  background-color: $background-white-color;
  border: $border;
  width: 300px;
}

.list {
  list-style: none;
  padding: 0;
}
</style>
