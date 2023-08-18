<template>
  <article :class="{'not-in-modal': !isInModal}">
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
      class="detailed-news"
      :class="{'is-school-news': detailedNews.isSchoolNews}"
    >
      <div class="first-line">
        <div class="thumbnail">
          <img
            :src="thumbnail"
            alt="thumbnail"
          >
        </div>

        <div class="first-line-right">
          <div
            v-if="detailedNews.isEditable"
            class="populations"
          >
            <div
              v-t="'populations'"
              class="label"
            />
            <PopulationList :population-list="detailedNews.populations" />
          </div>

          <div
            v-if="detailedNews.isEditable"
            class="read-infos"
          >
            <div
              v-t="'readBy'"
              class="label"
            />
            <ReadInfos :read-infos="detailedNews.readInfos" />
          </div>

          <div
            v-if="!detailedNews.isEditable"
            class="publication"
          >
            {{ $t('at') + formattedPublicationDate + $t('by') + detailedNews.authorName }}
          </div>
        </div>
      </div>

      <h2 v-if="!isInModal">
        {{ detailedNews.title }}
      </h2>

      <div
        v-if="detailedNews.isEditable"
        class="publication"
      >
        {{ $t('at') + formattedPublicationDate + $t('by') + detailedNews.authorName }}
      </div>

      <div
        v-if="detailedNews.content"
        class="content"
        v-html="detailedNews.content"
      />
      <div
        v-else
        v-t="'contentPlaceholder'"
        class="content-placeholder"
      />

      <ul class="attached-files">
        <li
          v-for="attachedFile in detailedNews.attachedFiles"
          :key="attachedFile.fileId"
        >
          <AttachedFile
            :read-only="true"
            :attached-file="attachedFile"
          />
        </li>
      </ul>

      <div
        v-if="detailedNews.isEditable"
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
          @click="confirmDeleteNews"
        />
      </div>
    </div>
  </article>

  <teleport
    v-if="isUpdateModalDisplayed"
    to="body"
  >
    <SaveNewsModal
      :init-news="detailedNews"
      :is-school-news="initNews.isSchoolNews"
      @update="updateNews"
      @close="isUpdateModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import PopulationList from '@components/Base/PopulationList.vue'
import ReadInfos from '@components/Dashboard/ReadInfos/ReadInfos.vue'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { deleteNews, getNewsDetails } from '@/api/dashboard/news.service'
import { defaultImagesKeys } from '@/constants/icons'
const AttachedFile = defineAsyncComponent(() => import('@components/AttachedFiles/AttachedFile.vue'))
const SaveNewsModal = defineAsyncComponent(() => import('@components/Dashboard/AnnouncementsWidget/SaveNewsModal.vue'))

export default {
  name: 'NewsDetails',
  components: { AttachedFile, SaveNewsModal, ReadInfos, PopulationList },
  props: {
    initNews: {
      type: Object,
      default: undefined
    },
    isInModal: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update', 'delete'],
  data () {
    return {
      detailedNews: undefined,
      isLoading: false,
      error: undefined,
      isUpdateModalDisplayed: false
    }
  },
  computed: {
    formattedPublicationDate () {
      return dayjs(this.detailedNews.publicationDate).format('DD/MM/YY')
    },
    thumbnail () {
      if (defaultImagesKeys.indexOf(this.initNews.thumbnailUrl) !== -1) {
        return new URL(`../../../assets/images/${this.initNews.thumbnailUrl}.png`, import.meta.url).href
      } else { // Returned url is a key for local default image
        return this.initNews.thumbnailUrl
      }
    }
  },
  watch: {
    initNews: {
      deep: true,
      handler () {
        this.getNewsDetails()
      }
    }
  },
  created () {
    this.getNewsDetails()
  },
  methods: {
    getNewsDetails () {
      this.isLoading = true
      getNewsDetails(this.initNews.newsId).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.detailedNews = data.news
        } else {
          this.error = true
          console.error('Error while getting news details')
        }
      })
    },
    confirmDeleteNews () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.initNews.isSchoolNews ? this.$t('removalAnnouncementConfirmMessage', { target: this.initNews.title }) : this.$t('removalGroupNewsConfirmMessage'),
        lastAction: { fct: this.deleteNews, params: [] }
      })
    },
    updateNews () {
      this.getNewsDetails()
      this.$emit('update')
    },
    deleteNews () {
      deleteNews(this.initNews.newsId).then((data) => {
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

article {
  height: 100%;
  flex:1;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  width: 100%;
}

h2 {
  margin: 0;
  padding-left: 99px;
}

.detailed-news {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.placeholder {
  position: relative;
  height: 20vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25em;
}

.first-line {
  --thumbnail-width: min(74px, 20vw);
  display: flex;
  height: 50px;
}

.thumbnail{
  width: var(--thumbnail-width);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 100%;
  }
}

.first-line-right {
  width: calc(100% - var(--thumbnail-width));
  padding-left: 25px;
}

.populations, .read-infos {
  display: flex;
}

.read-infos {
  margin-top: 8px;
}

.label {
  min-width: 5em;
  @extend %font-regular-m;
}

.populations {
  align-items: center;
}

.publication {
  margin-top: 1rem;
  color: $color-new-light-text;
  text-align: right;
}

.content {
  margin-top: 1rem;
  max-height: 60vh;
  overflow-y: auto;

  ::deep(p) {
    margin: 0;
  }
}

.content-placeholder {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.attached-files {
  display: flex;
  flex-wrap: wrap;
}

.footer {
  align-self: flex-end;
  margin-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: flex-end;

  .footer-button {
    margin-left: 15px;
  }
}

.not-in-modal {
  .footer {
    margin-top: auto;
  }
}

.is-school-news {
  .first-line {
    height: 74px;
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
  "contentPlaceholder": "Aucun contenu pour cette actualité",
  "removalAnnouncementConfirmMessage": "Veuillez confirmer la suppression de l'annonce \"{target}\"",
  "removalGroupNewsConfirmMessage": "Supprimer cette information ?"
}
</i18n>
