<template>
  <article>
    {{ initNews.title }}
  </article>
</template>

<script>
export default {
  name: 'NewsActivityDetails',
  props: {
    initNews: {
      type: Object,
      default: undefined
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
