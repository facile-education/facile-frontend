<template>
  <div
    ref="tooltip"
    class="result-details"
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

    <div class="content">
      <div class="header">
        {{ searchResult.title }}
        <img
          v-if="isCollaborative"
          src="@assets/icons/users.svg"
          alt="collaborative"
        >
      </div>
      <div
        v-if="resultDetails"
        class="text"
      >
        <div class="first-line">
          <span>{{ formattedDate }}</span>
          <span v-if="searchResult.size">{{ ' - ' + formatSize(searchResult.size) }}</span>
          <span v-if="searchResult.section">{{ ' - ' + searchResult.section }}</span>
          <span v-if="resultDetails.messagingFolder">{{ ' - ' + resultDetails.messagingFolder.folderName }}</span>
        </div>
        <div class="second-line">
          <span> {{ searchResult.author }}</span>
          <span v-if="searchResult.groupName">{{ ' - ' + searchResult.groupName }}</span>
        </div>
        <div class="third-line">
          <span v-if="searchResult.description">{{ searchResult.description }}</span>
        </div>
      </div>
      <div
        v-if="isCollaborative"
        class="folder"
      >
        <label>{{ $t('group') + ': ' }}</label>
        <span>{{ searchResult.groupName }}</span>
      </div>
      <div
        v-if="searchResult && searchResult.folder"
        class="folder"
      >
        <label>{{ $t('folder') + ': ' }}</label>
        <a @mousedown.stop="redirectInDocument(searchResult.folder.folderId)">{{ searchResult.folder.folderName }}</a>
      </div>
      <div
        v-else-if="searchResult && searchResult.message"
        class="folder"
      >
        <label>{{ $t('message') + ': ' }}</label>
        <a @mousedown.stop="redirectInMessaging(searchResult.message.messageId)">{{ searchResult.message.subject }}</a>
      </div>
      <div
        v-else-if="searchResult && searchResult.news"
        class="folder"
      >
        <label>{{ $t('news') + ': ' }}</label>
        <a @mousedown.stop="redirectInNews(searchResult.news.newsId)">{{ searchResult.news.title }}</a>
      </div>
      <div
        v-if="resultDetails && resultDetails.attachedFiles"
        class="attached-files"
      >
        <div
          v-for="(attachedFile, index) in resultDetails.attachedFiles"
          :key="index"
          class="attached-file"
        >
          <img
            class="img-icon"
            src="@assets/icons/documents/icon-file.svg"
            alt="file icon"
          >
          {{ attachedFile }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatSize } from '@utils/commons.util'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { getSearchResultDetails } from '@/api/search.service'
import { DOCUMENTS } from '@/constants/appConstants'
import searchConstants from '@/constants/searchConstants'
const FileIcon = defineAsyncComponent(() => import('@components/Base/FileIcon'))

export default {
  name: 'SearchResultPreview',
  components: { FileIcon },
  props: {
    searchResult: {
      type: Object,
      required: true
    },
    isFile: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    fixedPosition: {
      type: Object,
      default: undefined
    }
  },
  emits: ['redirect'],
  data () {
    return {
      resultDetails: undefined
    }
  },
  computed: {
    formattedDate () {
      return dayjs(this.searchResult.date, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY')
    },
    isCollaborative () {
      return this.searchResult.service === searchConstants.TYPE_COLLABORATIVE_FILE || this.searchResult.service === searchConstants.TYPE_COLLABORATIVE_FOLDER
    }
  },
  created () {
    if (this.searchResult.service === searchConstants.TYPE_MESSAGE ||
        this.searchResult.service === searchConstants.TYPE_NEWS) {
      this.getResultDetails()
    }
  },
  mounted () {
    if (this.fixedPosition) {
      this.setPosition()
    }
  },
  updated () {
    if (this.fixedPosition) {
      this.setPosition()
    }
  },
  methods: {
    setPosition () {
      //  Set x position
      this.$refs.tooltip.style.left = this.fixedPosition.x + 'px'

      // Set y position, prevent windows overflow
      const domRect = this.$refs.tooltip.getBoundingClientRect()
      const yOverflow = (this.fixedPosition.y + domRect.height) - window.innerHeight
      if (yOverflow > 0) {
        this.$refs.tooltip.style.top = this.fixedPosition.y - yOverflow + 'px'
      } else {
        this.$refs.tooltip.style.top = this.fixedPosition.y + 'px'
      }
    },
    getResultDetails () {
      getSearchResultDetails(this.searchResult.entityId, this.searchResult.service).then((data) => {
        if (data.success) {
          this.resultDetails = data.result
          // Save query as an interesting query
          this.$store.dispatch('search/saveQuery')
        } else {
          console.error('Cannot get result details')
        }
      })
    },
    formatSize (size) {
      return formatSize(size)
    },
    redirectInDocument (folderId) {
      this.$emit('redirect', {
        routeName: this.isCollaborative ? 'GroupDocuments' : DOCUMENTS,
        params: { folderId }
      })
    },
    redirectInMessaging (messageId) {
      this.$emit('redirect', { routeName: 'Messagerie', params: { messageId } })
    },
    redirectInNews () {
      this.$emit('redirect', { isNews: true })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.result-details {
  display: flex;
  cursor: default;
  --icon-width: 40px;
}

.icon-container {
  padding-right: 5px;
  min-width: var(--icon-width);
  display: flex;
  justify-content: center;
  height: 30px;

  img {
    width: 30px;
    height: 30px;
  }
}

.content {
  flex: 1;
  max-width: calc(100% - var(--icon-width));

  .header {
    margin: 5px 0 0 0;
    font-weight: bold;
    display: flex;
    align-items: center;

    img {
      margin-left: 7px;
      height: 22px;
    }
  }

  .text {
    color: $color-new-light-text;
    font-size: 0.75em;
  }

  span {
    white-space: normal;
  }

  .attached-files {
    font-size: 0.75em;
    margin-top: 10px;
    font-weight: bold;
    display: flex;
    flex-wrap: wrap;
  }

  .folder {
    padding-top: 5px;
    font-size: 0.75em;
    font-weight: bold;

    a {
      cursor: pointer;
    }
  }

  .attached-file {
    margin-right: 10px;

    img {
      height: 15px;
    }
  }
}
</style>

<i18n locale="fr">
{
  "folder": "Dossier",
  "group": "Espace",
  "news": "Annonce",
  "message": "Message",
  "1": "Actualités",
  "2": "Actualités",
  "3": "Messagerie",
  "4": "Messagerie",
  "5": "Document",
  "6": "Document",
  "7": "Document collaboratif",
  "8": "Document collaboratif",
  "9": "Progression",
  "10": "Progression",
  "11": "Progression",
  "12": "Progression",
  "18": "Agenda"
}
</i18n>
