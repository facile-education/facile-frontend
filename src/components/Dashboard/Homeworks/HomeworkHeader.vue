<template>
  <header>
    <h2 v-t="'homeworks'" />
    <Pellet
      v-if="nbHomeworksUndone > 0"
      class="header-pellet"
      :count="nbHomeworksUndone"
      :show-count="true"
    />
    <button
      class="read-only-button"
      @click="toggleUndoneOnly"
    >
      <img
        :src="undoneOnly ? require('@/assets/options/icon_unread_filter_active.svg') : require('@/assets/options/icon_unread_filter.svg')"
        alt="unread filter"
      >
    </button>
  </header>
</template>

<script>
import Pellet from '@components/Base/Pellet.vue'

export default {
  name: 'HomeworkHeader',
  components: { Pellet },
  props: {
    nbHomeworksUndone: {
      type: Number,
      default: 0
    },
    undoneOnly: {
      type: Boolean,
      required: true
    }
  },
  emits: ['updateUndoneOnly'],
  methods: {
    toggleUndoneOnly () {
      this.$emit('updateUndoneOnly', !this.undoneOnly)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

h2 {
  @extend %widget-h2;
}

header {
  display: flex;
  align-items: center;
}

.header-pellet {
  margin-left: 10px;
  @extend %dashboard-header-pellet;
}

.read-only-button {
  margin-left: 10px;
  @extend %read-only-button;
}
</style>

<i18n locale="fr">
{
  "homeworks": "Devoirs"
}
</i18n>
