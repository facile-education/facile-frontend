<template>
  <div
    class="work-item"
    :title="work.title"
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
      <div class="title">
        {{ formattedTitle }}
      </div>
      <div class="given-date">
        {{ formattedGivenDate }}
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'

export default {
  name: 'WorkItem',
  props: {
    work: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedEstimatedTime () {
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
    formattedTitle () {
      const maxLength = 60
      if (this.work.title.length > maxLength) {
        return this.work.title.substr(0, maxLength - 3) + '...'
      } else {
        return this.work.title
      }
    },
    formattedGivenDate () {
      return this.$t('givenThe') + dayjs(this.work.sourceSessionDate, DATE_EXCHANGE_FORMAT).format('DD/MM')
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

.title {
  margin-bottom: 4px;
  line-height: 1.2rem;
}

</style>

<i18n locale="fr">
{
  "hourLabel": "h",
  "minuteLabel": "mn",
  "givenThe": "Donné le "
}
</i18n>
