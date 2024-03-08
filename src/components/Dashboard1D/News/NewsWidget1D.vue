<template>
  <section
    data-test="news-widget-1D"
    class="news-widget-1D"
    :class="{'not-empty' : announcementsList.length > 0}"
  >
    <NewsHeader1D
      :nb-new-announcements="nbUnreadAnnouncements"
      :un-read-only="unReadOnly"
      :is-displayed-show-more="announcementsList.length > 0"
      @update-unread-only="updateUnreadOnlyValue"
      @create-announcement="refresh"
    />
    <div
      v-if="error === true"
      v-t="'Dashboard.AnnouncementsWidget.errorPlaceholder'"
      class="placeholder"
    />
    <div
      v-else-if="announcementsList.length === 0"
      v-t="'Dashboard.AnnouncementsWidget.emptyPlaceholder'"
      class="placeholder"
    />
    <ul
      v-else
      ref="announcementsList"
      class="announcements-list"
    >
      <li
        v-for="(announcement, index) in announcementsList"
        :key="index"
      >
        <NewsItem1D
          :announcement="announcement"
          @mark-as-read="markAsRead(announcement)"
          @update-announcement="refresh"
          @delete-announcement="refresh"
          @refresh="refresh"
        />
      </li>
    </ul>
  </section>
</template>

<script>
import dayjs from 'dayjs'

import { getSchoolNews } from '@/api/dashboard/news.service'
import { nbAnnouncementsInWidget } from '@/constants/dashboardConstants'

import NewsHeader1D from './NewsHeader1D.vue'
import NewsItem1D from './NewsItem1D.vue'

export default {
  name: 'NewsyWidget1D',
  components: {
    NewsHeader1D,
    NewsItem1D
  },
  inject: ['mq'],
  data () {
    return {
      unReadOnly: false,
      announcementsList: [],
      nbUnreadAnnouncements: 0,
      isLoading: false,
      isFirstLoad: true,
      error: false
    }
  },
  created () {
    this.loadAnnouncements()
  },
  methods: {
    loadAnnouncements () {
      this.isLoading = true
      getSchoolNews(dayjs(), 0, nbAnnouncementsInWidget, false, this.unReadOnly).then((data) => {
        this.isLoading = false
        this.isFirstLoad = false
        if (data.success) {
          this.error = false
          this.announcementsList = data.news
          this.nbUnreadAnnouncements = data.nbUnreadNews
        } else {
          this.error = true
          console.error('Error')
        }
      }, (err) => {
        this.isLoading = false
        this.error = true
        console.error(err)
      })
    },
    refresh () {
      this.loadAnnouncements()
    },
    updateUnreadOnlyValue (value) {
      this.unReadOnly = value
      this.refresh()
    },
    markAsRead (announcement) {
      announcement.hasRead = true
      if (this.nbUnreadAnnouncements >= 1) {
        this.nbUnreadAnnouncements--
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';
.news-widget-1D{
  flex: 1;
  overflow: hidden;
  @extend %widget;
}

.placeholder {
  @extend %content-placeholder;
}

.announcements-list {
  position: relative;
  overflow-y: auto;
  margin: 0;
  list-style-type: none;
  padding-left: 0;
  height: calc(100% - 50px);
}

@media screen and (max-width: 1260px) {
  .news-widget-1D{
    overflow: visible;
  }

  .announcements-list{
    height: calc(100% - 50px);
    overflow: visible;
  }
}
</style>
