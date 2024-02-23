<template>
  <div class="course-activity">
    <div class="icon">
      <CustomIcon
        v-if="isCourse"
        class="img-icon"
        icon-name="icon-seance"
      />
      <CustomIcon
        v-else
        class="img-icon"
        icon-name="icon-homework"
      />
    </div>

    <div
      class="content"
      @click="redirect"
      @keyup.enter="redirect"
    >
      <div class="author">
        {{ getHeader(activity) }}
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
import CustomIcon from '@components/Base/CustomIcon.vue'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import activityConstants from '@/constants/activityConstants'
import { COURSES } from '@/constants/appConstants'

export default {
  name: 'SessionActivity',
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
      return dayjs(this.activity.modificationDate, DATE_EXCHANGE_FORMAT).format(this.$t('Dashboard.SessionActivity.on') + ' DD MMMM YYYY ' + this.$t('Dashboard.SessionActivity.at') + ' HH:mm')
    },
    isCourse () {
      return this.activity.type === activityConstants.TYPE_SESSION
    },
    description () {
      switch (this.activity.type) {
        case activityConstants.TYPE_SESSION:
          return this.$t('Dashboard.SessionActivity.TYPE_SESSION', { courseDate: dayjs(this.activity.targetDate, DATE_EXCHANGE_FORMAT).format('DD MMMM YYYY') })
        case activityConstants.TYPE_HOMEWORK:
          return this.$t('Dashboard.SessionActivity.TYPE_HOMEWORK', { homeworkDate: dayjs(this.activity.targetDate, DATE_EXCHANGE_FORMAT).format('DD MMMM YYYY') })
        default:
          return this.$t('Dashboard.SessionActivity.unknown-activity')
      }
    }
  },
  methods: {
    redirect () {
      if (this.isCourse) {
        this.$router.push({
          name: COURSES,
          query: {
            courseId: this.activity.groupId,
            toDate: dayjs(this.activity.targetDate, DATE_EXCHANGE_FORMAT).format('YYYY-MM-DD-HH:mm')
          }
        })
      } else {
        this.$router.push({
          name: COURSES,
          query: {
            homeworkId: this.activity.homeworkId,
            toDate: dayjs(this.activity.targetDate, DATE_EXCHANGE_FORMAT).format('YYYY-MM-DD')
          }
        })
      }
    },
    getHeader (activity) {
      return (this.isDashboard ? activity.groupName + ' - ' : '') + activity.author
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design/index';

.course-activity {
  @extend %activity-item;
  cursor: pointer;
}

.img-icon {
  width: 30px;
  text-align: center;
  color: #316CD4;
  font-size: 1.5rem;
}
</style>
