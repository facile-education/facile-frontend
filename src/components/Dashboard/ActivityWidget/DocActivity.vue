<template>
  <div
    class="activity"
  >
    <img
      class="activity-thumbnail"
      :src="activity.thumbnailURL"
    >
    <div class="activity-infos">
      <span
        class="activity-description nero-text"
        v-html="convertActivity(activity)"
      />
      <span
        v-if="activity.type == 1 || activity.type == 2 || activity.type == 3"
        class="activity-description nero-text"
      >
        <a
          href
          @click="onViewFile(activity)"
        >
          {{ activity.fileName }}
        </a>
      </span>
      <span
        v-if="activity.type == 1 || activity.type == 2 || activity.type == 3"
        class="activity-description nero-text"
        v-html="convertEndActivity(activity)"
      />

      <!-- User -->
      <em v-if="activity.type == 9 || activity.type == 10">
        {{ activity.actionUserName }} -
      </em>

      <!-- Date -->
      <p
        class="date nero-text theme-color"
        title="activity.modificationDate"
        v-html="convertDateStr(activity.modificationDate)"
      />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'DocActivity',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    getActivityThumbnail (activity) {
      // Type from 1 to 4 : file activity
      // Type from 5 to 8 : folder activity
      // Type from 9 to 10 : membership activity
      // Type 11 and 12 : schoollife renvois

      activity.thumbnailURL = '/dashboard-portlet/img/activities/'
      if (activity.type <= 4) {
        activity.thumbnailURL += 'file_'
      } else if (activity.type <= 8) {
        activity.thumbnailURL += 'folder_'
      } else if (activity.type <= 10) {
        activity.thumbnailURL += 'member_'
      } else {
        activity.thumbnailURL += 'renvoi'
      }

      if (activity.type === 1 || activity.type === 5 || activity.type === 9) {
        activity.thumbnailURL += 'add'
      } else if (activity.type === 2 || activity.type === 6) {
        activity.thumbnailURL += 'update'
      } else if (activity.type === 3 || activity.type === 7) {
        activity.thumbnailURL += 'move'
      } else if (activity.type === 4 || activity.type === 8 || activity.type === 10) {
        activity.thumbnailURL += 'remove'
      }

      activity.thumbnailURL += '.png'
    },
    convertActivity (activity) {
      // Type from 1 to 4 : file activity
      // Type from 5 to 8 : folder activity
      // Type from 9 to 10 : membership activity
      // Type from 11 to 12 : schoollife renvois

      let activityStr = ''

      if (activity.type <= 8) {
        let link = ''
        let endLink = ''
        if (activity.type !== 4 && activity.type !== 8) {
          link = '<a href="' + activity.groupLink + '">'
          endLink = '</a>'
        }

        activityStr = activity.userName + ' a'

        if (activity.type === 1 || activity.type === 5) {
          activityStr += ' partagé'
        } else if (activity.type === 2 || activity.type === 6) {
          activityStr += ' modifié'
        } else if (activity.type === 3 || activity.type === 7) {
          activityStr += ' déplacé'
        } else if (activity.type === 4 || activity.type === 8) {
          activityStr += ' supprimé'
        }
        if (activity.type === 1 || activity.type === 2 || activity.type === 3 || activity.type === 4) {
          activityStr += ' le fichier '
          if (activity.type !== 4) {
            return activityStr
          }
          activityStr += ' le fichier ' + link + activity.fileName + endLink
        } else {
          activityStr += ' le dossier ' + link + activity.folderName + endLink
        }
        activityStr += ' dans le groupe ' + link + activity.groupName + endLink
      } else if (activity.type <= 10) {
        // Membership activity
        let userNames
        if (activity.shortTargetUserNames !== '') {
          userNames = activity.shortTargetUserNames
        } else {
          userNames = activity.targetUserNames
        }
        const pluriel = (activity.shortTargetUserNames !== '') ? 'es' : '(e)'
        if (activity.type === 9) {
          activityStr += userNames + ' ajouté' + pluriel + ' au groupe ' + activity.groupName
        } else if (activity.type === 10) {
          activityStr += userNames + ' retiré' + pluriel + ' du groupe ' + activity.groupName
        }
      } else if (activity.type === 11) {
        // Schoollife pending renvois for teachers
        const link = '<a href="#/horaires-hors-cadre">'
        const endLink = '</a>'

        activityStr += 'Merci de ' + link + 'justifier le renvoi de ' + activity.studentName + endLink + ' du cours de ' + activity.sessionSubject + ' le ' + activity.sessionDate
      } else if (activity.type === 12) {
        // Schoollife renvois for doyens
        activityStr += activity.teacherName + ' a renvoyé l élève ' + activity.studentName + ' du cours de ' + activity.sessionSubject + ' le ' + activity.sessionDate
      }
      activityStr += '.'
      return activityStr
    },

    convertEndActivity (activity) {
      let link = ''
      let endLink = ''
      if (activity.type !== 4) {
        link = '<a href="' + activity.groupLink + '">'
        endLink = '</a>'
      }
      return ' dans le groupe ' + link + activity.groupName + endLink
    },

    convertTitle (activity) {
      let activityStr = '/'
      if (activity.type <= 8) {
        if (activity.folderName !== 'Atelier du groupe') {
          activityStr += activity.folderName
        }
        activityStr += '/'
        if (activity.type === 1 || activity.type === 2 || activity.type === 3 || activity.type === 4) {
          // Operation on file
          activityStr += activity.fileName
        }
      } else {
        activityStr = activity.targetUserNames
      }
      return activityStr
    },
    convertDateStr (dateStr) {
      return dayjs(dateStr, 'YYYY-MM-DD HH:mm').format('DD MMM YYYY HH:mm')
    },
    onViewFile (file) {
      // TODO
    }
  }

}
</script>

<style lang="scss" scoped>
@import '@design';

.activity {
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  .activity-description, .date {
    font-size: 0.8em;
  }
}
p {
  margin: 5px;
}
</style>

<i18n locale="fr">
{
  "groups-activity": "Fil d'activité de mes groupes"
}
</i18n>
