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
        {{ getHeader(activity) }}
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
      return dayjs(this.activity.modificationDate, DATE_EXCHANGE_FORMAT).format(this.$t('on') + ' DD MMMM YYYY ' + this.$t('at') + ' HH:mm')
    },
    description () {
      switch (this.activity.type) {
        case activityConstants.TYPE_FILE_CREATION:
          return this.$t('TYPE_FILE_CREATION')
        case activityConstants.TYPE_FILE_MODIFICATION:
          return this.$t('TYPE_FILE_MODIFICATION')
        case activityConstants.TYPE_FILE_MOVE:
          return this.$t('TYPE_FILE_MOVE')
        case activityConstants.TYPE_FILE_DELETION:
          return this.$t('TYPE_FILE_DELETION')
        case activityConstants.TYPE_FOLDER_CREATION:
          return this.$t('TYPE_FOLDER_CREATION')
        case activityConstants.TYPE_FOLDER_MODIFICATION:
          return this.$t('TYPE_FOLDER_MODIFICATION')
        case activityConstants.TYPE_FOLDER_MOVE:
          return this.$t('TYPE_FOLDER_MOVE')
        case activityConstants.TYPE_FOLDER_DELETION:
          return this.$t('TYPE_FOLDER_DELETION')
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design/index';

.doc-activity {
  @extend %activity-item;

  .readOnly {
    font-style: italic;
  }
}

</style>

<i18n locale="fr">
{
  "TYPE_FILE_CREATION": "a partagé le fichier ",
  "TYPE_FILE_MODIFICATION": "a renommé le fichier ",
  "TYPE_FILE_MOVE": "a déplacé le fichier ",
  "TYPE_FILE_DELETION": "a supprimé le fichier",
  "TYPE_FOLDER_CREATION": "a partagé le dossier ",
  "TYPE_FOLDER_MODIFICATION": "a renommé le dossier ",
  "TYPE_FOLDER_MOVE": "a déplacé le dossier ",
  "TYPE_FOLDER_DELETION": "a supprimé le dossier",
  "on": "Le",
  "at": "à"
}
</i18n>
