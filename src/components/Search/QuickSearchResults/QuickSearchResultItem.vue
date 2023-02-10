<template>
  <li
    :class="{'selected': isSelected}"
    @mousedown="redirect"
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
  </li>
</template>

<script>
import searchConstants from '@/constants/searchConstants'
import FileIcon from '@components/Base/FileIcon.vue'
export default {
  name: 'QuickSearchResultItem',
  components: { FileIcon },
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
  computed: {
    isFile () {
      return this.searchResult.service === searchConstants.TYPE_NEWS_FILE || this.searchResult.service === searchConstants.TYPE_MESSAGE_FILE || this.searchResult.service === searchConstants.TYPE_FILE || this.searchResult.service === searchConstants.TYPE_PROGRESSION_FILE
    },
    icon () { // TODO: specify icons
      switch (this.searchResult.service) {
        case searchConstants.TYPE_NEWS:
          return require('@assets/icon_news.svg')
        case searchConstants.TYPE_NEWS_FILE:
          return require('@assets/icons/documents/icon-file.svg')
        case searchConstants.TYPE_MESSAGE:
          return require('@assets/menu_messaging_black.svg') // TODO mail icons
        case searchConstants.TYPE_MESSAGE_FILE:
          return require('@assets/icons/documents/icon-file.svg')
        case searchConstants.TYPE_FOLDER:
          return require('@assets/icons/documents/icon-folder.svg')
        case searchConstants.TYPE_FILE:
          return require('@assets/icons/documents/icon-file.svg')
        case searchConstants.TYPE_PROGRESSION:
          return require('@assets/seance.svg') // and not homework?
        case searchConstants.TYPE_PROGRESSION_FILE:
          return require('@assets/icons/documents/icon-file.svg')
        default:
          console.error('Unknown entity type')
          return undefined
      }
    }
  },
  watch: { // Must be watched to react on a new search
    isLast: {
      handler () {
        if (this.isLast) {
          if (this.isInViewport(this.$el)) {
            this.$store.dispatch('search/quickSearch', false)
          }
        }
      }
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyMonitor)
    if (this.isLast) {
      if (this.isInViewport(this.$el)) {
        this.$store.dispatch('search/quickSearch', false) // get the followings results because it's the last element of the scroll but still visible
      }
    }
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.keyMonitor)
  },
  methods: {
    isInViewport (element) {
      const rect = element.getBoundingClientRect()
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      )
    },
    keyMonitor (event) {
      if (event.key === 'Enter' && this.isSelected) {
        this.redirect()
      }
    },
    redirect () {
      console.log('TODO')
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

.icon-container {
  min-width: var(--icon-width);
  display: flex;
  justify-content: center;

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
