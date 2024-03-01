<template>
  <div class="doc-activity">
    <div class="icon">
      <img
        v-if="isFolder"
        class="img-icon"
        :src="folderIcon"
        alt="document icon"
      >
      <FileIcon
        v-else
        :file="{extension: getExtension(activity)}"
        width="30px"
      />
    </div>

    <div class="content">
      <div class="author">
        {{ isDashboard ? activity.groupName + ' - ' : '' }}
        <a
          href="#"
          class="user-card-link-new-light toggle-user-card"
          @click.stop="openUserCardModal"
        >
          {{ activity.author }}
        </a>
      </div>
      <div class="description">
        <span>
          {{ description }}
        </span>
        <i
          tabindex="0"
          :title="activity.target"
          @click="open"
          @keyup.enter="open"
        >
          {{ activity.target }}
        </i>
      </div>
    </div>

    <div
      class="date"
      :title="formattedDateLong"
    >
      {{ formattedDate }}
    </div>
  </div>
</template>

<script>
import FileIcon from '@components/Base/FileIcon.vue'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import activityConstants from '@/constants/activityConstants'
import { icons } from '@/constants/icons'
import { getExtensionFromName } from '@/utils/commons.util'

export default {
  name: 'DocActivity',
  components: { FileIcon },
  props: {
    activity: {
      type: Object,
      required: true
    },
    isDashboard: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    folderIcon () {
      return icons.folder
    },
    isFolder () {
      return this.activity.type === activityConstants.TYPE_FOLDER_CREATION ||
      this.activity.type === activityConstants.TYPE_FOLDER_MODIFICATION ||
      this.activity.type === activityConstants.TYPE_FOLDER_MOVE ||
      this.activity.type === activityConstants.TYPE_FOLDER_DELETION
    },
    isDeletion () {
      return this.activity.type === activityConstants.TYPE_FILE_DELETION || this.activity.type === activityConstants.TYPE_FOLDER_DELETION
    },
    formattedDate () {
      return dayjs(this.activity.modificationDate, DATE_EXCHANGE_FORMAT).calendar()
    },
    formattedDateLong () {
      return dayjs(this.activity.modificationDate, DATE_EXCHANGE_FORMAT).format(this.$t('Dashboard.DocActivity.on') + ' DD MMMM YYYY ' + this.$t('Dashboard.DocActivity.at') + ' HH:mm')
    },
    description () {
      switch (this.activity.type) {
        case activityConstants.TYPE_FILE_CREATION:
          return this.$t('Dashboard.DocActivity.TYPE_FILE_CREATION')
        case activityConstants.TYPE_FILE_MODIFICATION:
          return this.$t('Dashboard.DocActivity.TYPE_FILE_MODIFICATION')
        case activityConstants.TYPE_FILE_MOVE:
          return this.$t('Dashboard.DocActivity.TYPE_FILE_MOVE')
        case activityConstants.TYPE_FILE_DELETION:
          return this.$t('Dashboard.DocActivity.TYPE_FILE_DELETION')
        case activityConstants.TYPE_FOLDER_CREATION:
          return this.$t('Dashboard.DocActivity.TYPE_FOLDER_CREATION')
        case activityConstants.TYPE_FOLDER_MODIFICATION:
          return this.$t('Dashboard.DocActivity.TYPE_FOLDER_MODIFICATION')
        case activityConstants.TYPE_FOLDER_MOVE:
          return this.$t('Dashboard.DocActivity.TYPE_FOLDER_MOVE')
        case activityConstants.TYPE_FOLDER_DELETION:
          return this.$t('Dashboard.DocActivity.TYPE_FOLDER_DELETION')
        default:
          return 'Unknown activity type'
      }
    }
  },
  methods: {
    open () {
      if (!this.isDeletion) {
        if (this.isFolder) {
          this.$router.push('/documents/groups/' + this.activity.folderId)
        } else {
          this.$store.dispatch('documents/openFile', { ...this.activity, id: this.activity.fileId + '', name: this.activity.fileName, readOnly: false })
        }
      }
    },
    getExtension (activity) {
      return getExtensionFromName(activity.fileName)
    },
    getHeader (activity) {
      return (this.isDashboard ? activity.groupName + ' - ' : '') + activity.author
    },
    openUserCardModal () {
      this.$store.dispatch('userCard/initUserCard', {
        userId: this.activity.userId
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.doc-activity {
  @extend %activity-item;

  .readOnly {
    font-style: italic;
  }
}

</style>
