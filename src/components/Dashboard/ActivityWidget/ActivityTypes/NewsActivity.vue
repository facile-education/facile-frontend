<template>
  <div
    class="news"
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <!-- Image -->
    <div class="news-thumbnail-wrapper">
      <img
        v-if="news.thumbnail && news.thumbnail.url"
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
          - {{ convertDateStr(news.publicationDate) }}
        </span>
        <i
          v-if="news.hasAttachFiles"
          class="fa fa-paperclip theme-color"
        />
      </div>
    </div>

    <div
      v-if="isHovering"
      class="edit-buttons"
    >
      <div
        v-if="news.isEditor || isAuthor(news)"
        class="content-button"
        :title="$t('edit')"
        @click="editContent()"
      >
        <img
          src="@/assets/edit.svg"
          :alt="$t('edit')"
        >
      </div>
      <div
        v-if="isAuthor(news)"
        class="content-button"
        :title="$t('delete')"
        @click="confirmNewsDeletion()"
      >
        <img
          src="@/assets/trash.svg"
          :alt="$t('delete')"
        >
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getNewsDetails } from '@/api/dashboard/news.service'

export default {
  name: 'NewsActivity',
  props: {
    news: {
      type: Object,
      required: true
    }
  },
  emits: ['editNews'],
  data () {
    return {
      isHovering: false
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    convertDateStr (dateStr) {
      return dayjs(dateStr, 'YYYY-MM-DD HH:mm').format('DD MMM YYYY HH:mm')
    },
    isAuthor (news) {
      return news.authorId === this.$store.state.user.userId
    },
    editContent () {
      getNewsDetails(this.news.newsId).then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('dashboard/setNewsDetails', { news: this.news, groups: data.broadcastedGroups, attachFiles: data.attachedFiles, doSetEditedNews: true }).then(
              () => {
                this.$emit('editNews')
              }
            )
          }
        })
    },
    confirmNewsDeletion () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('deleteNewsWarning'),
        lastAction: { fct: this.deleteNews }
      })
    },
    deleteNews () {
      this.$store.dispatch('dashboard/deleteNews', { newsId: this.news.newsId })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design/index';

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
  "groups-activity": "Fil d'activité de mes groupes",
  "edit": "Modifier cette actualité",
  "delete": "Supprimer cette actualité",
  "deleteContentWarning": "Supprimer cette actualité ?"
}
</i18n>