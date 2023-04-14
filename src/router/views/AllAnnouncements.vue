<template>
  <Layout>
    <AllAnnouncementsHeader
      :nb-new-announcements="nbNewAnnouncements"
      :un-read-only="unReadOnly"
      @toggleReadOnly="toggleReadOnly"
      @createAnnouncement="refresh"
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
          <PentilaSpinner />
        </div>
        <div
          v-if="error === true"
          v-t="'errorPlaceholder'"
          class="placeholder"
        />
        <div
          v-else-if="announcementsList.length === 0"
          v-t="'emptyPlaceholder'"
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
            @updateAnnouncement="refresh"
            @deleteAnnouncement="refresh"
            @select="selectedAnnouncement=announcement"
            @markAsRead="announcement.hasRead=true"
            @getNextAnnouncements="loadAnnouncements"
          />
        </div>
      </div>

      <AnnouncementDetails
        v-if="selectedAnnouncement && isDetailsPanelDisplayed"
        :init-announcement="selectedAnnouncement"
        @update="refresh"
        @delete="deleteAnnouncement"
      />
      <div
        v-if="!selectedAnnouncement && isDetailsPanelDisplayed"
        v-t="'detailsPlaceholder'"
        class="details-placeholder"
      />
    </div>
  </Layout>
</template>

<script>
import Layout from '@layouts/BannerLayout.vue'
import AnnouncementItem from '@components/Dashboard/Announcements/AnnouncementItem.vue'
import AnnouncementDetails from '@components/Dashboard/Announcements/AnnouncementDetails.vue'
import dayjs from 'dayjs'
import { getSchoolNews } from '@/api/dashboard/news.service'
import { allAnnouncementModalPaginationSize } from '@/constants/dashboardConstants'
import AllAnnouncementsHeader from '@components/Dashboard/Announcements/AllAnnouncements/AllAnnouncementsHeader.vue'
let oldScrollTop = 0

export default {
  name: 'AllAnnouncements',
  components: { AllAnnouncementsHeader, AnnouncementDetails, AnnouncementItem, Layout },
  inject: ['mq'],
  data () {
    return {
      unReadOnly: false,
      isLoading: false,
      nbNewAnnouncements: 0,
      error: undefined,
      announcementsList: [],
      fromDate: dayjs(),
      selectedAnnouncement: undefined
    }
  },
  computed: {
    isDetailsPanelDisplayed () {
      return !(this.mq.phone || this.mq.tablet)
    }
  },
  created () {
    this.loadAnnouncements()
  },
  methods: {
    isLastDisplayed (announcement) {
      return this.announcementsList[this.announcementsList.length - 1].newsId === announcement.newsId // Assume display order is the same as announcementsList order
    },
    toggleReadOnly () {
      this.unReadOnly = !this.unReadOnly
      this.refresh()
    },
    refresh () {
      this.fromDate = dayjs()
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
          if (!this.isLoading) {
            this.loadAnnouncements()
          }
        }
      }
      oldScrollTop = scroll.scrollTop
    },
    loadAnnouncements () {
      this.isLoading = true
      getSchoolNews(this.fromDate, allAnnouncementModalPaginationSize, false, this.unReadOnly).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.announcementsList = this.announcementsList.concat(data.news)
          this.nbNewAnnouncements = data.nbUnreadNews
          // Update pagination
          if (data.news.length > 0) {
            this.fromDate = dayjs(data.news[data.news.length - 1].publicationDate) // Assume they are sorted by date, so take the last announcement date
          }
          // TODO Handle selection like in events?
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

.body.details-display{
  height: calc(100% - $all-events-header-height);
  display: flex;
  padding-top: 20px;

  .announcements-list {
    min-width: 33%;
    position: relative;
    margin-right: 20px;
  }

  .scroll {
    height: 100%;
    overflow-y: auto;
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

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucune annonce publiée",
  "detailsPlaceholder": "Veuillez séléctionner une annonce"
}
</i18n>
