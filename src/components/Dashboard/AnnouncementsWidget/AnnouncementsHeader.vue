<template>
  <header>
    <div class="left">
      <h2 v-t="'Dashboard.AnnouncementsHeader.announcements'" />
      <Pellet
        v-if="nbNewAnnouncements > 0"
        class="header-pellet"
        :count="nbNewAnnouncements"
        :show-count="true"
      />
      <button
        class="read-only-button"
        :aria-label="$t('Dashboard.AnnouncementsHeader.unreadFilter')"
        :title="$t('Dashboard.AnnouncementsHeader.unreadFilter')"
        data-test="ReadOnlyAnnouncementButton"
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
        v-t="'Dashboard.AnnouncementsHeader.showMore'"
        class="show-more"
        @click="showMore"
      />

      <CreateButton
        v-if="canCreateAnnouncement"
        :title="$t('Dashboard.AnnouncementsHeader.create-annouce')"
        data-test="buttonCreateAnnoucement"
        @click="isCreateModalDisplayed = true"
      />

      <div
        v-if="hasArrows"
        class="arrows"
      >
        <button
          class="arrow-button left-arrow"
          :class="{'disabled': !canScrollToLeft}"
          :disabled="!canScrollToLeft"
          @click="$emit('goPrevious')"
        >
          <CustomIcon icon-name="icon-chevron-left" />
        </button>
        <button
          class="arrow-button right-arrow"
          :class="{'disabled': !canScrollToRight}"
          :disabled="!canScrollToRight"
          @click="$emit('goNext')"
        >
          <CustomIcon icon-name="icon-chevron-left" />
        </button>
      </div>
    </div>
  </header>

  <teleport
    v-if="isCreateModalDisplayed"
    to="body"
  >
    <SaveNewsModal
      :is-school-news="true"
      @create="createAnnouncement"
      @close="isCreateModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import CreateButton from '@components/Base/CreateButton.vue'
import CustomIcon from '@components/Base/CustomIcon.vue'
import Pellet from '@components/Base/Pellet.vue'
import { defineAsyncComponent } from 'vue'
const SaveNewsModal = defineAsyncComponent(() => import('@components/Dashboard/AnnouncementsWidget/SaveNewsModal.vue'))

export default {
  name: 'AnnouncementsHeader',
  components: { CustomIcon, SaveNewsModal, CreateButton, Pellet },
  props: {
    nbNewAnnouncements: {
      type: Number,
      default: 0
    },
    unReadOnly: {
      type: Boolean,
      required: true
    },
    hasArrows: {
      type: Boolean,
      default: true
    },
    canScrollToRight: {
      type: Boolean,
      required: false
    },
    canScrollToLeft: {
      type: Boolean,
      required: false
    }
  },
  emits: ['createAnnouncement', 'updateUnreadOnly', 'goPrevious', 'goNext'],
  data () {
    return {
      isCreateModalDisplayed: false
    }
  },
  computed: {
    canCreateAnnouncement () {
      return this.$store.state.dashboard.canAddSchoolNews
    }
  },
  methods: {
    toggleReadOnly () {
      this.$emit('updateUnreadOnly', !this.unReadOnly)
    },
    createAnnouncement () {
      this.$emit('createAnnouncement')
    },
    showMore () {
      this.$router.push({ name: 'AllAnnouncements' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

h2 {
  @extend %widget-h2;
}

.read-only-button {
  @extend %read-only-button;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  @extend %widget-header;

  .left, .right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.arrows {
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.arrow-button {
  height: 1.3rem;
  width: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  border: none;
}

.right-arrow {
  transform: rotate(180deg);
}

.show-more {
  @extend %show-more-button;
}

</style>
