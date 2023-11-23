<template>
  <CourseContentBlocks
    v-if="sessionContent.blocks && sessionContent.blocks.length > 0"
    :content-blocks="sessionContent.blocks"
    class="content"
  />
  <div
    v-else
    v-t="'courseContentPlaceholder'"
    class="placeholder"
  />
</template>

<script>
import { defineAsyncComponent } from 'vue'

const CourseContentBlocks = defineAsyncComponent(() => import('@components/Course/CourseContentBlocks'))
export default {
  name: 'SessionContent',
  components: {
    CourseContentBlocks
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
  "courseContentPlaceholder": "Aucun contenu"
}
</i18n>
