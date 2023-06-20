<template>
  <PentilaWindow
    class="all-announcements-modal"
    data-test="all-announcements-modal"
    :modal="true"
    :draggable="true"
    @close="onClose"
  >
    <template #header>
      <span v-t="'title'" />
    </template>

    <template #body>
      <button
        class="read-only-button"
        @click="toggleReadOnly"
      >
        <img
          :src="unReadOnly ? require('@assets/options/icon_unread_filter_active.svg') : require('@assets/options/icon_unread_filter.svg')"
          alt="unread filter"
        >
      </button>
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
      </div>
    </template>
  </PentilaWindow>
</template>

<script>
import AnnouncementItem from '@components/Dashboard/AnnouncementsWidget/AnnouncementItem.vue'
import dayjs from 'dayjs'

import { getSchoolNews } from '@/api/dashboard/news.service'
import { allAnnouncementsPaginationSize } from '@/constants/dashboardConstants'

export default {
  name: 'AllAnnouncementsModal',
  components: { AnnouncementItem },
  emits: ['close', 'refresh'],
  data () {
    return {
      unReadOnly: false,
      isLoading: false,
      error: undefined,
      announcementsList: [],
      fromDate: dayjs()
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    this.loadAnnouncements()
  },
  methods: {
    toggleReadOnly () {
      this.unReadOnly = !this.unReadOnly
      if (this.unReadOnly) { // Unselect selected event when we enter in unreadOnly mode (assume that the selected event is read and should not be selected anymore)
        this.selectedEvent = undefined
      }
      this.refresh()
    },
    refresh () {
      this.fromDate = dayjs()
      this.announcementsList = []
      this.loadAnnouncements()
    },
    loadAnnouncements () {
      this.isLoading = true
      getSchoolNews(this.fromDate, allAnnouncementsPaginationSize, false, this.unReadOnly).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.announcementsList = data.news
          this.fromDate = dayjs(data.news[data.news.lenght - 1].publicationDate) // Assume they are sorted by date, so take the last announcement date
        } else {
          this.error = true
          console.error('Error')
        }
      })
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.read-only-button {
  height: 15px;
  width: 15px;
  padding: 0;
  background-color: white;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<i18n locale="fr">
{
  "title": "Liste des annonces",
  "errorPlaceholder": "Oups, une erreur est survenue..."
}
</i18n>
