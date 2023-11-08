<template>
  <li
    ref="resultItem"
    :class="{'selected': isSelected}"
    @mousedown="redirect"
    @mouseover="onHover"
    @mouseleave="onHoverQuit"
  >
    <div class="icon-container">
      <FileIcon
        v-if="isFile"
        class="file-icon"
        :file="{extension: searchResult.title.split('.').pop()}"
      />
      <img
        v-else
        class="img-icon"
        :src="icon"
        alt="result icon"
      >
    </div>

    <div class="textual-content">
      <p
        class="title"
        :title="searchResult.title"
      >
        {{ searchResult.title }}
      </p>
      <p
        class="content-extract"
        v-html="searchResult.content"
      />
    </div>

    <div class="score">
      <p v-t="('score')" />
      <p class="theme-text-color">
        {{ searchResult.score + '%' }}
      </p>
    </div>

    <SearchResultPreview
      v-if="displayTooltip"
      class="preview"
      :search-result="searchResult"
      :is-file="isFile"
      :icon="icon"
      :fixed-position="tooltipPosition"
      @redirect="redirectPreview"
    />

    <teleport to="body">
      <NewsDetailsModal
        v-if="isNewsModalDisplayed"
        :init-news="searchResult.news"
        @close="isNewsModalDisplayed = false"
      />
      <DiaryEventDetailsModal
        v-if="isEventModalDisplayed"
        :init-event="searchResult.event"
        @close="isEventModalDisplayed = false"
      />
    </teleport>
  </li>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import { DOCUMENTS, MESSAGING } from '@/constants/appConstants'
import searchConstants from '@/constants/searchConstants'
import { isInViewport } from '@/utils/commons.util'
const FileIcon = defineAsyncComponent(() => import('@components/Base/FileIcon'))
const SearchResultPreview = defineAsyncComponent(() => import('@components/Search/SearchResultPreview'))
const NewsDetailsModal = defineAsyncComponent(() => import('@components/Dashboard/AnnouncementsWidget/NewsDetailsModal'))
const DiaryEventDetailsModal = defineAsyncComponent(() => import('@components/Dashboard/DiaryWidget/DiaryEventDetailsModal'))

export default {
  name: 'QuickSearchResultItem',
  components: { NewsDetailsModal, DiaryEventDetailsModal, FileIcon, SearchResultPreview },
  props: {
    searchResult: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      required: true
    },
    isLast: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isHovering: false,
      displayTooltip: false,
      tooltipPosition: undefined,
      isEventModalDisplayed: false,
      isNewsModalDisplayed: false
    }
  },
  computed: {
    isFile () {
      return this.searchResult.service === searchConstants.TYPE_NEWS_FILE || this.searchResult.service === searchConstants.TYPE_MESSAGE_FILE || this.searchResult.service === searchConstants.TYPE_FILE || this.searchResult.service === searchConstants.TYPE_COLLABORATIVE_FILE
    },
    icon () {
      switch (this.searchResult.service) {
        case searchConstants.TYPE_NEWS:
          return require('@assets/images/default_school_news_0.png')
        case searchConstants.TYPE_NEWS_FILE:
          return require('@assets/icons/documents/icon-file.svg')
        case searchConstants.TYPE_MESSAGE:
          return require('@assets/menu_messaging_black.svg') // TODO mail icon
        case searchConstants.TYPE_MESSAGE_FILE:
          return require('@assets/icons/documents/icon-file.svg')
        case searchConstants.TYPE_FOLDER:
          return require('@assets/icons/documents/icon-folder.svg')
        case searchConstants.TYPE_FILE:
          return require('@assets/icons/documents/icon-file.svg')
        case searchConstants.TYPE_COLLABORATIVE_FILE:
          return require('@assets/icons/documents/icon-file.svg')
        case searchConstants.TYPE_COLLABORATIVE_FOLDER:
          return require('@assets/icons/documents/icon-folder.svg')
        case searchConstants.TYPE_EVENT:
          return require('@assets/icons/documents/icon-file.svg')
        default:
          console.warn('Unknown entity type', this.searchResult)
          return undefined
      }
    }
  },
  watch: { // Must be watched to react on a new search
    isLast: {
      handler () {
        if (this.isLast) {
          if (isInViewport(this.$el)) {
            this.$store.dispatch('search/quickSearch', false)
          }
        }
      }
    },
    isSelected: { // Simulate hover behaviour when select it by keyboard, so it can trigger tooltip
      handler () {
        if (this.isSelected) {
          this.onHover()
        } else {
          this.onHoverQuit()
        }
      }
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyMonitor)
    if (this.isLast) {
      if (isInViewport(this.$el)) {
        this.$store.dispatch('search/quickSearch', false) // get the followings results because it's the last element of the scroll but still visible
      }
    }
    this.computeTooltipPosition()
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.keyMonitor)
  },
  methods: {
    onHover () {
      this.isHovering = true
      // this.hovered = true
      setTimeout(() => {
        if (this.isHovering) {
          this.computeTooltipPosition()
          this.displayTooltip = true
        }
      }, 500)
    },
    onHoverQuit () {
      this.isHovering = false
      // this.displayTooltip = false
      setTimeout(() => { if (!this.isHovering) { this.displayTooltip = false } }, 500) // To let time to hover tooltip
    },
    computeTooltipPosition () {
      if (this.$refs.resultItem) {
        const domRect = this.$refs.resultItem.getBoundingClientRect()
        this.tooltipPosition = {
          x: domRect.x + domRect.width + 10,
          y: domRect.y
        }
      }
    },
    keyMonitor (event) {
      if (event.key === 'Enter' && this.isSelected) {
        this.redirect()
      }
    },
    redirect () {
      let redirect = false
      switch (this.searchResult.service) {
        case searchConstants.TYPE_NEWS:
          this.isNewsModalDisplayed = true
          break
        case searchConstants.TYPE_NEWS_FILE:
          if (this.searchResult.displayable) {
            this.$store.dispatch('documents/openFile', { id: this.searchResult.entityId, name: this.searchResult.title })
          } else {
            this.isNewsModalDisplayed = true
          }
          break
        case searchConstants.TYPE_MESSAGE:
          redirect = true
          this.$router.push({ name: MESSAGING, params: { messageId: this.searchResult.entityId } })
          break
        case searchConstants.TYPE_MESSAGE_FILE:
          if (this.searchResult.displayable) {
            this.$store.dispatch('documents/openFile', { id: this.searchResult.entityId, name: this.searchResult.title })
          } else {
            redirect = true
            this.$router.push({ name: MESSAGING, params: { messageId: this.searchResult.message.messageId, fileId: this.searchResult.entityId, fileName: this.searchResult.title } })
          }
          break
        case searchConstants.TYPE_FOLDER:
          redirect = true
          this.$router.push({ name: DOCUMENTS, params: { folderId: this.searchResult.entityId } })
          break
        case searchConstants.TYPE_FILE:
          if (this.searchResult.displayable) {
            this.$store.dispatch('documents/openFile', { id: this.searchResult.entityId, name: this.searchResult.title })
          } else {
            redirect = true
            this.$router.push({ name: DOCUMENTS, params: { folderId: this.searchResult.folderId, fileId: this.searchResult.entityId } })
          }
          break
        case searchConstants.TYPE_COLLABORATIVE_FOLDER:
          redirect = true
          this.$router.push({ name: 'GroupDocuments', params: { folderId: this.searchResult.entityId } })
          break
        case searchConstants.TYPE_COLLABORATIVE_FILE:
          if (this.searchResult.displayable) {
            this.$store.dispatch('documents/openFile', { id: this.searchResult.entityId, name: this.searchResult.title })
          } else {
            redirect = true
            this.$router.push({ name: 'GroupDocuments', params: { folderId: this.searchResult.folderId, fileId: this.searchResult.entityId } })
          }
          break
        case searchConstants.TYPE_EVENT:
          this.isEventModalDisplayed = true
          break
        default:
          console.error('Unknown entity type')
          return undefined
      }
      // Save query as an interesting query
      this.$store.dispatch('search/saveQuery')

      if (redirect) {
        // Close panel
        this.$store.dispatch('search/closeQuickSearchResultDisplayed')
      }
    },
    redirectPreview ({ routeName, params, isNews }) {
      if (routeName !== undefined) {
        this.$router.push({ name: routeName, params })
        // Close panel
        this.$store.dispatch('search/closeQuickSearchResultDisplayed')
      } else if (isNews) {
        this.isNewsModalDisplayed = true
      }
    }

  }
}
</script>

<style lang="scss">
.content-extract strong {
  color: black;
}
</style>

<style lang="scss" scoped>
@import "@design";
p {
  margin: 0;
  padding: 0;
}

li {
  --icon-width: 40px;
  --score-width: 50px;

  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 $quick-search-horizontal-padding;
  border-bottom: 1px solid $color-border;
  cursor: pointer;

  &:hover, &.selected {
    background-color: $color-hover-bg;
  }
}

.preview {
  position: fixed;
  top: 0;
  z-index: 100;
  min-width: 200px;
  border-radius: 11.5px;
  background-color: #FFFFFF;
  box-shadow: 0 0 10px 0 rgba(0,0,0,0.15);
  padding: 16px;
}

.icon-container {
  min-width: var(--icon-width);

  img {
    width: 30px;
    height: 30px;
  }
}

.textual-content {
  flex: 1;
  max-width: calc(100% - var(--icon-width) - var(--score-width));
  padding: 0 9px;

  .title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 0.85em;
    display: flex;
    align-items: center;

    img {
      margin-left: 7px;
      height: 18px;
    }
  }

  .content-extract {
    font-size: 0.75em;
    color: $color-new-light-text;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.score {
  width: var(--score-width);
  font-size: 0.625em;
  color: $color-new-light-text;

  p {
    text-align: center;
  }
}
</style>

<i18n locale="fr">
{
  "score": "Pertinence"
}
</i18n>
