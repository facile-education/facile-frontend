<template>
  <div class="activity">
    <div class="left-part">
      <img
        :src="computedIcon"
        alt=""
      >
      <div class="activity-description">
        <span v-html="content" />
        <a
          v-if="(activityType === 'file' || activityType === 'folder') && activity.type != 4 && activity.type != 8"
          href="javascript:void(0);"
          @click="clickAttached"
        >
          {{ activity.target }}
        </a>
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
    activityType () { // See activityConstant.js for details
      if (this.activity.type < 5) {
        return 'file'
      } else if (this.activity.type < 9) {
        return 'folder'
      } else if (this.activity.type < 11) {
        return 'membership'
      } else if (this.activity.type < 13) {
        return 'schoollife'
      } else {
        return 'news'
      }
    },
    content () {
      let content = this.$t('Unknown')

      activityTypes.forEach(activityType => {
        if (this.activity.type === activityType.value) {
          content = this.$t(activityType.key, { author: this.activity.author, target: this.activity.target })
        }
      })
      return content
    },
    formattedDate () {
      return dayjs(this.activity.modificationDate).format('DD MMM YYYY')
    },
    computedIcon () {
      if (this.activityType === 'file') {
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
      } else if (this.activityType === 'folder') {
        return icons.folder
      } else if (this.activityType === 'membership') {
        return require('@assets/icon_commu-black.svg')
      } else if (this.activityType === 'schoollife') {
        // TODO
        return require('@assets/calendar.svg')
      } else if (this.activityType === 'news') {
        // TODO
        return require('@assets/icon_news.svg')
      } else {
        return require('@assets/devoir.svg')
      }
    }
  },
  methods: {
    clickAttached () {
      console.log('click attached', this.activityType, this.activity.fileId, this.activity.folderId)
      if (this.activityType === 'file' && this.activity.type !== activityTypes.TYPE_FILE_DELETION) {
        // Properties id (as string) and name are needed by FileDisplay component
        this.$store.dispatch('documents/openFile', { ...this.activity, id: this.activity.fileId + '', name: this.activity.fileName, readOnly: true })
      } else if (this.activityType === 'folder' && this.activity.type !== activityTypes.TYPE_FOLDER_DELETION) {
        this.$router.push('/documents/groups/' + this.activity.folderId)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.activity {
  margin-top: 15px;
  padding: 10px;
  height: 75px;
  width: 100%;
  border-radius: 6px;
  border: 1px solid $color-border;
  display: flex;
  justify-content: space-between;
}

.left-part {
  display: flex;
  align-items: center;
  width: 77%;

  img {
    margin-right: 10px;
    width: 25px;
  }
}

.activity-description a {
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.date {
  font-size: 0.925rem;
  width: 23%;
  text-align: right;
}
</style>

<i18n locale="fr">
{
  "TYPE_FILE_CREATION": "<b>{author}</b> a partagé le fichier ",
  "TYPE_FILE_MODIFICATION": "<b>{author}</b> a modifié le fichier ",
  "TYPE_FILE_MOVE": "<b>{author}</b> a déplacé le fichier ",
  "TYPE_FILE_DELETION": "<b>{author}</b> a supprimé le fichier {target}",
  "TYPE_FOLDER_CREATION": "<b>{author}</b> a partagé le dossier ",
  "TYPE_FOLDER_MODIFICATION": "<b>{author}</b> a renommé le dossier ",
  "TYPE_FOLDER_MOVE": "<b>{author}</b> a déplacé le dossier ",
  "TYPE_FOLDER_DELETION": "<b>{author}</b> a supprimé le dossier {target}",
  "TYPE_ADD_MEMBERSHIP": "<b>{author}</b> a inscrit <b>{target}</b> dans l'espace",
  "TYPE_REMOVE_MEMBERSHIP": "<b>{author}</b> a supprimé <b>{target}</b> de l'espace",
  "TYPE_PENDING_RENVOI": "<b>{author}</b> a renvoyé (pending) <b>{target}</b>",
  "TYPE_SCHOOL_RENVOI": "<b>{author}</b> a renvoyé <b>{target}</b>",
  "TYPE_NEWS": "<b>{author}</b> a diffusé {target}",
  "TYPE_HOMEWORK": "<b>{author}</b> a donné un devoir à <b>{target}</b>",
  "TYPE_SESSION": "<b>{author}</b> TODO <b>{target}</b>",
  "Unknown" : "Activité inconnue"
}
</i18n>
