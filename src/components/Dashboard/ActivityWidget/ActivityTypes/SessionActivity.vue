<template>
  <div class="course-activity">
    <div class="icon">
      <img
        v-if="isCourse"
        class="img-icon"
        src="@/assets/seance.svg"
        alt="group icon"
      >
      <img
        v-else
        class="img-icon"
        src="@/assets/devoir.svg"
        alt="group icon"
      >
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
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import activityConstants from '@/constants/activityConstants'
import { COURSES } from '@/constants/appConstants'

export default {
  name: 'SessionActivity',
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
    isCourse () {
      return this.activity.type === activityConstants.TYPE_SESSION
    },
    description () {
      switch (this.activity.type) {
        case activityConstants.TYPE_SESSION:
          return this.$t('TYPE_SESSION', { courseDate: dayjs(this.activity.targetDate, DATE_EXCHANGE_FORMAT).format('DD MMMM YYYY') })
        case activityConstants.TYPE_HOMEWORK:
          return this.$t('TYPE_HOMEWORK', { homeworkDate: dayjs(this.activity.targetDate, DATE_EXCHANGE_FORMAT).format('DD MMMM YYYY') })
        default:
          return this.$t('unknown-activity')
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
  width: 35px;
}
</style>

<i18n locale="fr">
{
  "TYPE_SESSION": "a ajouté un support au cours du {courseDate}",
  "TYPE_HOMEWORK": "a donné du travail pour le cours du {homeworkDate}",
  "unknown-activity": "Activité inconnue",
  "on": "Le",
  "at": "à"
}
</i18n>
