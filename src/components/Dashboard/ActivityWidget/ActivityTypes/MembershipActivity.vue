<template>
  <div class="membership-activity">
    <div class="icon">
      <CustomIcon icon-name="icon-users" />
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
          -
          <a
            href="#"
            class="toggle-user-card user-card-link-new-light"
            @click.stop="openUserCardModal"
          >
            {{ activity.author }}
          </a>
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
import CustomIcon from '@components/Base/CustomIcon.vue'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import activityConstants from '@/constants/activityConstants'
import { GROUPS } from '@/constants/appConstants'

export default {
  name: 'MembershipActivity',
  components: { CustomIcon },
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
      return dayjs(this.activity.modificationDate, DATE_EXCHANGE_FORMAT).format(this.$t('Dashboard.MembershipActivity.activityTimeFormat'))
    },
    description1 () {
      switch (this.activity.type) {
        case activityConstants.TYPE_ADD_MEMBERSHIP:
          return this.$t('Dashboard.MembershipActivity.added')
        case activityConstants.TYPE_REMOVE_MEMBERSHIP:
          return this.$t('Dashboard.MembershipActivity.removed')
        default:
          return ''
      }
    },
    nbUsers () {
      return this.$t('Dashboard.MembershipActivity.nb-users', { nbUsers: this.activity.users.length })
    },
    description2 () {
      switch (this.activity.type) {
        case activityConstants.TYPE_ADD_MEMBERSHIP:
          return this.$t('Dashboard.MembershipActivity.inThisSpace')
        case activityConstants.TYPE_REMOVE_MEMBERSHIP:
          return this.$t('Dashboard.MembershipActivity.fromThisSpace')
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
          return this.$t('Dashboard.MembershipActivity.addedYou')
        case activityConstants.TYPE_REMOVE_MEMBERSHIP:
          return this.$t('Dashboard.MembershipActivity.removedYou')
        default:
          return ''
      }
    }
  },
  methods: {
    redirect () {
      this.$router.push({ name: GROUPS, params: { groupId: this.activity.groupId } })
    },
    openUserCardModal () {
      this.$store.dispatch('userCard/initUserCard', {
        userId: this.activity.actionUserId
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.membership-activity {
  @extend %activity-item;
}

.icon {
  width: 30px;

  .icon-users {
    font-size: 30px;
    color: black;
    text-decoration: none !important;
  }
}
</style>
