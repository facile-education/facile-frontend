<template>
  <article>
    <div
      v-if="isLoading"
      class="placeholder"
    >
      <PentilaSpinner />
    </div>
    <div
      v-else-if="error === true"
      v-t="'errorPlaceholder'"
      class="placeholder"
    />
    <div
      v-else
      class="detailed-announcement"
    >
      {{ detailedAnnouncement }}
      <div
        v-if="detailedAnnouncement.isEditable"
        class="footer"
      >
        <PentilaButton
          class="footer-button"
          data-test="updateButton"
          :label="$t('update')"
          @click="isUpdateModalDisplayed = true"
        />
        <PentilaButton
          class="footer-button"
          data-test="deleteButton"
          :label="$t('delete')"
          @click="confirmDeleteAnnouncement"
        />
      </div>
    </div>
  </article>

  <teleport
    v-if="isUpdateModalDisplayed"
    to="body"
  >
    <SaveAnnouncementModal
      :init-announcement="detailedAnnouncement"
      @updateAnnouncement="getAnnouncementDetails"
      @close="isUpdateModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import { getNewsDetails, deleteNews } from '@/api/dashboard/news.service'
import SaveAnnouncementModal from '@components/Dashboard/Announcements/SaveAnnouncementModal.vue'

export default {
  name: 'AnnouncementDetails',
  components: { SaveAnnouncementModal },
  props: {
    initAnnouncement: {
      type: Object,
      default: undefined
    }
  },
  emits: ['update', 'delete'],
  data () {
    return {
      detailedAnnouncement: undefined,
      isLoading: false,
      error: undefined,
      isUpdateModalDisplayed: false
    }
  },
  created () {
    this.getAnnouncementDetails()
  },
  methods: {
    getAnnouncementDetails () {
      this.isLoading = true
      getNewsDetails(this.initAnnouncement.newsId).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.detailedAnnouncement = data.news
        } else {
          this.error = true
          console.error('Error while getting announcement details')
        }
      })
    },
    confirmDeleteAnnouncement () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('removalConfirmMessage'),
        lastAction: { fct: this.deleteAnnouncement, params: [] }
      })
    },
    updateAnnouncement () {
      this.getAnnouncementDetails()
      this.$emit('update')
    },
    deleteAnnouncement () {
      deleteNews(this.initAnnouncement.newsId).then((data) => {
        if (data.success) {
          this.$emit('delete')
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.placeholder {
  height: 20vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25em;
}

.footer {
  align-self: flex-end;
  margin-top: auto;
  width: 100%;
  display: flex;
  justify-content: flex-end;

  .footer-button {
    margin-left: 15px;
  }
}
</style>

<i18n locale="fr">
{
  "update": "Modifier",
  "delete": "Supprimer",
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "removalConfirmMessage": "L'annonce sera définitivement perdue"
}
</i18n>
