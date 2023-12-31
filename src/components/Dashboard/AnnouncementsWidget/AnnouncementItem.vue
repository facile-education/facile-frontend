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
      <div class="thumbnail theme-extra-light-background-color">
        <img
          :src="thumbnail"
          alt="thumbnail"
        >
      </div>

      <div
        class="content"
        :class="{'phone': mq.phone}"
      >
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
            data-test="fileIcon"
            class="paper-clip"
            name="paperclip"
          />
          <button
            v-if="haveOptions && (mq.phone || mq.tablet)"
            class="options-button"
            :aria-label="$t('options')"
            :title="$t('options')"
            @click="toggleContextMenu"
          >
            <img
              height="16"
              width="16"
              :src="require('@assets/icons/vertical_dots.svg')"
              alt="options"
            >
          </button>
        </div>
      </div>

      <div
        v-if="haveOptions && !(mq.phone || mq.tablet)"
        class="announcement-options"
      >
        <button
          v-if="announcement.isEditable"
          class="option theme-hover-extra-light-background-color"
          :aria-label="$t('update')"
          :title="$t('update')"
          data-test="buttonEditAnnouncement"
          @click.stop="isUpdateModalDisplayed = true"
          @keyup.stop
        >
          <img
            src="@/assets/icons/pencil.svg"
            alt="edit"
          >
        </button>
        <button
          v-if="announcement.isDeletable"
          class="option theme-hover-extra-light-background-color"
          :aria-label="$t('delete')"
          :title="$t('delete')"
          data-test="buttonDeleteAnnouncement"
          @click.stop="confirmDeleteAnnouncement"
          @keyup.stop
        >
          <img
            src="@/assets/icons/trash.svg"
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
      @delete="$emit('updateAnnouncement')"
      @close="closeDetailsModal"
    />
  </teleport>

  <teleport
    v-if="displayMenu"
    to="body"
  >
    <ContextMenu
      @choose-option="performChosenOption"
      @close="displayMenu=false"
    />
  </teleport>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon.vue'
import { isInViewport } from '@utils/commons.util'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { deleteNews, setNewsRead } from '@/api/dashboard/news.service'
import { defaultImagesKeys, icons } from '@/constants/icons'
const ContextMenu = defineAsyncComponent(() => import('@components/ContextMenu/ContextMenu.vue'))
const SaveNewsModal = defineAsyncComponent(() => import('@components/Dashboard/AnnouncementsWidget/SaveNewsModal.vue'))
const NewsActivityDetailsModal = defineAsyncComponent(() => import('@components/Dashboard/AnnouncementsWidget/NewsDetailsModal.vue'))

export default {
  name: 'AnnouncementItem',
  components: { ContextMenu, NewsActivityDetailsModal, BaseIcon, SaveNewsModal },
  inject: ['mq'],
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
  emits: ['deleteAnnouncement', 'updateAnnouncement', 'select', 'getNextAnnouncements', 'markAsRead', 'refresh'],
  data () {
    return {
      isUpdateModalDisplayed: false,
      isDetailsModalDisplayed: false,
      refreshNewsOnClose: false,
      displayMenu: false
    }
  },
  computed: {
    haveOptions () {
      return !this.isSelectionMode && (this.announcement.isEditable || this.announcement.isDeletable)
    },
    announcementDay () {
      return this.$t('at') + dayjs(this.announcement.publicationDate).format('DD/MM/YY')
    },
    computedDescription () {
      return this.announcement.shortContent ? this.announcement.shortContent : this.$t('descriptionPlaceholder')
    },
    thumbnail () {
      if (defaultImagesKeys.indexOf(this.announcement.thumbnailUrl) !== -1) {
        return new URL(`../../../assets/images/${this.announcement.thumbnailUrl}.svg`, import.meta.url).href
      } else { // Returned url is a key for local default image
        return this.announcement.thumbnailUrl + '&p_auth=' + this.$store.state.user.pauth
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
        this.refreshNewsOnClose = true
        this.markAnnouncementAsRead()
      }
      this.isDetailsModalDisplayed = true
    },
    toggleContextMenu (event) {
      this.displayMenu = true
      const options = []
      if (this.announcement.isEditable) {
        options.push({
          name: 'update',
          title: this.$t('update'),
          icon: icons.options.rename,
          position: 1,
          hasSeparator: false
        })
      }
      if (this.announcement.isDeletable) {
        options.push({
          name: 'delete',
          title: this.$t('delete'),
          icon: icons.options.delete,
          position: 2,
          hasSeparator: false
        })
      }
      this.$store.dispatch('contextMenu/openContextMenu', { event, options })
    },
    performChosenOption (option) {
      switch (option.name) {
        case 'update':
          this.isUpdateModalDisplayed = true
          break
        case 'delete':
          this.confirmDeleteAnnouncement()
          break
        default:
          console.error('no option with name ' + option.name + ' exists')
      }
      this.displayMenu = false
      this.$store.dispatch('contextMenu/closeMenus')
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
    closeDetailsModal () {
      this.isDetailsModalDisplayed = false
      if (this.refreshNewsOnClose) {
        this.$emit('refresh')
      }
      this.refreshNewsOnClose = false
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
  width: 99%;

  &.is-in-horizontal-scroll {
    height: 100%;
    min-width: $announcement-item-horizontal-min-width;
    max-width: $announcement-item-horizontal-min-width;
  }

  &:not(.is-in-horizontal-scroll) {
    .title {
      display: block;
      white-space: nowrap;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }
  }
}

.announcement {
  position: relative;
  cursor: pointer;
  height: calc(100% - 4px);
  width: 100%;
  border-radius: 10px;
  font-size: 14px;
  line-height: 18px;
  display: flex;
  --thumbnail-width: min(80px, 20vw);
  border: 2px solid $neutral-40;

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
    width: 75%;
    border-radius: 6px;
  }
}

.options-button {
  padding: 8px;
  margin: 0 0 0 auto;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.content {
  width: calc(100% - var(--thumbnail-width));
  padding: 0.5em 1.5rem;
  overflow-x: hidden;
  text-overflow: ellipsis;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &.phone {
    padding: 0.5rem 0.5rem 0.5rem 1.5rem;
  }

  .title {
    @extend %font-medium-m;
  }

  .description {
    margin-top: 4px;
    @extend %font-regular-s;
  }

  .meta-data {
    display: flex;
    align-items: center;

    @extend %font-regular-xs;
  }

  .text {
    display: inline-block;
    max-width: calc(100% - 2em);
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
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
  border-radius: 5px 0 0 0;
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

    img {
      height: 1rem;
    }

    &:not(:hover) {
      background-color: white;
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
  "selectToConsult": "Consulter",
  "descriptionPlaceholder": "Aucune description"
}
</i18n>
