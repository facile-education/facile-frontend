<template>
  <ActivityWidget :display-all="true" />
</template>

<script>
import ActivityWidget from '@components/Dashboard/ActivityWidget/ActivityWidget.vue'

export default {
  name: 'AllActivities',
  components: { ActivityWidget }
}
</script>

<style lang="scss" scoped>

</style>
