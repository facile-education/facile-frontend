<template>
  <div
    class="membership-activity"
    tabindex="0"
    @click="redirect"
    @keyup.enter="redirect"
  >
    <div class="icon">
      <img
        class="img-icon"
        src="@/assets/icons/users.svg"
        alt="group icon"
      >
    </div>

    <div class="content">
      <div class="author">
        <i :title="activity.groupName">
          {{ activity.groupName }}
        </i>
        <span>
          {{ ' - ' + activity.author }}
        </span>
      </div>
      <div class="description">
        <span>
          {{ description }}
        </span>
      </div>
    </div>

    <div class="date">
      {{ formattedDate }}
    </div>
  </div>
</template>

<script>

import dayjs from 'dayjs'
import activityConstants from '@/constants/activityConstants'

export default {
  name: 'MembershipActivity',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedDate () {
      return dayjs(this.activity.modificationDate, 'YYYY-MM-DD HH:mm').calendar()
    },
    description () {
      switch (this.activity.type) {
        case activityConstants.TYPE_ADD_MEMBERSHIP:
          return this.$t('TYPE_ADD_MEMBERSHIP', { target: this.activity.target })
        case activityConstants.TYPE_REMOVE_MEMBERSHIP:
          return this.$t('TYPE_REMOVE_MEMBERSHIP')
        default:
          return 'Unknown activity type'
      }
    }
  },
  methods: {
    redirect () {
      this.$router.push('/groups/' + this.activity.groupId)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design/index';

.membership-activity {
  cursor: pointer;
  @extend %activity-item;
}

.img-icon {
  width: 30px;
}
</style>

<i18n locale="fr">
{
  "TYPE_ADD_MEMBERSHIP": "a inscrit {target} dans l'espace",
  "TYPE_REMOVE_MEMBERSHIP": "a désinscrit "
}
</i18n>
