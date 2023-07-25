<template>
  <ul v-if="sessionContent.blocks && sessionContent.blocks.length > 0">
    <li
      v-for="content in sessionContent.blocks"
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
    sessionContent: {
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

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 8px
}
</style>

<i18n locale="fr">
{
  "courseContentPlaceholder": "Aucun support de cours enregistré"
}
</i18n>
