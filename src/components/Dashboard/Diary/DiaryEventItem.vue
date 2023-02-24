<template>
  <div class="diary-event">
    {{ event.title }}
  </div>
</template>

<script>
export default {
  name: 'DiaryEventItem',
  props: {
    event: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.diary-event {
  height: 47px;
  width: 355px;
  border-radius: 5px;
  background-color: #FDF7F7;
}

</style>
