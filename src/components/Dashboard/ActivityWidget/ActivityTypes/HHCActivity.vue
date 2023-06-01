<template>
  <div
    class="hhc-activity"
    :class="{'pending': isPendingFiring}"
    :tabindex="isPendingFiring ? 0 : -1"
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
        {{ isPendingFiring ? $t('setFiringReason') : activity.author }}
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
import activityConstants from '@/constants/activityConstants'
import dayjs from 'dayjs'

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
      return dayjs(this.activity.modificationDate, 'YYYY-MM-DD HH:mm').calendar()
    },
    isPendingFiring () {
      return this.activity.type === activityConstants.TYPE_PENDING_RENVOI
    },
    description () {
      switch (this.activity.type) {
        case activityConstants.TYPE_PENDING_RENVOI:
          return this.$t('TYPE_PENDING_RENVOI', { firedUser: this.activity.target, courseName: this.activity.groupName, courseDate: this.activity.sessionDate })
        case activityConstants.TYPE_SCHOOL_RENVOI:
          return this.$t('TYPE_SCHOOL_RENVOI', { firedUser: this.activity.target, courseName: this.activity.groupName, courseDate: this.activity.sessionDate })
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

<i18n locale="fr">
{
  "TYPE_SCHOOL_RENVOI": "a renvoyé {firedUser} du cours de {courseName} du {courseDate}",
  "TYPE_PENDING_RENVOI": "Pensez à motiver le renvoi de {firedUser} du cours de {courseName} du {courseDate}",
  "setFiringReason": "Motivation de renvoi"
}
</i18n>
