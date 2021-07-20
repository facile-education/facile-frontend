<template>
  <!-- <b>{{ arg.timeText }}</b> -->
  <div class="fc-event-title">
    {{ arg.event.title }}
  </div>
  <div v-if="arg.event.extendedProps.teachers">
    {{ arg.event.extendedProps.teachers }}
  </div>
  <div class="fc-event-room">
    {{ arg.event.extendedProps.room }}
  </div>
</template>

<script>
export default {
  name: 'FCEvent',
  props: {
    arg: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
