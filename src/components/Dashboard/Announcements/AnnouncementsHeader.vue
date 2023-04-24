<template>
  <header>
    <div class="left">
      <h2 v-t="'announcements'" />
      <Pellet
        v-if="nbNewAnnouncements > 0"
        class="header-pellet"
        :count="nbNewAnnouncements"
        :show-count="true"
      />
      <button
        class="read-only-button"
        @click="toggleReadOnly"
      >
        <img
          :src="unReadOnly ? require('@/assets/options/icon_unread_filter_active.svg') : require('@/assets/options/icon_unread_filter.svg')"
          alt="unread filter"
        >
      </button>
    </div>
    <CreateButton
      v-if="canCreateAnnouncement"
      @click="isCreateModalDisplayed = true"
    />
  </header>

  <teleport
    v-if="isCreateModalDisplayed"
    to="body"
  >
    <SaveAnnouncementModal
      @createAnnouncement="createAnnouncement"
      @close="isCreateModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import Pellet from '@components/Base/Pellet.vue'
import CreateButton from '@components/Base/CreateButton.vue'
import { defineAsyncComponent } from 'vue'
const SaveAnnouncementModal = defineAsyncComponent(() => import('@/components/Dashboard/Announcements/SaveAnnouncementModal.vue'))

export default {
  name: 'AnnouncementsHeader',
  components: { SaveAnnouncementModal, CreateButton, Pellet },
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
    toggleReadOnly () {
      this.$emit('updateUnreadOnly', !this.unReadOnly)
    },
    createAnnouncement () {
      this.$emit('createAnnouncement')
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

  .left {
    display: flex;
    align-items: center;
  }
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
  "announcements": "Annonces"
}
</i18n>
