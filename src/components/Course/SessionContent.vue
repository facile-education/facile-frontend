<template>
  <div>
    <Content
      v-for="content in blocks"
      :key="content"
      v-model="content.contentValue"
      :content="content"
    />
  </div>
</template>

<script>
import Content from '@/components/Course/Content.vue'

export default {
  name: 'SessionContent',
  components: {
    Content
  },
  inject: ['mq'],
  props: {
    session: {
      type: Object,
      required: true
    }
  },
  computed: {
    blocks () {
      return this.$store.state.course.selectedSession.blocks
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

</style>

<i18n locale="fr">
{
}
</i18n>
