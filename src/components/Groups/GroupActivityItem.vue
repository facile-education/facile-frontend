<template>
  <div class="activity">
    <div class="left-part">
      <img
        :src="computedIcon"
        alt=""
      >
      <div class="activity-description">
        <div class="author">
          {{ activity.userName }}
        </div>
        <div class="activity-type">
          <span>
            {{ formattedActivityType }}
          </span>
          <a
            v-if="link"
            href=""
            class="link"
            target="_blank"
            @click="clickAttached(link)"
          >
            {{ link.label }}
          </a>
        </div>
      </div>
    </div>

    <div class="date">
      {{ formattedDate }}
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { icons } from '@/constants/icons'
import { activityTypes } from '@/constants/activityConstants'
import { getExtensionFromName } from '@utils/commons.util'

export default {
  name: 'GroupActivityItem',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedDate () {
      return dayjs(this.activity.modificationDate).format('DD MMM YYYY')
    },
    activityType () { // See activityConstant.js for details
      if (this.activity.type < 9) {
        return 'documents'
      } else if (this.activity.type < 11) {
        return 'membership'
      } else {
        return 'schoollife'
      }
    },
    formattedActivityType () {
      let formattedText = ''

      switch (this.activity.type) {
        case activityTypes.TYPE_FILE_CREATION:
          formattedText = this.$t('TYPE_FILE_CREATION')
          break
        case activityTypes.TYPE_FILE_MODIFICATION:
          formattedText = this.$t('TYPE_FILE_MODIFICATION')
          break
        case activityTypes.TYPE_FILE_MOVE:
          formattedText = this.$t('TYPE_FILE_MOVE')
          break
        case activityTypes.TYPE_FILE_DELETION:
          formattedText = this.$t('TYPE_FILE_DELETION')
          break
        case activityTypes.TYPE_FOLDER_CREATION:
          formattedText = this.$t('TYPE_FOLDER_CREATION')
          break
        case activityTypes.TYPE_FOLDER_MODIFICATION:
          formattedText = this.$t('TYPE_FOLDER_MODIFICATION')
          break
        case activityTypes.TYPE_FOLDER_MOVE:
          formattedText = this.$t('TYPE_FOLDER_MOVE')
          break
        case activityTypes.TYPE_FOLDER_DELETION:
          formattedText = this.$t('TYPE_FOLDER_DELETION')
          break
        case activityTypes.TYPE_ADD_MEMBERSHIP:
          formattedText = this.$t('TYPE_ADD_MEMBERSHIP')
          break
        case activityTypes.TYPE_REMOVE_MEMBERSHIP:
          formattedText = this.$t('TYPE_REMOVE_MEMBERSHIP')
          break
        // TODO: others types
        default:
          formattedText = 'Unknown activity type: ' + this.activity.type + ' '
      }

      return formattedText
    },
    link () {
      if (this.activityType === 'documents') {
        if (this.activity.fileName !== '') {
          return { label: this.activity.fileName }
        } else {
          return { label: this.activity.folderName }
        }
      } else {
        return undefined
      }
    },
    computedIcon () {
      if (this.activityType === 'documents') {
        if (this.activity.fileName !== '') {
          const extension = getExtensionFromName(this.activity.fileName)
          if (icons.extensions[extension] === undefined) {
            return icons.file
          } else {
            const img = icons.extensions[extension]
            if (img.includes('.') || img.includes(':')) { // if icon contains extension (like folder.svg) it's not a font-awesome)
              return img
            } else {
              return icons.file
            }
          }
        } else {
          return icons.folder
        }
      } else if (this.activityType === 'membership') {
        return require('@/assets/icon_commu-black.svg')
      } else {
        return require('@/assets/devoir.svg')
      }
    }
  },
  methods: {
    clickAttached () {
      if (this.activityType === 'documents') {
        if (this.activity.fileName !== '' && !activityTypes.TYPE_FILE_DELETION) {
          this.$store.dispatch('documents/openFile', { ...this.activity.fileId, readOnly: true })
        } else if (this.activity.folderId !== '' && !activityTypes.TYPE_FOLDER_DELETION) {
          this.$router.push('documents/groups/' + this.activity.folderId)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.activity {
  margin-top: 15px;
  padding: 10px 15px;
  height: 75px;
  width: 100%;
  border-radius: 6px;
  border: 1px solid $color-border;
  display: flex;
  justify-content: space-between;

  .left-part {
    display: flex;
    align-items: center;

    img {
      margin-right: 20px;
    }

    .activity-description {
      display: flex;
      flex-direction: column;

      .author {

      }

      .activity-type {
        a {
          font-weight: 600;
        }
      }
    }

  }

  .date {
    font-size: 0.925rem;
  }
}

</style>

<i18n locale="fr">
{
  "TYPE_FILE_CREATION": "a partagé le fichier ",
  "TYPE_FILE_MODIFICATION": "a modifié le fichier ",
  "TYPE_FILE_MOVE": "a déplacé le fichier ",
  "TYPE_FILE_DELETION": "a supprimé le fichier ",
  "TYPE_FOLDER_CREATION": "a partagé le dossier ",
  "TYPE_FOLDER_MODIFICATION": "a modifié le dossier ",
  "TYPE_FOLDER_MOVE": "a déplacé le dossier ",
  "TYPE_FOLDER_DELETION": "a supprimé le dossier ",
  "TYPE_ADD_MEMBERSHIP": "a inscrit ",
  "TYPE_REMOVE_MEMBERSHIP": "a supprimé "
}
</i18n>
