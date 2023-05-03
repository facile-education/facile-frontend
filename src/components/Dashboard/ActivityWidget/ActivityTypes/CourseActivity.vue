<template>
  <div
    class="course-activity"
    tabindex="0"
    @click="redirect"
    @keyup.enter="redirect"
  >
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
    description () {
      switch (this.activity.type) {
        case activityConstants.TYPE_SESSION:
          return this.$t('TYPE_SESSION', { courseDate: this.activity.sessionDate })
        case activityConstants.TYPE_HOMEWORK:
          return this.$t('TYPE_HOMEWORK', { homeworkDate: this.activity.homeworkDate })
        default:
          return 'Unknown activity type'
      }
    }
  },
  methods: {
    redirect () {
      if (this.isPendingFiring) {
        this.$router.push({ name: 'Not usual slots' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design/index';

.course-activity {
  cursor: pointer;
  @extend %activity-item;
}

.img-icon {
  width: 35px;
}
</style>

<i18n locale="fr">
{
  "TYPE_SESSION": "a renseigné la séance du {courseDate}",
  "TYPE_HOMEWORK": "a donné une activité à faire pour le {homeworkDate}"
}
</i18n>
