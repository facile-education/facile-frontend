<template>
  <div class="header">
    <div class="left">
      <RouterLink
        class="back"
        :to="'/' + $t('Menu.route.dashboard')"
      >
        <img
          src="@assets/icons/chevron_left.svg"
          :alt="$t('Dashboard.AllAnnouncementsHeader.dashboard')"
          :title="$t('Dashboard.AllAnnouncementsHeader.dashboard')"
        >
      </RouterLink>
      <h1
        v-t="'Dashboard.AllAnnouncementsHeader.header'"
        @click="back"
      />
      <Pellet
        v-if="nbNewAnnouncements > 0"
        class="header-pellet"
        :count="nbNewAnnouncements"
        :show-count="true"
      />
      <button
        class="read-only-button"
        :aria-label="$t('Dashboard.AllAnnouncementsHeader.unreadFilter')"
        :title="$t('Dashboard.AllAnnouncementsHeader.unreadFilter')"
        @click="toggleReadOnly"
      >
        <CustomIcon
          :icon-name="unReadOnly ? 'icon-filter-plain' : 'icon-filter'"
          class="unread-filter-icon"
          :class="{'theme-text-color': unReadOnly}"
        />
      </button>
    </div>
    <CreateButton
      v-if="canCreateAnnouncements"
      class="create-button"
      @click="isCreateModalDisplayed = true"
    />
  </div>

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
  name: 'AllAnnouncementsHeader',
  components: { CustomIcon, SaveNewsModal, Pellet, CreateButton },
  props: {
    nbNewAnnouncements: {
      type: Number,
      default: 0
    },
    unReadOnly: {
      type: Boolean,
      required: true
    }
  },
  emits: ['toggleReadOnly', 'createAnnouncement'],
  data () {
    return {
      isCreateModalDisplayed: false
    }
  },
  computed: {
    canCreateAnnouncements () {
      return this.$store.state.dashboard.canAddSchoolNews
    }
  },
  created () {
    if (this.canCreateAnnouncements === undefined) {
      this.$store.dispatch('dashboard/initDashboard')
    }
  },
  methods: {
    back () {
      this.$router.push('/' + this.$t('Menu.route.dashboard'))
    },
    toggleReadOnly () {
      this.$emit('toggleReadOnly')
    },
    createAnnouncement () {
      this.$emit('createAnnouncement')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.header {
  display: flex;
  align-items: center;
  height: $all-events-header-height;
  justify-content: space-between;

  .left {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-grow: 1;
    min-width: 0;
  }
}

h1 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @extend %font-heading-s;
}

.back {
  width: 30px;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 20px;
    height: 20px;
  }
}

.read-only-button {
  @extend %read-only-button;
}

.create-button {
  margin-left: 10px;
}
</style>
