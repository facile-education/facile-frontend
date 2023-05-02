<template>
  <div
    class="doc-activity"
    tabindex="0"
    @click="redirect"
    @keyup.enter="redirect"
  >
    <div class="icon">
      <img
        v-if="isFolder"
        class="img-icon"
        :src="folderIcon"
        alt="document icon"
      >
      <FileIcon
        v-else
        :file="{extension: activity.extension}"
      />
    </div>

    <div class="content">
      <div class="author">
        {{ activity.author }}
      </div>
      <div class="description">
        {{ description + activity.target }}
      </div>
    </div>

    <div class="date">
      {{ formattedDate }}
    </div>
  </div>
</template>

<script>
import FileIcon from '@components/Base/FileIcon.vue'
import { icons } from '@/constants/icons'
import activityConstants from '@/constants/activityConstants'
import dayjs from 'dayjs'

export default {
  name: 'DocActivity',
  components: { FileIcon },
  props: {
    activity: {
      type: Object,
      required: true
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
      return dayjs(this.activity.modificationDate, 'YYYY-MM-DD HH:mm').calendar()
    },
    description () {
      switch (this.activity.type) {
        case activityConstants.TYPE_FILE_CREATION:
          return this.$t('TYPE_FILE_CREATION', { target: this.activity.target })
        case activityConstants.TYPE_FILE_MODIFICATION:
          return this.$t('TYPE_FILE_MODIFICATION', { target: this.activity.target })
        case activityConstants.TYPE_FILE_MOVE:
          return this.$t('TYPE_FILE_CREATION', { target: this.activity.target })
        case activityConstants.TYPE_FILE_DELETION:
          return this.$t('TYPE_FILE_DELETION', { target: this.activity.target })
        case activityConstants.TYPE_FOLDER_CREATION:
          return this.$t('TYPE_FOLDER_CREATION', { target: this.activity.target })
        case activityConstants.TYPE_FOLDER_MODIFICATION:
          return this.$t('TYPE_FOLDER_MODIFICATION', { target: this.activity.target })
        case activityConstants.TYPE_FOLDER_MOVE:
          return this.$t('TYPE_FOLDER_MOVE', { target: this.activity.target })
        case activityConstants.TYPE_FOLDER_DELETION:
          return this.$t('TYPE_FOLDER_DELETION', { target: this.activity.target })
        default:
          return 'Unknown activity type'
      }
    }
  },
  methods: {
    redirect () {
      if (!this.isDeletion) {
        this.$router.push('/documents/groups/' + this.activity.folderId)
        if (!this.isFolder) { // File
          // Properties id (as string) and name are needed by FileDisplay component
          this.$store.dispatch('documents/openFile', { ...this.activity, id: this.activity.fileId + '', name: this.activity.fileName, readOnly: false })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.doc-activity {
  cursor: pointer;
  @extend %activity-item;
}
</style>

<i18n locale="fr">
{
  "TYPE_FILE_CREATION": "a partagé le fichier ",
  "TYPE_FILE_MODIFICATION": "a modifié le fichier ",
  "TYPE_FILE_MOVE": "a déplacé le fichier ",
  "TYPE_FILE_DELETION": "a supprimé le fichier {target}",
  "TYPE_FOLDER_CREATION": "a partagé le dossier ",
  "TYPE_FOLDER_MODIFICATION": "a renommé le dossier ",
  "TYPE_FOLDER_MOVE": "a déplacé le dossier ",
  "TYPE_FOLDER_DELETION": "a supprimé le dossier {target}"
}
</i18n>
