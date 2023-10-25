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
      :aria-label="$t('unreadFilter')"
      :title="$t('unreadFilter')"
      @click="toggleUndoneOnly"
    >
      <CustomIcon
        :icon-name="undoneOnly ? 'icon-filter-plain' : 'icon-filter'"
        class="unread-filter-icon"
        :class="{'theme-text-color': undoneOnly}"
      />
    </button>
  </header>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import Pellet from '@components/Base/Pellet.vue'

export default {
  name: 'HomeworkHeader',
  components: { CustomIcon, Pellet },
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
  @extend %widget-header;
}

.header-pellet {
  @extend %dashboard-header-pellet;
}

.read-only-button {
  margin-left: 10px;
  @extend %read-only-button;
}
</style>

<i18n locale="fr">
{
  "homeworks": "À faire",
  "unreadFilter": "Filtrer les non faits"
}
</i18n>
