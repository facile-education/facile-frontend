<template>
  <div
    ref="item"
    class="container"
    :title="$t('Dashboard.AnnouncementItem.selectToConsult')"
  >
    <div
      v-if="!announcement.hasRead"
      class="pellet theme-background-color"
    />

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
            <span>{{ $t('Dashboard.AnnouncementItem.by') + announcement.author.user }}</span>
          </span>
          <img
            v-if="announcement.hasAttachedFiles"
            data-test="fileIcon"
            class="paper-clip"
            :src="require('@assets/icons/paperclip.svg')"
            alt="paperclip"
          >
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
              :src="require('@assets/icons/dots.svg')"
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
          class="option"
          :aria-label="$t('Dashboard.AnnouncementItem.update')"
          :title="$t('Dashboard.AnnouncementItem.update')"
          data-test="buttonEditAnnouncement"
          @click.stop="isUpdateModalDisplayed = true"
          @keyup.stop
        >
          <CustomIcon
            class="icon"
            icon-name="icon-edit"
          />
        </button>
        <button
          v-if="announcement.isDeletable"
          class="option"
          :aria-label="$t('Dashboard.AnnouncementItem.delete')"
          :title="$t('Dashboard.AnnouncementItem.delete')"
          data-test="buttonDeleteAnnouncement"
          @click.stop="confirmDeleteAnnouncement"
          @keyup.stop
        >
          <CustomIcon
            class="icon"
            icon-name="icon-trash"
          />
        </button>
      </div>
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
import CustomIcon from '@components/Base/CustomIcon.vue'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { deleteNews, setNewsRead } from '@/api/dashboard/news.service'
import { defaultImagesKeys, icons } from '@/constants/icons'
const ContextMenu = defineAsyncComponent(() => import('@components/ContextMenu/ContextMenu.vue'))
const SaveNewsModal = defineAsyncComponent(() => import('@components/Dashboard/AnnouncementsWidget/SaveNewsModal.vue'))
const NewsActivityDetailsModal = defineAsyncComponent(() => import('@components/Dashboard/AnnouncementsWidget/NewsDetailsModal.vue'))

export default {
  name: 'AnnouncementItem',
  components: { CustomIcon, ContextMenu, NewsActivityDetailsModal, SaveNewsModal },
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
    isSelected: {
      type: Boolean,
      default: false
    },
    isLast: {
      type: Boolean,
      default: false
    }
  },
  emits: ['deleteAnnouncement', 'updateAnnouncement', 'select', 'markAsRead', 'refresh'],
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
      return this.$t('Dashboard.AnnouncementItem.announcementDate', { dateLabel: dayjs(this.announcement.publicationDate).format('DD/MM/YY') })
    },
    computedDescription () {
      return this.announcement.shortContent ? this.announcement.shortContent : this.$t('Dashboard.AnnouncementItem.descriptionPlaceholder')
    },
    thumbnail () {
      if (defaultImagesKeys.indexOf(this.announcement.thumbnailUrl) !== -1) {
        return new URL(`../../../assets/images/defaultImages/${this.announcement.thumbnailUrl}.svg`, import.meta.url).href
      } else { // Returned url is a key for local default image
        return this.announcement.thumbnailUrl + '&p_auth=' + this.$store.state.user.pauth
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
          title: this.$t('Dashboard.AnnouncementItem.update'),
          icon: icons.options.rename,
          position: 1,
          hasSeparator: false
        })
      }
      if (this.announcement.isDeletable) {
        options.push({
          name: 'delete',
          title: this.$t('Dashboard.AnnouncementItem.delete'),
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
      setNewsRead(this.announcement.newsId).then((data) => {
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
        text: this.$t('Dashboard.AnnouncementItem.removalConfirmMessage', { target: this.announcement.title }),
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
  position: relative;
  padding-right: 4px;
  padding-top: 4px;
  width: 99%;

  &:not(.is-in-horizontal-scroll) {
    .title {
      display: block;
      white-space: nowrap;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }
  }

  .pellet {
    @extend %item-pellet;
    transform: translate(-88%, -15%);
    z-index: 1;
  }
}

.announcement {
  position: relative;
  cursor: pointer;
  height: 100%;
  width: 100%;
  border-radius: 10px;
  font-size: 14px;
  line-height: 18px;
  display: flex;
  align-items: center;
  --thumbnail-width: min(80px, 20vw);
  border: 2px solid $neutral-40;
  overflow: hidden;

  &:hover, &:focus-within {
    .announcement-options {
      opacity: 100%;
      bottom: 14px;
      transform: translateY(0);
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
  border: none;
  cursor: pointer;
  background-color: transparent;
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
    margin-left: 6px;
    width: 1rem;
    height: 1rem;
    transform: rotate(45deg);
  }
}

.announcement-options {
  position: absolute;
  bottom: 0;
  right: 16px;
  transform: translateY(100%);
  display: flex;
  opacity: 0;
  gap: 4px;
  border-radius: 5px 0 0 0;
  overflow: hidden;
  transition: all .4s ease;

  .option {
    width: 2rem;
    height: 2rem;
    border-radius: 1rem;
    transition: all .3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    background-color: $neutral-20;

    .icon {
      font-size: 1rem;
    }

    &:hover {
      background-color: $color-hover-bg;
    }
  }
}

</style>
