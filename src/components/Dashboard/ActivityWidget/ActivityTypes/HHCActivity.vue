<template>
  <div
    class="hhc-activity"
    :class="{'pending': isPendingFiring}"
    :tabindex="isPendingFiring ? 0 : -1"
    :title="description"
    @click="redirect"
    @keyup.enter="redirect"
  >
    <div class="icon">
      <img
        class="img-icon"
        src="@/assets/icons/firing.svg"
        alt="group icon"
      >
    </div>

    <div class="content">
      <div class="author">
        {{ isPendingFiring ? $t('Dashboard.HHCActivity.setFiringReason') : activity.author }}
      </div>
      <div class="description">
        <span>
          {{ description }}
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
import { SCHOOL_LIFE } from '@/constants/appConstants'

export default {
  name: 'HHCActivity',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedDate () {
      return dayjs(this.activity.modificationDate, DATE_EXCHANGE_FORMAT).calendar()
    },
    formattedDateLong () {
      return dayjs(this.activity.modificationDate, DATE_EXCHANGE_FORMAT).format(this.$t('Dashboard.HHCActivity.on') + ' DD MMMM YYYY ' + this.$t('Dashboard.HHCActivity.at') + ' HH:mm')
    },
    isPendingFiring () {
      return this.activity.type === activityConstants.TYPE_PENDING_RENVOI
    },
    description () {
      switch (this.activity.type) {
        case activityConstants.TYPE_PENDING_RENVOI:
          return this.$t('TYPE_PENDING_RENVOI', { firedUser: this.activity.target, courseName: this.activity.sessionName, courseDate: this.formatDate(this.activity.sessionDate) })
        case activityConstants.TYPE_SCHOOL_RENVOI:
          return this.$t('TYPE_SCHOOL_RENVOI', { firedUser: this.activity.target, courseName: this.activity.sessionName, courseDate: this.formatDate(this.activity.sessionDate) })
        default:
          return 'Unknown activity type'
      }
    }
  },
  methods: {
    redirect () {
      if (this.isPendingFiring) {
        this.$router.push({ name: SCHOOL_LIFE })
      }
    },
    formatDate (date) {
      return dayjs(date, DATE_EXCHANGE_FORMAT).format(' DD MMMM YYYY ' + this.$t('Dashboard.HHCActivity.at') + ' HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design/index';

.hhc-activity {
  @extend %activity-item;

  &.pending {
    cursor: pointer;
  }
}

.img-icon {
  width: 30px;
}
</style>
