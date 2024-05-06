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
        <span v-if="isPendingFiring">{{ $t('Dashboard.HHCActivity.setFiringReason') }}</span>
        <a
          v-else
          href="#"
          class="toggle-user-card user-card-link-new-light"
          @click.stop="openUserCardModal(activity.teacherId)"
        >
          {{ activity.author }}
        </a>
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
      return dayjs(this.activity.modificationDate, DATE_EXCHANGE_FORMAT).format(this.$t('Dashboard.HHCActivity.activityTimeFormat'))
    },
    isPendingFiring () {
      return this.activity.type === activityConstants.TYPE_PENDING_RENVOI
    },
    description () {
      switch (this.activity.type) {
        case activityConstants.TYPE_PENDING_RENVOI:
          return this.$t('Dashboard.HHCActivity.TYPE_PENDING_RENVOI', {
            firedUser: this.activity.target,
            courseName: this.activity.sessionName,
            courseDate: this.formatDate(this.activity.sessionDate)
          })
        case activityConstants.TYPE_SCHOOL_RENVOI:
          return this.$t('Dashboard.HHCActivity.TYPE_SCHOOL_RENVOI', {
            firedUser: this.activity.target,
            courseName: this.activity.sessionName,
            courseDate: this.formatDate(this.activity.sessionDate)
          })
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
      return dayjs(date, DATE_EXCHANGE_FORMAT).format(this.$t('Dashboard.HHCActivity.courseDateFormat'))
    },
    openUserCardModal (userId) {
      this.$store.dispatch('userCard/initUserCard', { userId })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

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
