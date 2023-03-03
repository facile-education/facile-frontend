<template>
  <section>
    <AnnouncementsHeader
      :nb-new-announcements="nbUnreadAnnouncements"
      :un-read-only="unReadOnly"
      @updateUnreadOnly="updateUnreadOnlyValue"
      @createAnnouncement="refresh"
    />
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
      class="announcements-list"
    >
      <AnnouncementItem
        v-for="(announcement, index) in announcementsList"
        :key="index"
        :announcement="announcement"
        @updateAnnouncement="refresh"
        @deleteAnnouncement="refresh"
      />
      <div class="footer">
        <button
          v-t="'showMore'"
          class="show-more"
          @click="isAllAnnouncementsModalDisplayed = true"
        />
      </div>
    </div>
  </section>

  <teleport
    v-if="isAllAnnouncementsModalDisplayed"
    to="body"
  >
    <AllAnnouncementsModal
      @refresh="refresh"
      @close="isAllAnnouncementsModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import dayjs from 'dayjs'
import { nbAnnouncementsInWidget } from '@/constants/dashboardConstants'
import AnnouncementsHeader from '@components/Dashboard/Announcements/AnnouncementsHeader.vue'
import { getSchoolNews } from '@/api/news.service'
import { defineAsyncComponent } from 'vue'
import AnnouncementItem from '@components/Dashboard/Announcements/AnnouncementItem.vue'
const AllAnnouncementsModal = defineAsyncComponent(() => import('@/components/Dashboard/Announcements/AllAnnouncementsModal.vue'))

export default {
  name: 'AnnouncementsWidget',
  components: { AnnouncementItem, AllAnnouncementsModal, AnnouncementsHeader },
  data () {
    return {
      unReadOnly: false,
      announcementsList: [],
      nbUnreadAnnouncements: 0,
      isLoading: false,
      error: false,
      isAllAnnouncementsModalDisplayed: false
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';
section {
  width: min(355px, 100vw);
}

.announcements-list {
  display: flex;
  overflow-x: auto;
}

.footer {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;

  button {
    margin-right: 4px;
    border: 1px solid $color-border;
    border-radius: 4px;
    height: 29px;
    cursor: pointer;
    padding: 9px 10px;
    background-color: white;
    display: flex;
    align-items: center;
  }
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucune annonce",
  "showMore": "Voir toutes les annonces"
}
</i18n>
