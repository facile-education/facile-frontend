<template>
  <ServicesWrapper
    :is-title-visible="false"
  >
    <AllAnnouncementsHeader
      :nb-new-announcements="nbNewAnnouncements"
      :un-read-only="unReadOnly"
      @toggle-read-only="toggleReadOnly"
      @create-announcement="refresh"
    />

    <div
      class="body"
      :class="{'details-display' : isDetailsPanelDisplayed}"
    >
      <div class="announcements-list">
        <div
          v-if="isLoading"
          class="placeholder"
        >
          <WeprodeSpinner />
        </div>
        <div
          v-if="error === true"
          v-t="'AllAnnouncements.errorPlaceholder'"
          class="placeholder"
        />
        <div
          v-else-if="announcementsList.length === 0"
          v-t="'AllAnnouncements.emptyPlaceholder'"
          class="placeholder"
        />
        <div
          v-else
          ref="scroll"
          class="scroll"
          @scroll="handleScroll"
        >
          <AnnouncementItem
            v-for="announcement in announcementsList"
            :key="announcement.newsId"
            :announcement="announcement"
            :is-selection-mode="isDetailsPanelDisplayed"
            :is-selected="selectedAnnouncement && selectedAnnouncement.newsId === announcement.newsId"
            :is-last="isLastDisplayed(announcement)"
            @update-announcement="refresh"
            @delete-announcement="refresh"
            @select="selectedAnnouncement=announcement"
            @mark-as-read="markAnnouncementAsRead(announcement)"
            @get-next-announcements="loadAnnouncements"
          />
        </div>
      </div>

      <NewsDetails
        v-if="selectedAnnouncement && isDetailsPanelDisplayed"
        :init-news="selectedAnnouncement"
        @update="refresh"
        @delete="deleteAnnouncement"
      />
      <div
        v-if="!selectedAnnouncement && isDetailsPanelDisplayed"
        v-t="'AllAnnouncements.detailsPlaceholder'"
        class="details-placeholder"
      />
    </div>
  </ServicesWrapper>
</template>

<script>
import AllAnnouncementsHeader from '@components/Dashboard/AnnouncementsWidget/AllAnnouncements/AllAnnouncementsHeader.vue'
import AnnouncementItem from '@components/Dashboard/AnnouncementsWidget/AnnouncementItem.vue'
import NewsDetails from '@components/Dashboard/AnnouncementsWidget/NewsDetails.vue'
import dayjs from 'dayjs'

import { getSchoolNews } from '@/api/dashboard/news.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import { allAnnouncementsPaginationSize } from '@/constants/dashboardConstants'

import ServicesWrapper from '../../components/ServicesWrapper/ServicesWrapper.vue'
let oldScrollTop = 0

export default {
  name: 'AllAnnouncements',
  components: { NewsDetails, AllAnnouncementsHeader, AnnouncementItem, WeprodeSpinner, ServicesWrapper },
  inject: ['mq'],
  emits: ['update:layout'],
  data () {
    return {
      ended: false,
      unReadOnly: false,
      isLoading: false,
      nbNewAnnouncements: 0,
      error: undefined,
      announcementsList: [],
      selectedAnnouncement: undefined
    }
  },
  computed: {
    isDetailsPanelDisplayed () {
      return !(this.mq.phone || this.mq.tablet)
    }
  },
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  },
  created () {
    this.loadAnnouncements()
  },
  methods: {
    markAnnouncementAsRead (announcement) {
      announcement.hasRead = true
      this.nbNewAnnouncements--
    },
    isLastDisplayed (announcement) {
      return this.announcementsList[this.announcementsList.length - 1].newsId === announcement.newsId // Assume display order is the same as announcementsList order
    },
    toggleReadOnly () {
      this.unReadOnly = !this.unReadOnly
      this.refresh()
    },
    refresh () {
      this.ended = false
      this.announcementsList = []
      this.loadAnnouncements()
    },
    deleteAnnouncement () {
      this.selectedAnnouncement = undefined
      this.refresh()
    },
    handleScroll () {
      const scroll = this.$refs.scroll
      if (scroll.scrollTop > oldScrollTop) { // if we go down
        const nbPixelsBeforeBottom = scroll.scrollHeight - (scroll.scrollTop + scroll.clientHeight)

        if (nbPixelsBeforeBottom <= 5) {
          if (!this.isLoading && !this.ended) {
            this.loadAnnouncements()
          }
        }
      }
      oldScrollTop = scroll.scrollTop
    },
    loadAnnouncements () {
      if (this.ended) {
        return
      }
      this.isLoading = true
      getSchoolNews(dayjs(), this.announcementsList.length, allAnnouncementsPaginationSize, false, this.unReadOnly).then((data) => {
        this.isLoading = false
        if (data.success) {
          if (data.news.length < allAnnouncementsPaginationSize) {
            this.ended = true
          }
          this.error = false
          this.announcementsList = this.announcementsList.concat(data.news)
          this.nbNewAnnouncements = data.nbUnreadNews

          // Handle selection
          if (this.isDetailsPanelDisplayed && this.selectedEvent === undefined && this.announcementsList.length > 0 && !this.unReadOnly) {
            this.selectedAnnouncement = this.announcementsList[0]
          }
        } else {
          this.error = true
          console.error('Error')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.body {
  height: calc(100% - $all-events-header-height);
}

.announcements-list {
  height: 100%;
}

.scroll {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.body.details-display{
  display: flex;
  padding-top: 20px;

  .announcements-list {
    min-width: calc($announcement-item-min-width + 20px);
    width: 33%;
    position: relative;
    margin-right: 20px;
  }

  .details-placeholder {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20vh;
    font-size: 1.25em;
  }
}
</style>
