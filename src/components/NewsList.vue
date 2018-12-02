<template>
  <div>
    <div
      v-for="aNews in news"
      :key="aNews.blogEntryId"
      class="news">
      <NeroWindow
        v-if="aNews.showDetails"
        :modal="true"
        @close="hideModal(aNews)">
        <span slot="header">News content</span>
        <div
          slot="body"
          v-html="aNews.content"/>
      </NeroWindow>
      <div
        v-if="hasThumbnail(aNews)"
        class="thumbnail">
        <img src="../assets/logo.png">
      </div>
      <div class="text">
        <h4
          class="title"
          @click="showModal(aNews)">
          {{ aNews.title }}
        </h4>
        <p class="content">
          {{ aNews.ellipsise }}
        </p>
        <div class="author">
          {{ aNews.author }} {{ aNews.date }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import news from '@/api/news'
import NeroWindow from '@/components/NeroWindow'

export default {
  name: 'NewsList',
  components: {
    NeroWindow
  },
  props: {
    isHeadMaster: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      news: news.newsGroup
    }
  },
  methods: {
    hasThumbnail (aNews) {
      return (aNews.thumbnail.url !== undefined)
    },
    showModal (aNews) {
      console.log('showDetails true')
      aNews.title = 'toto'
      aNews.showDetails = true
    },
    hideModal (aNews) {
      console.log('showDetails false')
      aNews.title = 'Shit'
      aNews.showDetails = false
    }
  }
}
</script>

<style lang="scss" scoped>
.news {
  //IE 11
  display: flex;
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 9px;
  padding-bottom: 9px;
}

.thumbnail {
  overflow: hidden;
  border-radius: 15%;
  min-width: 100px;
  padding-right: 15px;

  img {
    max-height: 100px;
    max-width: 100px;
  }
}

.title {
  margin: 0 0 2px 0;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}

.content {
  margin: 0;
}

</style>
