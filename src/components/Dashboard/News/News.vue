<template>
  <div
    class="news"
  >
    <!-- Image -->
    <div class="news-thumbnail-wrapper">
      <img
        v-if="news.thumbnail.url"
        class="news-thumbnail"
        :src="news.thumbnail.url"
      >
    </div>

    <div class="news-other">
      <span class="news-title">{{ news.title }}</span>
      <span class="news-content">{{ news.ellipsise }}</span>

      <div class="news-info">
        <span class="author">
          {{ news.author }}
        </span>
        <span class="date">
          - {{ convertDateStr(news.date) }}
        </span>
        <i
          v-if="news.hasAttachFiles"
          class="fa fa-paperclip theme-color"
        />
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'News',
  props: {
    news: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    convertDateStr (dateStr) {
      return dayjs(dateStr, 'YYYY-MM-DD HH:mm').format('DD MMM YYYY HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.news {
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  .news-thumbnail-wrapper {
    display: flex;
    padding: 5px;
    .news-thumbnail {
      margin: auto;
      width: 60px;
      height: 60px;
    }
  }
  .news-other {
    width: 100%;
    display: flex;
    flex-direction: column;
    .news-title {
      font-weight: bold;
    }
    .news-content {
      font-size: 0.8em;
    }
    .news-info {

    }
  }
}
</style>

<i18n locale="fr">
{
  "groups-activity": "Fil d'activité de mes groupes"
}
</i18n>
