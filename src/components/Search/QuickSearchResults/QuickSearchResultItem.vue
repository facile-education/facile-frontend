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
        <img
          v-if="isCollaborative"
          src="@assets/icons/users.svg"
          alt="collaborative"
        >
      </p>
      <p class="content-extract">
        {{ searchResult.content }}
      </p>
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
      :is-collaborative="isCollaborative"
      :icon="icon"
      :fixed-position="tooltipPosition"
    />
  </li>
</template>

<script>
import searchConstants from '@/constants/searchConstants'
import FileIcon from '@components/Base/FileIcon.vue'
import SearchResultPreview from '@components/Search/SearchResultPreview.vue'
import { isInViewport } from '@/utils/commons.util'
import { getSearchResultDetails } from '@/api/search.service'
export default {
  name: 'QuickSearchResultItem',
  components: { SearchResultPreview, FileIcon },
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
      tooltipPosition: undefined
    }
  },
  computed: {
    isFile () {
      return this.searchResult.service === searchConstants.TYPE_NEWS_FILE || this.searchResult.service === searchConstants.TYPE_MESSAGE_FILE || this.searchResult.service === searchConstants.TYPE_FILE || this.searchResult.service === searchConstants.TYPE_COLLABORATIVE_FILE || this.searchResult.service === searchConstants.TYPE_PROGRESSION_FILE
    },
    isCollaborative () {
      return this.searchResult.service === searchConstants.TYPE_COLLABORATIVE_FILE || this.searchResult.service === searchConstants.TYPE_COLLABORATIVE_FOLDER
    },
    icon () {
      switch (this.searchResult.service) {
        case searchConstants.TYPE_NEWS:
          return require('@assets/icon_news.svg')
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
          return require('@assets/icons/documents/icon-file.svg')
        case searchConstants.TYPE_PROGRESSION:
          return require('@assets/seance.svg') // TODO progression icon
        case searchConstants.TYPE_PROGRESSION_COURSE:
          return require('@assets/seance.svg')
        case searchConstants.TYPE_PROGRESSION_HOMEWORK:
          return require('@assets/devoir.svg')
        case searchConstants.TYPE_PROGRESSION_FILE:
          return require('@assets/icons/documents/icon-file.svg')
        default:
          console.error('Unknown entity type', this.searchResult)
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
          x: domRect.x + domRect.width + 25,
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
      getSearchResultDetails(this.searchResult.entityId, this.searchResult.service).then((data) => { // To retrieve redirection and action to perform on this result
        if (data.success) {
          switch (this.searchResult.service) {
            case searchConstants.TYPE_NEWS:
              console.log('TODO: redirection')
              break
            case searchConstants.TYPE_NEWS_FILE:
              console.log('TODO: redirection')
              break
            case searchConstants.TYPE_MESSAGE:
              this.$router.push({ name: 'Messaging', params: { messageId: this.searchResult.entityId } })
              break
            case searchConstants.TYPE_MESSAGE_FILE:
              this.$router.push({ name: 'Messaging', params: { messageId: data.result.messageId, fileId: this.searchResult.entityId, fileName: this.searchResult.title, display: data.result.displayable } })
              break
            case searchConstants.TYPE_FOLDER:
              this.$router.push({ name: 'Documents', params: { folderId: this.searchResult.entityId } })
              break
            case searchConstants.TYPE_FILE:
              this.$router.push({ name: 'Documents', params: { folderId: data.result.folderId, fileId: this.searchResult.entityId, display: data.result.displayable } })
              break
            case searchConstants.TYPE_COLLABORATIVE_FOLDER:
              this.$router.push({ name: 'GroupDocuments', params: { folderId: this.searchResult.entityId } })
              break
            case searchConstants.TYPE_COLLABORATIVE_FILE:
              this.$router.push({ name: 'GroupDocuments', params: { folderId: data.result.folderId, fileId: this.searchResult.entityId, display: data.result.displayable } })
              break
            case searchConstants.TYPE_PROGRESSION:
              this.$router.push({ name: 'Progression', params: { progressionId: this.searchResult.entityId } })
              break
            case searchConstants.TYPE_PROGRESSION_COURSE:
            case searchConstants.TYPE_PROGRESSION_HOMEWORK:
              this.$router.push({ name: 'Progression', params: { progressionId: data.result.progressionId, itemId: this.searchResult.entityId } })
              break
            case searchConstants.TYPE_PROGRESSION_FILE:
              this.$router.push({ name: 'Progression', params: { progressionId: data.result.progressionId, itemId: data.result.itemId, fileId: this.searchResult.entityId, fileName: this.searchResult.title, display: data.result.displayable } })
              break
            default:
              console.error('Unknown entity type')
              return undefined
          }
          // Save query as an interesting query
          this.$store.dispatch('search/saveQuery')
          // Close panel
          this.$store.dispatch('search/closeQuickSearchResultDisplayed')
        } else {
          console.error('Cannot get result details')
        }
      })
    }
  }
}
</script>

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
  left: 105%;
  z-index: 100;
  min-height: 140px;
  width: 367px;
  border-radius: 11.5px;
  background-color: #FFFFFF;
  box-shadow: 0 0 10px 0 rgba(0,0,0,0.15);
  padding: 24px;
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
