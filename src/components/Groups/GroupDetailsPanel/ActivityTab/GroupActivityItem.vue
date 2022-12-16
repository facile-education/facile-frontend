<template>
  <div class="activity">
    <div class="icon">
      <img
        :src="computedIcon"
        alt=""
      >
    </div>
    <div class="activity-description">
      <div class="date-author">
        <span class="date">
          {{ formattedDate }} - {{ activity.author }}
        </span>
      </div>
      <span
        class="description"
        v-html="content"
      />
      <a
        v-if="(activityType === 'file' || activityType === 'folder') && activity.type != 4 && activity.type != 8"
        class="description"
        href="javascript:void(0);"
        @click="clickAttached"
      >
        {{ activity.target }}
      </a>
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
      } else if (this.activity.type === 13) {
        return 'news'
      } else if (this.activity.type === 14) {
        return 'homework'
      } else if (this.activity.type === 15) {
        return 'session'
      } else {
        return 'other'
      }
    },
    content () {
      let content = this.$t('Unknown')

      activityTypes.forEach(activityType => {
        if (this.activity.type === activityType.value) {
          content = this.$t(activityType.key, { target: this.activity.target })
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
      } else if (this.activityType === 'homework') {
        return require('@assets/devoir.svg')
      } else if (this.activityType === 'session') {
        return require('@assets/seance.svg')
      } else {
        return require('@assets/icon_news.svg')
      }
    }
  },
  methods: {
    clickAttached () {
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
  margin-top: 8px;
  padding: 10px;
  height: 60px;
  width: 100%;
  border-radius: 6px;
  border: 1px solid $color-border;
  display: flex;
  justify-content: space-between;
}

.icon {
  display: flex;
  align-items: center;
  width: 50px;

  img {
    margin-right: 10px;
    width: 43px;
  }
}
.activity-description {
  margin: auto;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  a {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}

.date-author {
  font-weight: 600;
}

.description {
  font-size: 0.8rem;
}
.date {
  font-size: 0.925rem;
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
  "TYPE_FOLDER_DELETION": "a supprimé le dossier {target}",
  "TYPE_ADD_MEMBERSHIP": "a inscrit <b>{target}</b> dans l'espace",
  "TYPE_REMOVE_MEMBERSHIP": "a supprimé <b>{target}</b> de l'espace",
  "TYPE_PENDING_RENVOI": "a renvoyé (pending) <b>{target}</b>",
  "TYPE_SCHOOL_RENVOI": "a renvoyé <b>{target}</b>",
  "TYPE_NEWS": "a diffusé {target}",
  "TYPE_HOMEWORK": "a donné un devoir à <b>{target}</b>",
  "TYPE_SESSION": "a renseigné le contenu de la séance <b>{target}</b>",
  "Unknown" : "Activité inconnue",
  "all": "tous",
  "students": "élèves"
}
</i18n>
