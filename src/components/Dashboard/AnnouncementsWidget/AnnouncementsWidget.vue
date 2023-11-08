<template>
  <section
    data-test="announcement-widget"
  >
    <AnnouncementsHeader
      :nb-new-announcements="nbUnreadAnnouncements"
      :un-read-only="unReadOnly"
      :has-arrows="hasArrows"
      :can-scroll-to-right="canScrollToRight"
      :can-scroll-to-left="canScrollToLeft"
      @update-unread-only="updateUnreadOnlyValue"
      @create-announcement="refresh"
      @go-next="goNext"
      @go-previous="goPrevious"
    />
    <WeprodeSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <div
      v-if="error === true"
      v-t="'errorPlaceholder'"
      class="placeholder"
    />
    <div
      v-else-if="announcementsList.length === 0 && !isFirstLoad"
      v-t="unReadOnly ? 'unReadEmptyPlaceholder' : 'emptyPlaceholder'"
      class="placeholder"
    />
    <div v-else>
      <div class="announcements-container">
        <div
          class="left-linear"
          :class="{'hidden' : !canScrollToLeft}"
        />

        <ul
          ref="announcementsList"
          class="announcements-list"
          :class="{'phone': mq.phone}"
          @scroll="updateScrollPosition"
        >
          <li
            v-for="(announcement, index) in announcementsList"
            :key="index"
          >
            <AnnouncementItem
              :announcement="announcement"
              :is-in-horizontal-scroll="true"
              @mark-as-read="markAsRead(announcement)"
              @update-announcement="refresh"
              @delete-announcement="refresh"
              @refresh="refresh"
            />
          </li>
        </ul>

        <div
          class="right-linear"
          :class="{'hidden' : !canScrollToRight}"
        />
      </div>
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
import AnnouncementItem from '@components/Dashboard/AnnouncementsWidget/AnnouncementItem.vue'
import AnnouncementsHeader from '@components/Dashboard/AnnouncementsWidget/AnnouncementsHeader.vue'
import dayjs from 'dayjs'

import { getSchoolNews } from '@/api/dashboard/news.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import { nbAnnouncementsInWidget } from '@/constants/dashboardConstants'

export default {
  name: 'AnnouncementsWidget',
  components: { AnnouncementItem, AnnouncementsHeader, WeprodeSpinner },
  inject: ['mq'],
  data () {
    return {
      unReadOnly: false,
      announcementsList: [],
      nbUnreadAnnouncements: 0,
      isLoading: false,
      isFirstLoad: true,
      error: false,
      displayedAnnouncementIndex: 0,
      canScrollToLeft: false,
      canScrollToRight: true,
      hasArrows: false
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
  mounted () {
    window.addEventListener('resize', this.computeHasArrowsProperty)
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.computeHasArrowsProperty)
  },
  methods: {
    computeHasArrowsProperty () {
      if (!this.mq.phone && this.announcementsList.length > 1) {
        const containerWidth = this.$refs.announcementsList.getBoundingClientRect().width
        const announcementItemWidth = 450 + 24
        this.hasArrows = this.announcementsList.length * announcementItemWidth > containerWidth
      } else {
        this.hasArrows = false
      }
    },
    goNext () {
      if (this.displayedAnnouncementIndex < this.announcementsList.length - 1) {
        this.displayedAnnouncementIndex += 1
      }
      this.scrollToDisplayedAnnouncement()
    },
    goPrevious () {
      if (this.displayedAnnouncementIndex > 0) {
        this.displayedAnnouncementIndex -= 1
      }
      this.scrollToDisplayedAnnouncement()
    },
    scrollToDisplayedAnnouncement () {
      const scroll = this.$refs.announcementsList
      // console.log('scroll width: ' + scroll.scrollWidth)
      // console.log('div width: ' + scroll.getBoundingClientRect().width)
      const announcementItemWidth = 450 + 24 // $announcement-item-horizontal-min-width + margin-right, TODO: get the real value of announcement to handle all cases
      let scrollOffset // To center non firsts announcements
      if (this.displayedAnnouncementIndex === 0) {
        scrollOffset = 0
        scroll.scrollTo({ top: 0, left: this.displayedAnnouncementIndex * announcementItemWidth - scrollOffset, behavior: 'smooth' })
      } else if (this.displayedAnnouncementIndex === this.announcementsList.length - 1) {
        scroll.scrollTo({ top: 0, left: scroll.scrollWidth, behavior: 'smooth' })
      } else {
        scrollOffset = (scroll.getBoundingClientRect().width / 2) - (announcementItemWidth / 2)
        scroll.scrollTo({ top: 0, left: this.displayedAnnouncementIndex * announcementItemWidth - scrollOffset, behavior: 'smooth' })
      }
    },
    updateScrollPosition () {
      // console.log('current scroll position: ', this.$refs.announcementsList.scrollLeft)
      const scrollLeft = this.$refs.announcementsList.scrollLeft
      this.canScrollToLeft = scrollLeft > 0
      this.canScrollToRight = scrollLeft < this.$refs.announcementsList.scrollWidth - Math.floor(this.$refs.announcementsList.getBoundingClientRect().width)
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
        this.isFirstLoad = false
        if (data.success) {
          this.error = false
          this.announcementsList = data.news
          this.nbUnreadAnnouncements = data.nbUnreadNews
          this.computeHasArrowsProperty()
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
    showMore () {
      this.$router.push({ name: 'AllAnnouncements' })
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
section {
  min-width: min($announcements-widget-min-width, 100%);
  width: 100%;
  position: relative;
  @extend %widget;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.placeholder {
  @extend %widget-placeholder;
}

.announcements-container {
  position: relative;
  flex: 1;
  min-height: $announcement-item-min-height;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;

  li {
    margin-right: 24px;

    &:last-child {
      margin-right: 0;
    }
  }
}

.announcements-list {
  display: flex;
  overflow-x: auto;
  height: 100%;

  &:not(.phone)::-webkit-scrollbar{
    display: none;
  }

  &.phone {
    scroll-snap-type: x mandatory;

    li {
      scroll-snap-align: center;
    }
  }
}

.right-linear {
  content: " ";
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  height: 100%;
  width: 10%;
  background-image: linear-gradient(to right, transparent, white);
  opacity: 100;
  transform: translateX(0);
  transition: all .2s ease;

  &.hidden {
    opacity: 0;
    transform: translateX(100%);
  }
}

.left-linear {
  content: " ";
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  height: 100%;
  width: 10%;
  background-image: linear-gradient(to left, transparent, white);
  opacity: 100;
  transform: translateX(0);
  transition: all .2s ease;

  &.hidden {
    opacity: 0;
    transform: translateX(-100%);
  }
}

.footer {
  @extend %widget-footer;
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucune annonce",
  "unReadEmptyPlaceholder": "Aucune nouvelle annonce",
  "showMore": "Voir toutes les annonces"
}
</i18n>
