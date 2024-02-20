<template>
  <header>
    <div class="left">
      <h2 v-t="'Dashboard.HomeworkHeader.homeworks'" />
      <Pellet
        v-if="nbHomeworksUndone > 0"
        class="header-pellet"
        :count="nbHomeworksUndone"
        :show-count="true"
      />
      <button
        class="read-only-button"
        :aria-label="$t('Dashboard.HomeworkHeader.unreadFilter')"
        :title="$t('Dashboard.HomeworkHeader.unreadFilter')"
        data-test="doneFilter"
        @click="toggleUndoneOnly"
      >
        <CustomIcon
          :icon-name="undoneOnly ? 'icon-filter-plain' : 'icon-filter'"
          class="unread-filter-icon"
          :class="{'theme-text-color': undoneOnly}"
        />
      </button>
    </div>

    <button
      v-t="'Dashboard.HomeworkHeader.showMore'"
      class="show-more"
      @click="redirect"
    />
  </header>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import Pellet from '@components/Base/Pellet.vue'

import { COURSES } from '@/constants/appConstants'

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
    },
    redirect () {
      this.$router.push({ name: COURSES })
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
  justify-content: space-between;
  @extend %widget-header;

  .left{
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.read-only-button {
  @extend %read-only-button;
}

.show-more {
  @extend %show-more-button;
}
</style>
