<template>
  <div class="container">
    <div
      class="announcement"
      :class="{'theme-border-color': !announcement.hasRead, 'theme-light-background-color': isSelected, 'theme-hover-light-background-color': isSelectionMode}"
      tabindex="0"
      @click="handleClick"
    >
      <div class="thumbnail">
        <img
          :src="announcement.thumbnailUrl"
          alt="thumbnail"
        >
      </div>

      <div
        class="content"
        :title="announcement.title"
      >
        <strong class="title">
          {{ announcement.title }}
        </strong>
        <div class="description">
          {{ announcement.content }}
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
          @click.stop="isUpdateModalDisplayed = true"
        >
          <img
            src="@/assets/icon_edit_texte.svg"
            alt="edit"
          >
        </button>
        <button
          class="option"
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
    <SaveAnnouncementModal
      :init-announcement="announcement"
      @updateAnnouncement="updateAnnouncement"
      @close="isUpdateModalDisplayed = false"
    />
  </teleport>

  <teleport
    v-if="isDetailsModalDisplayed"
    to="body"
  >
    <AnnouncementDetailsModal
      :init-announcement="announcement"
      @close="isDetailsModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import { deleteNews, setNewsRead } from '@/api/dashboard/news.service'
import dayjs from 'dayjs'
import BaseIcon from '@components/Base/BaseIcon.vue'
import { defineAsyncComponent } from 'vue'
import { isInViewport } from '@utils/commons.util'
const SaveAnnouncementModal = defineAsyncComponent(() => import('@/components/Dashboard/Announcements/SaveAnnouncementModal.vue'))
const AnnouncementDetailsModal = defineAsyncComponent(() => import('@/components/Dashboard/Announcements/AnnouncementDetailsModal.vue'))

export default {
  name: 'AnnouncementItem',
  components: { BaseIcon, SaveAnnouncementModal, AnnouncementDetailsModal },
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
    }
  },
  emits: ['deleteAnnouncement', 'updateAnnouncement', 'select', 'getNextAnnouncements'],
  data () {
    return {
      isUpdateModalDisplayed: false,
      isDetailsModalDisplayed: false
    }
  },
  computed: {
    announcementDay () {
      return this.$t('at') + dayjs(this.announcement.publicationDate).format('DD-MM-YY')
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
    updateAnnouncement () {
      this.$emit('updateAnnouncement')
    },
    markAnnouncementAsRead () {
      setNewsRead(this.announcement.newsId, true).then((data) => {
        if (data.success) {
          this.$emit('updateAnnouncement')
        } else {
          console.error('Error')
        }
      })
    },
    confirmDeleteAnnouncement () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('removalConfirmMessage'),
        lastAction: { fct: this.deleteAnnouncement, params: [] }
      })
    },
    deleteAnnouncement () {
      deleteNews(this.announcement.newsId).then((data) => {
        if (data.success) {
          this.$emit('deleteAnnouncement')
          this.onClose()
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
}

.announcement {
  position: relative;
  cursor: pointer;
  height: $announcement-item-height;
  width: 323px;
  border-radius: 5px;
  padding: 4px;
  font-size: 14px;
  line-height: 18px;
  display: flex;
  --thumbnail-width: 70px;
  border: 1px solid #FFDDDD;

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
}

.content {
  width: calc(100% - var(--thumbnail-width));
  padding: 1em 0;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;

  .description, .meta-data {
    margin-top: 0.5em;
    font-size: 12px;
  }

  .description {
    min-height: 1.5em;
  }

  .description, .text {
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
  "removalConfirmMessage": "L'annonce sera définitivement perdue"
}
</i18n>
