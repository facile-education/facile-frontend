<template>
  <div class="entry">
    <i :class="classes"/>
    {{ entry.title }} -- {{ entry.date }} - {{ entry.size }} - {{ entry.contentType }}
  </div>
</template>

<script>
export default {
  name: 'FolderContentItem',
  props: {
    entry: {
      type: Object,
      required: true
    }
  },
  computed: {
    classes () {
      return this.entry.type === 'Fichier' ? 'fa fa-file ' : 'fa fa-folder'
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.entry {
  border-bottom: $border;

  &:hover {
    background-color: $menu-background-color;
  }
}
</style>
