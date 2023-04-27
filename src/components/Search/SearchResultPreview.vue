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
          <span>{{ $t(''+searchResult.service) }}</span>
          <span v-if="resultDetails.size">{{ ' - ' + formatSize(resultDetails.size) }}</span>
          <span v-if="resultDetails.section">{{ ' - ' + resultDetails.section }}</span>
          <span v-if="resultDetails.messagingFolder">{{ ' - ' + JSON.parse(resultDetails.messagingFolder).folderName }}</span>
          <span v-if="searchResult.groupName">{{ ' - ' + searchResult.groupName }}</span>
        </div>
        <div class="second-line">
          <span> {{ searchResult.date }}</span>
          <span> {{ ' - ' +searchResult.author }}</span>
        </div>
        <div class="third-line">
          <span v-if="resultDetails.description">{{ resultDetails.description }}</span>
        </div>
      </div>
      <div
        v-if="resultDetails && resultDetails.breadcrumb"
        class="breadcrumb"
      >
        <!-- TODO: remove all JSON.parse() when remove stubbing-->
        <div
          v-for="(folder, index) in JSON.parse(resultDetails.breadcrumb)"
          :key="index"
          class="breadcrumb-folder"
          @mousedown.stop="redirectInDocument(folder.folderId)"
        >
          {{ folder.folderName }}
        </div>
      </div>
      <div
        v-if="resultDetails && resultDetails.attachedFiles"
        class="attached-files"
      >
        <div
          v-for="(attachedFile, index) in JSON.parse(resultDetails.attachedFiles)"
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
import { getSearchResultDetails } from '@/api/search.service'
import FileIcon from '@components/Base/FileIcon.vue'
import { formatSize } from '@utils/commons.util'

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
    isCollaborative: {
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
  data () {
    return {
      resultDetails: undefined
    }
  },
  created () {
    this.getResultDetails()
  },
  updated () {
    if (this.fixedPosition) {
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
    }
  },
  methods: {
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
      this.$router.push({ name: this.isCollaborative ? 'GroupDocuments' : 'Documents', params: { folderId: folderId } })
      // Close panel
      this.$store.dispatch('search/closeQuickSearchResultDisplayed')
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
    margin: 5px 0 10px 0;
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

  .breadcrumb, .attached-files {
    font-size: 0.75em;
    margin-top: 10px;
    font-weight: bold;
    display: flex;
    flex-wrap: wrap;
  }

  .breadcrumb-folder {
    cursor: pointer;

    &:not(:last-child):after {
      content: "/";
      margin: 0 5px;
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
  "12": "Progression"
}
</i18n>
