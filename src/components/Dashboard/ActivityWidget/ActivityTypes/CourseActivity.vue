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

    <div class="content">
      <div class="author">
        {{ activity.author }}
      </div>
      <div class="description">
        <span>
          {{ description1 }}
        </span>
        <i
          tabindex="0"
          :title="activity.target"
          @click="redirect"
          @keyup.enter="redirect"
        >
          {{ isCourse ? $t('course') : $t('homework') }}
        </i>
        <span>
          {{ description2 }}
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
  name: 'CourseActivity',
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
    isCourse () {
      return this.activity.type === activityConstants.TYPE_SESSION
    },
    description1 () {
      switch (this.activity.type) {
        case activityConstants.TYPE_SESSION:
          return this.$t('TYPE_SESSION_1')
        case activityConstants.TYPE_HOMEWORK:
          return this.$t('TYPE_HOMEWORK_1')
        default:
          return 'Unknown activity type'
      }
    },
    description2 () {
      switch (this.activity.type) {
        case activityConstants.TYPE_SESSION:
          return this.$t('TYPE_SESSION_2', { courseDate: dayjs(this.activity.targetDate, 'YYYY-MM-DD HH:mm').format('DD MMMM YYYY') })
        case activityConstants.TYPE_HOMEWORK:
          return this.$t('TYPE_HOMEWORK_2', { homeworkDate: dayjs(this.activity.targetDate, 'YYYY-MM-DD HH:mm').format('DD MMMM YYYY') })
        default:
          return 'Unknown activity type'
      }
    }
  },
  methods: {
    redirect () {
      this.$router.push({ name: 'Planning' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design/index';

.course-activity {
  @extend %activity-item;
}

.img-icon {
  width: 35px;
}
</style>

<i18n locale="fr">
{
  "TYPE_SESSION_1": "a renseigné la ",
  "TYPE_SESSION_2": " du {courseDate}",
  "TYPE_HOMEWORK_1": "a donné une ",
  "TYPE_HOMEWORK_2": " à faire pour le {homeworkDate}",
  "course": "séance",
  "homework": "activité"
}
</i18n>
