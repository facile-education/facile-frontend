<template>
  <div class="membership-activity">
    <div class="icon">
      <img
        class="img-icon"
        src="@/assets/icons/users.svg"
        alt="group icon"
      >
    </div>

    <div class="content">
      <div class="author">
        <span
          v-if="activity.readOnly"
          class="readOnly"
        >
          {{ activity.groupName }}
        </span>
        <i
          v-else
          :title="activity.groupName"
          tabindex="0"
          @click="redirect"
          @keyup.enter="redirect"
        >
          {{ activity.groupName }}
        </i>
        <span>
          {{ ' - ' + activity.author }}
        </span>
      </div>
      <!-- Dashboard only lists the activity of the user himself -->
      <div
        v-if="isDashboard"
        class="description"
      >
        <span>
          {{ dashboardDescription }}
        </span>
      </div>
      <!-- Group activity lists all memberships operations -->
      <div
        v-else
        class="description"
      >
        <span>
          {{ description1 }}
        </span>
        <i
          :title="usersDetail"
        >
          {{ nbUsers }}
        </i>
        <span>
          {{ description2 }}
        </span>
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
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import activityConstants from '@/constants/activityConstants'
import { GROUPS } from '@/constants/appConstants'

export default {
  name: 'MembershipActivity',
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
    formattedDate () {
      return dayjs(this.activity.modificationDate, DATE_EXCHANGE_FORMAT).calendar()
    },
    formattedDateLong () {
      return dayjs(this.activity.modificationDate, DATE_EXCHANGE_FORMAT).format(this.$t('on') + ' DD MMMM YYYY ' + this.$t('at') + ' HH:mm')
    },
    isDeactivation () {
      return this.activity.type === activityConstants.TYPE_EXPIRED_GROUP
    },
    description1 () {
      switch (this.activity.type) {
        case activityConstants.TYPE_ADD_MEMBERSHIP:
          return this.$t('added')
        case activityConstants.TYPE_REMOVE_MEMBERSHIP:
          return this.$t('removed')
        default:
          return ''
      }
    },
    nbUsers () {
      return this.$t('nb-users', { nbUsers: this.activity.users.length })
    },
    description2 () {
      switch (this.activity.type) {
        case activityConstants.TYPE_ADD_MEMBERSHIP:
          return this.$t('in-this-space')
        case activityConstants.TYPE_REMOVE_MEMBERSHIP:
          return this.$t('from-this-space')
        default:
          return ''
      }
    },
    usersDetail () {
      let usersDetails = ''
      let nbDisplayedUsers = 0
      for (const user of this.activity.users) {
        usersDetails += user.firstName + ' ' + user.lastName
        nbDisplayedUsers++
        if (nbDisplayedUsers > 100) {
          usersDetails += ' ...'
          break
        }
        if (nbDisplayedUsers !== this.activity.users.length) {
          usersDetails += ', '
        }
      }
      return usersDetails
    },
    dashboardDescription () {
      switch (this.activity.type) {
        case activityConstants.TYPE_ADD_MEMBERSHIP:
          return this.$t('added-you')
        case activityConstants.TYPE_REMOVE_MEMBERSHIP:
          return this.$t('removed-you')
        default:
          return ''
      }
    }
  },
  methods: {
    redirect () {
      this.$router.push({ name: GROUPS, params: { groupId: this.activity.groupId } })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design/index';

.membership-activity {
  @extend %activity-item;
}

.img-icon {
  width: 30px;
}
</style>

<i18n locale="fr">
{
  "on": "Le",
  "at": "à",
  "added-you": "vous a inscrit dans cet espace",
  "added": "a inscrit ",
  "removed-you": "vous a désinscrit de cet espace",
  "removed": "a désinscrit ",
  "nb-users": "{nbUsers} utilisateurs ",
  "in-this-space": "dans cet espace",
  "from-this-space": "de cet espace"
}
</i18n>
