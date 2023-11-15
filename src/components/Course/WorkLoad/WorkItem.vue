<template>
  <div
    class="work-item"
    :style="'background-color: ' + work.color + '; border-color: ' + work.color"
  >
    <div class="transparent-part">
      <div class="first-line">
        <div class="course-name">
          {{ work.cours }}
        </div>
        <strong
          v-if="work.estimatedTime"
          class="estimated-time"
        >
          {{ formattedEstimatedTime }}
        </strong>
      </div>
      <div class="given-date">
        {{ formattedGivenDate }}
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'WorkItem',
  props: {
    work: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedEstimatedTime () { // TODO: to merge with the one in StudentHomework
      if (this.work.estimatedTime) {
        const nbMinutes = this.work.estimatedTime
        const nbHour = Math.floor(nbMinutes / 60)
        if (nbHour > 0) {
          return nbHour + this.$t('hourLabel') + nbMinutes % 60
        } else {
          return nbMinutes + this.$t('minuteLabel')
        }
      } else {
        return undefined
      }
    },
    formattedGivenDate () {
      return this.$t('givenThe') + dayjs(this.work.sourceSessionDate, 'YYYY-MM-DD HH:mm').format('DD/MM')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.work-item {
  width: 100%;
  border-left: 5px solid;
  border-radius: 3px;
  font-size: 0.8rem;
}

.transparent-part {
  height: 100%;
  width: 100%;
  background-color: #FFFFFFDD;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.first-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.estimated-time {
  @extend %font-bold-l;
}

strong, .course-name, .given-date {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-name {
  @extend %font-regular-l;
}

</style>

<i18n locale="fr">
{
  "hourLabel": "h",
  "minuteLabel": "mn",
  "givenThe": "Donné le "
}
</i18n>
