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
      <div class="first-line">
        <div class="thumbnail">
          <img
            :src="detailedAnnouncement.thumbnailUrl"
            alt="thumbnail"
          >
        </div>

        <div class="first-line-right">
          <div class="populations">
            <div
              v-t="'populations'"
              class="label"
            />
            <PopulationList :population-list="detailedAnnouncement.populations" />
          </div>

          <div
            v-if="detailedAnnouncement.isEditable"
            class="read-infos"
          >
            <div
              v-t="'readBy'"
              class="label"
            />
            <ReadInfos :read-infos="detailedAnnouncement.readInfos" />
          </div>

          <div class="publication">
            {{ $t('at') + detailedAnnouncement.publicationDate + $t('by') + detailedAnnouncement.authorName }}
          </div>

          <h2> {{ detailedAnnouncement.title }}</h2>
        </div>
      </div>

      <div
        v-if="detailedAnnouncement.content"
        class="content"
        v-html="detailedAnnouncement.content"
      />
      <div
        v-else
        v-t="'contentPlaceholder'"
        class="content-placeholder"
      />

      <AttachedFiles
        v-if="detailedAnnouncement.hasAttachedFiles"
        :read-only="true"
        :attached-files="detailedAnnouncement.attachedFiles"
      />

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
import AttachedFiles from '@components/Base/AttachedFiles.vue'
import PopulationList from '@components/Dashboard/PopulationList.vue'
import ReadInfos from '@components/Dashboard/ReadInfos.vue'

export default {
  name: 'AnnouncementDetails',
  components: { ReadInfos, PopulationList, AttachedFiles, SaveAnnouncementModal },
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
@import "@design";

.placeholder {
  height: 20vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25em;
}

.first-line {
  --thumbnail-width: min(100px, 20vw);
  display: flex;
}

.thumbnail{
  width: var(--thumbnail-width);
  height: 100%;
  background-color: green;
}

.first-line-right {
  width: calc(100% - var(--thumbnail-width));
  padding-left: 20px;
}

.populations {
}

.populations, .read-infos {
  display: flex;
}

.label {
  min-width: 5em;
  margin-right: 1rem;
}

.populations .label {
  margin-top: 5px;
}

.publication {
  margin-top: 1rem;
  color: $color-new-light-text;
}

h2 {
  margin: 0.3em 0;
}

.content {
  max-height: 30vh;
  overflow-y: auto;
}

.content-placeholder {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  "populations": "Diffusé à",
  "at": "Le ",
  "by": " par ",
  "readBy": "Lu par",
  "update": "Modifier",
  "delete": "Supprimer",
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "contentPlaceholder": "Aucun contenu pour cette annonce",
  "removalConfirmMessage": "L'annonce sera définitivement perdue"
}
</i18n>
