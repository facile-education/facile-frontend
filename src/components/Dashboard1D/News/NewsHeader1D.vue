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
        v-if="isDisplayedShowMore"
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
  components: { SaveNewsModal, CreateButton, Pellet, CustomIcon },
  props: {
    nbNewAnnouncements: {
      type: Number,
      default: 0
    },
    isDisplayedShowMore: {
      type: Boolean,
      require: true
    },
    unReadOnly: {
      type: Boolean,
      required: true
    }
  },
  emits: ['createAnnouncement', 'updateUnreadOnly'],
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
    createAnnouncement () {
      this.$emit('createAnnouncement')
    },
    showMore () {
      this.$router.push({ name: 'AllAnnouncements' })
    },
    toggleReadOnly () {
      this.$emit('updateUnreadOnly', !this.unReadOnly)
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

.show-more {
  @extend %show-more-button;
}

</style>
