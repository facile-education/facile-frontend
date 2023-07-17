<template>
  <ul v-if="session.blocks && session.blocks.length > 0">
    <li
      v-for="content in session.blocks"
      :key="content"
    >
      <Content
        v-model="content.contentValue"
        :content="content"
      />
    </li>
  </ul>
  <div
    v-else
    v-t="'courseContentPlaceholder'"
    class="placeholder"
  />
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
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.placeholder {
  @extend %content-placeholder;
}
</style>

<i18n locale="fr">
{
  "courseContentPlaceholder": "Aucun support de cours enregistré"
}
</i18n>
