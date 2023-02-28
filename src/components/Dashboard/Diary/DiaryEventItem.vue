<template>
  <div class="container">
    <div
      class="diary-event"
      :class="{'theme-border-color': !event.hasRead}"
    >
      <div class="date theme-text-color">
        <div class="day-label">
          {{ eventDay }}
        </div>
        <b class="day-number-label">
          {{ eventDayNumber }}
        </b>
      </div>
      <div
        class="content"
        :title="event.title"
      >
        <div class="meta-data">
          <span>{{ event.location }}</span>
          <span>{{ ' - ' + eventHour }}</span>
        </div>
        <strong class="title">
          {{ event.title }}
        </strong>
      </div>
      <div
        v-if="!event.hasRead"
        class="pellet theme-background-color"
      />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'DiaryEventItem',
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  computed: {
    eventDay () {
      return dayjs(this.event.startDate).format('dd')
    },
    eventDayNumber () {
      return dayjs(this.event.startDate).format('DD')
    },
    eventHour () {
      return dayjs(this.event.startDate).format('HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-right: 4px;
  padding-top: 4px;
  height: 50px;
}

.diary-event {
  position: relative;
  height: 100%;
  border-radius: 5px;
  background-color: #F4F8FF;
  display: flex;
  padding: 4px;
  --date-width: 41px;
  font-size: 14px;
  line-height: 18px;

  &.theme-border-color {
    border: 1px solid;
  }

  .pellet {
    --pellet_size: 16px;
    height: var(--pellet_size);
    width: var(--pellet_size);
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 100%;
    transform: translate(-75%, -25%);
  }
}

.date{
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: var(--date-width);
  text-align: center;

  .day-label {
    font-size: 12px;
    text-transform: uppercase;
  }
}

.content {
  width: calc(100% - var(--date-width));
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 4px;

  .meta-data {
    font-size: 12px;
  }

  .meta-data, .title {
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }
}

</style>
