<template>
  <div>
    <NewsItem
      v-for="news in newsList"
      :key="news.blogEntryId"
      :news="news"
      class="news-list"
    />
  </div>
</template>

<script>
import NewsItem from '@/components/News/NewsItem'

export default {
  name: 'NewsList',
  components: {
    NewsItem
  },
  props: {
    isHeadMaster: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    newsList () {
      if (this.isHeadMaster) {
        return this.$store.state.news.newsHMList
      }
      return this.$store.state.news.newsList
    }
  },
  created () {
    if (this.newsList === undefined) {
      this.$store.dispatch('news/getNewsList', this.isHeadMaster)
    }
  }
}
</script>

<style lang="scss" scoped>
.news-list {
  //IE 11
  display: flex;
  margin-bottom: 5px;
}
</style>
