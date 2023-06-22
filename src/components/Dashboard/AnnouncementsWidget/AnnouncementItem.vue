<template>
  <div
    ref="item"
    class="container"
    :class="{'is-in-horizontal-scroll': isInHorizontalScroll}"
    :title="$t('selectToConsult')"
  >
    <div
      class="announcement"
      :class="{'theme-border-color': !announcement.hasRead, 'theme-light-background-color': isSelected, 'theme-hover-light-background-color': isSelectionMode}"
      tabindex="0"
      @keyup.enter="handleClick"
      @click="handleClick"
    >
      <div class="thumbnail">
        <img
          :src="thumbnail"
          alt="thumbnail"
        >
      </div>

      <div class="content">
        <div>
          <strong class="title">
            {{ announcement.title }}
          </strong>
          <div class="description">
            {{ computedDescription }}
          </div>
        </div>
        <div class="meta-data">
          <span class="text">
            <span>{{ announcementDay }}</span>
            <span>{{ $t('by') + announcement.authorName }}</span>
          </span>
          <BaseIcon
            v-if="announcement.hasAttachedFiles"
            class="paper-clip"
            name="paperclip"
          />
        </div>
      </div>

      <div
        v-if="!isSelectionMode && announcement.isEditable"
        class="announcement-options"
      >
        <button
          class="option"
          :aria-label="$t('update')"
          :title="$t('update')"
          @click.stop="isUpdateModalDisplayed = true"
        >
          <img
            src="@/assets/icon_edit_texte.svg"
            alt="edit"
          >
        </button>
        <button
          class="option"
          :aria-label="$t('delete')"
          :title="$t('delete')"
          @click.stop="confirmDeleteAnnouncement"
        >
          <img
            src="@/assets/icon_trash.svg"
            alt="edit"
          >
        </button>
      </div>

      <div
        v-if="!announcement.hasRead"
        class="pellet theme-background-color"
      />
    </div>
  </div>

  <teleport
    v-if="isUpdateModalDisplayed"
    to="body"
  >
    <SaveNewsModal
      :init-news="announcement"
      :is-school-news="true"
      @update="$emit('updateAnnouncement')"
      @close="isUpdateModalDisplayed = false"
    />
  </teleport>

  <teleport
    v-if="isDetailsModalDisplayed"
    to="body"
  >
    <NewsActivityDetailsModal
      :init-news="announcement"
      @update="$emit('updateAnnouncement')"
      @close="isDetailsModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon.vue'
import { isInViewport } from '@utils/commons.util'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { deleteNews, setNewsRead } from '@/api/dashboard/news.service'
import { defaultImagesKeys } from '@/constants/icons'
const SaveNewsModal = defineAsyncComponent(() => import('@components/Dashboard/AnnouncementsWidget/SaveNewsModal.vue'))
const NewsActivityDetailsModal = defineAsyncComponent(() => import('@components/Dashboard/AnnouncementsWidget/NewsDetailsModal.vue'))

export default {
  name: 'AnnouncementItem',
  components: { NewsActivityDetailsModal, BaseIcon, SaveNewsModal },
  props: {
    announcement: {
      type: Object,
      required: true
    },
    isSelectionMode: {
      type: Boolean,
      default: false
    },
    isInHorizontalScroll: {
      type: Boolean,
      default: false
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    isLast: {
      type: Boolean,
      default: false
    }
  },
  emits: ['deleteAnnouncement', 'updateAnnouncement', 'select', 'getNextAnnouncements', 'markAsRead'],
  data () {
    return {
      isUpdateModalDisplayed: false,
      isDetailsModalDisplayed: false
    }
  },
  computed: {
    announcementDay () {
      return this.$t('at') + dayjs(this.announcement.publicationDate).format('DD/MM/YY')
    },
    computedDescription () {
      return this.announcement.shortContent ? this.announcement.shortContent : this.$t('descriptionPlaceholder')
    },
    thumbnail () {
      if (defaultImagesKeys.indexOf(this.announcement.thumbnailUrl) !== -1) {
        return new URL(`../../../assets/images/${this.announcement.thumbnailUrl}.png`, import.meta.url).href
      } else { // Returned url is a key for local default image
        return this.announcement.thumbnailUrl
      }
    }
  },
  watch: { // Must be watched to react on a new search
    isLast: {
      handler () {
        if (this.isLast) {
          if (isInViewport(this.$refs.item)) {
            this.$emit('getNextAnnouncements')
          }
        }
      }
    },
    isSelected: {
      immediate: true,
      handler () {
        if (this.isSelected) {
          if (!this.announcement.hasRead) {
            this.markAnnouncementAsRead()
          }
        }
      }
    }
  },
  mounted () {
    if (this.isLast) {
      if (isInViewport(this.$refs.item)) {
        this.$emit('getNextAnnouncements')
      }
    }
  },
  methods: {
    handleClick () {
      if (this.isSelectionMode) {
        this.$emit('select')
      } else {
        this.showDetails()
      }
    },
    showDetails () {
      if (!this.announcement.hasRead) {
        this.markAnnouncementAsRead()
      }
      this.isDetailsModalDisplayed = true
    },
    markAnnouncementAsRead () {
      setNewsRead(this.announcement.newsId, true).then((data) => {
        if (data.success) {
          this.$emit('markAsRead')
        } else {
          console.error('Error')
        }
      })
    },
    confirmDeleteAnnouncement () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('removalConfirmMessage', { target: this.announcement.title }),
        lastAction: { fct: this.deleteAnnouncement, params: [] }
      })
    },
    deleteAnnouncement () {
      deleteNews(this.announcement.newsId).then((data) => {
        if (data.success) {
          this.$emit('deleteAnnouncement')
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

.container {
  padding-right: 4px;
  padding-top: 4px;
  min-height: $announcement-item-min-height;
  height: $announcement-item-min-height;

  &.is-in-horizontal-scroll {
    height: 100%;
    min-width: $announcement-item-horizontal-min-width;
    max-width: $announcement-item-horizontal-min-width;
  }
}

.announcement {
  position: relative;
  cursor: pointer;
  height: calc(100% - 4px);
  width: 100%;
  border-radius: 10px;
  padding: 4px;
  font-size: 14px;
  line-height: 18px;
  display: flex;
  --thumbnail-width: 25%;
  border: 1px solid $color-border;

  .pellet {
    @extend %item-pellet;
  }

  &:hover, &:focus-within {
    .announcement-options {
      opacity: 100%;

      .option {
        height: 50px;
      }
    }
  }
}

.thumbnail{
  width: var(--thumbnail-width);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 70%;
    border-radius: 6px;
  }
}

.content {
  width: calc(100% - var(--thumbnail-width));
  padding: 1em 0;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .description, .meta-data {
    font-size: 0.8rem;
    color: $color-new-light-text;
  }

  .description {
    margin-top: 1rem;
  }

  .title, .description, .text {
    display: block;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  .meta-data {
    display: flex;
    align-items: center;
  }

  .text {
    display: inline-block;
    max-width: calc(100% - 2em);
  }

  .paper-clip {
    margin-left: 1em;
  }
}

.announcement-options {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  border-radius: 0 5px 5px 0;
  overflow: hidden;
  transition: all .3s ease;
  opacity: 0;

  .option {
    height: 0;
    width: 40px;
    transition: all .3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: $color-hover-bg;
    }
  }
}

</style>

<i18n locale="fr">
{
  "at": "Le ",
  "by": " par ",
  "update": "Modifier",
  "delete": "Supprimer",
  "removalConfirmMessage": "Veuillez confirmer la suppression de l'annonce \"{target}\"",
  "selectToConsult": "Sélectionner pour consulter",
  "descriptionPlaceholder": "Aucune description"
}
</i18n>
