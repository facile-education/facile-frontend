<template>
  <div
    class="news-activity"
    :class="{'phone': mq.phone || mq.tablet}"
    tabindex="0"
    :title="$t('Dashboard.NewsActivity.selectToConsult')"
    @click="showDetails"
    @keyup.enter="showDetails"
  >
    <div class="icon">
      <img
        class="img-icon"
        :src="thumbnail"
        alt="thumbnail"
      >
    </div>

    <div class="content">
      <div class="author">
        <span>
          {{ news.groupName }} -
          <a
            href="#"
            class="user-card-link-new-light toggle-user-card"
            @click.stop="openUserCardModal"
          >{{ news.author.user }}</a>
        </span>
      </div>
      <div class="description">
        <div class="left">
          <span class="text">
            {{ $t((news.isSchoolNews ? 'Dashboard.NewsActivity.hasPublishedAnnounce' : 'Dashboard.NewsActivity.hasPublishedInfo'), {newsTitle: news.title}) }}
          </span>
        </div>
      </div>
    </div>

    <div
      class="date"
      :class="news.isEditable && !mq.phone && 'active-on-hover'"
      :title="formattedDateLong"
    >
      <img
        v-if="news.hasAttachedFiles"
        data-test="fileIcon"
        class="paper-clip"
        :src="require('@assets/icons/paperclip.svg')"
        alt="paperclip"
      >
      <div class="right">
        {{ formattedDate }}
        <button
          v-if="!news.hasRead"
          v-t="'Dashboard.NewsActivity.show'"
          class="show"
          :aria-label="$t('Dashboard.NewsActivity.show')"
          :title="$t('Dashboard.NewsActivity.show')"
          @click="showDetails"
        />
      </div>
    </div>

    <button
      v-if="news.isEditable && (mq.phone || mq.tablet)"
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

    <div
      v-else-if="news.isEditable"
      class="options"
    >
      <button
        class="option"
        :aria-label="$t('Dashboard.NewsActivity.update')"
        data-test="buttonEditInformation"
        :title="$t('Dashboard.NewsActivity.update')"
        @click.stop="isUpdateModalDisplayed = true"
        @keyup.stop
      >
        <CustomIcon
          class="icon"
          icon-name="icon-edit"
        />
      </button>
      <button
        class="option"
        data-test="buttonDeleteInformation"
        :aria-label="$t('Dashboard.NewsActivity.delete')"
        :title="$t('Dashboard.NewsActivity.delete')"
        @click.stop="confirmNewsDeletion"
        @keyup.stop
      >
        <CustomIcon
          class="icon"
          icon-name="icon-trash"
        />
      </button>
    </div>
  </div>

  <teleport
    v-if="isDetailsModalDisplayed"
    to="body"
  >
    <NewsActivityDetailsModal
      :init-news="news"
      @delete="$emit('deleteNews')"
      @update="$emit('updateNews')"
      @close="isDetailsModalDisplayed = false"
    />
  </teleport>

  <teleport
    v-if="isUpdateModalDisplayed"
    to="body"
  >
    <SaveNewsModal
      :init-news="news"
      @update="$emit('updateNews')"
      @close="isUpdateModalDisplayed = false"
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
import { updateDeleteContextMenu } from '@utils/contextMenus'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import { deleteNews, setNewsRead } from '@/api/dashboard/news.service'
import { defaultImagesKeys } from '@/constants/icons'
const ContextMenu = defineAsyncComponent(() => import('@components/ContextMenu/ContextMenu.vue'))
const SaveNewsModal = defineAsyncComponent(() => import('@components/Dashboard/AnnouncementsWidget/SaveNewsModal.vue'))
const NewsActivityDetailsModal = defineAsyncComponent(() => import('@components/Dashboard/AnnouncementsWidget/NewsDetailsModal.vue'))

export default {
  name: 'NewsActivity',
  components: { CustomIcon, SaveNewsModal, NewsActivityDetailsModal, ContextMenu },
  inject: ['mq'],
  props: {
    news: {
      type: Object,
      required: true
    }
  },
  emits: ['updateNews', 'deleteNews', 'markAsRead'],
  data () {
    return {
      isDetailsModalDisplayed: false,
      isUpdateModalDisplayed: false,
      displayMenu: false
    }
  },
  computed: {
    thumbnail () {
      if (defaultImagesKeys.indexOf(this.news.thumbnailUrl) !== -1) {
        return new URL(`../../../../assets/images/defaultImages/${this.news.thumbnailUrl}.svg`, import.meta.url).href
      } else { // Returned url is a key for local default image
        return this.news.thumbnailUrl
      }
    },
    formattedDate () {
      return dayjs(this.news.publicationDate, DATE_EXCHANGE_FORMAT).calendar()
    },
    formattedDateLong () {
      return dayjs(this.news.publicationDate, DATE_EXCHANGE_FORMAT).format(this.$t('Dashboard.NewsActivity.activityTimeFormat'))
    }
  },
  methods: {
    showDetails () {
      if (!this.news.hasRead) {
        setNewsRead(this.news.newsId, true).then((data) => {
          if (data.success) {
            this.$emit('markAsRead')
            this.isDetailsModalDisplayed = true
          } else {
            console.error('Error')
          }
        })
      } else {
        this.isDetailsModalDisplayed = true
      }
    },
    toggleContextMenu (event) {
      this.displayMenu = true
      this.$store.dispatch('contextMenu/openContextMenu', { event, options: updateDeleteContextMenu })
    },
    performChosenOption (option) {
      switch (option.name) {
        case 'update':
          this.isUpdateModalDisplayed = true
          break
        case 'delete':
          this.confirmNewsDeletion()
          break
        default:
          console.error('no option with name ' + option.name + ' exists')
      }
      this.displayMenu = false
      this.$store.dispatch('contextMenu/closeMenus')
    },
    confirmNewsDeletion () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('Dashboard.NewsActivity.deleteNewsWarning'),
        lastAction: { fct: this.deleteNews }
      })
    },
    deleteNews () {
      deleteNews(this.news.newsId).then((data) => {
        if (data.success) {
          this.$emit('deleteNews')
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    openUserCardModal () {
      this.$store.dispatch('userCard/initUserCard', {
        userId: this.news.author.userId
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

button {
  padding: 0
}

.news-activity {
  @extend %activity-item;
  cursor: pointer;
  position: relative;
  padding-right: 16px;

  &:hover, &:focus-within {
    .options {
      opacity: 100%;
      right: 8px;
      transform: translateX(0);
    }
    .active-on-hover{
      transform: translateX(-32px);
    }
  }

  .description {
    display: flex;
    justify-content: space-between;

    .left {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;

      .text {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .paper-clip {
    margin-left: 6px;
    width: 1rem;
    height: 1rem;
    transform: rotate(45deg);
  }

  i {
    margin: 0 0.5em;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 50%;
    }
  }

  .options-button {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 14px;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .options {
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
    transform: translateX(100%);
    height: 100%;
    overflow: hidden;
    display: flex;
    gap: 4px;
    flex-direction: column;
    justify-content: center;
    border-radius: 0 5px 5px 0;
    transition: all .4s ease;

    .option {
      padding: 0;
      width: 2rem;
      height: 2rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      background-color: $neutral-20;

      .icon {
        font-size: 1rem;
        color: black;
        text-decoration: none;
      }

      &:hover {
        background-color: $color-hover-bg;
      }
    }
  }

  .date {
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all .4s ease;
    .right{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  }
  .show {
    @extend %show-more-button;
  }
}

</style>
