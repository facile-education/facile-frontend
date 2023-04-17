<template>
  <section>
    <AnnouncementsHeader
      :nb-new-announcements="nbUnreadAnnouncements"
      :un-read-only="unReadOnly"
      @updateUnreadOnly="updateUnreadOnlyValue"
      @createAnnouncement="refresh"
    />
    <PentilaSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
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
      class="test"
    >
      <div
        v-if="displayLeftLinear"
        class="left-linear"
      />

      <div
        ref="announcementsList"
        class="announcements-list"
        @scroll="updateScrollPosition"
      >
        <AnnouncementItem
          v-for="(announcement, index) in announcementsList"
          :key="index"
          :announcement="announcement"
          :is-in-horizontal-scroll="true"
          @markAsRead="announcement.hasRead=true"
          @updateAnnouncement="refresh"
          @deleteAnnouncement="refresh"
        />
      </div>

      <div
        v-if="displayRightLinear"
        class="right-linear"
      />

      <div class="footer">
        <button
          v-t="'showMore'"
          class="show-more"
          @click="showMore"
        />
      </div>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { nbAnnouncementsInWidget } from '@/constants/dashboardConstants'
import AnnouncementsHeader from '@components/Dashboard/Announcements/AnnouncementsHeader.vue'
import { getSchoolNews } from '@/api/dashboard/news.service'
import AnnouncementItem from '@components/Dashboard/Announcements/AnnouncementItem.vue'

export default {
  name: 'AnnouncementsWidget',
  components: { AnnouncementItem, AnnouncementsHeader },
  data () {
    return {
      unReadOnly: false,
      announcementsList: [],
      nbUnreadAnnouncements: 0,
      isLoading: false,
      error: false,
      isAllAnnouncementsModalDisplayed: false,
      displayLeftLinear: false,
      displayRightLinear: true
    }
  },
  computed: {
    fromDate () {
      return dayjs()
    }
  },
  created () {
    this.loadAnnouncements()
  },
  methods: {
    updateScrollPosition () {
      const scrollLeft = this.$refs.announcementsList.scrollLeft
      this.displayLeftLinear = scrollLeft > 0
      this.displayRightLinear = scrollLeft < this.$refs.announcementsList.scrollWidth - this.$refs.announcementsList.getBoundingClientRect().width
    },
    updateUnreadOnlyValue (value) {
      this.unReadOnly = value
      this.refresh()
    },
    refresh () {
      this.loadAnnouncements()
    },
    loadAnnouncements () {
      this.isLoading = true
      getSchoolNews(this.fromDate, nbAnnouncementsInWidget, false, this.unReadOnly).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.announcementsList = data.news
          this.nbUnreadAnnouncements = data.nbUnreadNews
        } else {
          this.error = true
          console.error('Error')
        }
      })
    },
    showMore () {
      this.$router.push({ name: 'AllAnnouncements' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';
section {
  width: min(355px, 100vw);
  position: relative;
}

.placeholder {
  height: $announcement-item-height;
}

.test {
  position: relative;
}
.announcements-list {
  display: flex;
  overflow-x: auto;
}

.right-linear {
  content: " ";
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  height: calc(#{$announcement-item-height} + 4px);
  width: 10%;
  background-image: linear-gradient(to right, transparent, white);
}

.left-linear {
  content: " ";
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  height: calc(#{$announcement-item-height} + 4px);
  width: 10%;
  background-image: linear-gradient(to left, transparent, white);
}

.footer {
  @extend %widget-footer;
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucune annonce",
  "showMore": "Voir toutes les annonces"
}
</i18n>
