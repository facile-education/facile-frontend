<template>
  <header>
    <div class="left">
      <h2 v-t="'Dashboard.DiaryHeader.diary'" />
      <Pellet
        v-if="nbNewEvents > 0"
        class="header-pellet"
        :count="nbNewEvents"
        :show-count="true"
      />
      <button
        class="read-only-button"
        :aria-label="$t('Dashboard.DiaryHeader.unreadFilter')"
        :title="$t('Dashboard.DiaryHeader.unreadFilter')"
        data-test="ReadOnlyEventButton"
        @click="toggleReadOnly"
      >
        <CustomIcon
          :icon-name="unReadOnly ? 'icon-filter-plain' : 'icon-filter'"
          class="unread-filter-icon"
          :class="{'theme-text-color': unReadOnly}"
        />
      </button>
    </div>
    <div class="right">
      <button
        v-t="'Dashboard.DiaryHeader.showMore'"
        class="show-more"
        @click="showMore"
      />
      <CreateButton
        v-if="canCreateDiaryEvent"
        :title="$t('Dashboard.DiaryHeader.create-event')"
        data-test="buttonCreateEvent"
        @click="isCreateModalDisplayed = true"
      />
    </div>
  </header>

  <teleport
    v-if="isCreateModalDisplayed"
    to="body"
  >
    <SaveDiaryEventModal
      @create-event="createEvent"
      @close="isCreateModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import CreateButton from '@components/Base/CreateButton.vue'
import CustomIcon from '@components/Base/CustomIcon.vue'
import Pellet from '@components/Base/Pellet.vue'
import { defineAsyncComponent } from 'vue'
const SaveDiaryEventModal = defineAsyncComponent(() => import('@components/Dashboard/DiaryWidget/SaveDiaryEventModal.vue'))

export default {
  name: 'DiaryHeader',
  components: { CustomIcon, SaveDiaryEventModal, CreateButton, Pellet },
  props: {
    nbNewEvents: {
      type: Number,
      default: 0
    },
    unReadOnly: {
      type: Boolean,
      required: true
    }
  },
  emits: ['createEvent', 'updateUnreadOnly'],
  data () {
    return {
      isCreateModalDisplayed: false
    }
  },
  computed: {
    canCreateDiaryEvent () {
      return this.$store.state.dashboard.canAddEvents
    }
  },
  methods: {
    toggleReadOnly () {
      this.$emit('updateUnreadOnly', !this.unReadOnly)
    },
    createEvent () {
      this.$emit('createEvent')
    },
    showMore () {
      this.$router.push({ name: 'AllEvents' })
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

  .left, .right{
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
