<template>
  <div class="details-tab">
    <div class="expiration-date">
      {{ $t('expire') + formattedDate}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupActivityTab',
  props: {
    group: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
