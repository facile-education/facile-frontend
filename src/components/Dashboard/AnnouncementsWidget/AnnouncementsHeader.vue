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
        :aria-label="$t('unreadFilter')"
        :title="$t('unreadFilter')"
        @click="toggleReadOnly"
      >
        <CustomIcon
          icon-name="icon-unread_filter"
          class="unread-filter-icon"
          :class="{'theme-text-color': unReadOnly}"
        />
      </button>
    </div>
    <div class="right">
      <CreateButton
        v-if="canCreateAnnouncement"
        :title="$t('create-annouce')"
        @click="isCreateModalDisplayed = true"
      />
      <button
        v-if="hasArrows"
        class="arrow-button"
        :class="{'disabled': !canScrollToLeft}"
        :disabled="!canScrollToLeft"
        @click="$emit('goPrevious')"
      >
        <BaseIcon
          class="left-arrow"
          :class="{'disabled': !canScrollToLeft}"
          name="chevron-up"
        />
      </button>
      <button
        v-if="hasArrows"
        class="arrow-button"
        :class="{'disabled': !canScrollToRight}"
        :disabled="!canScrollToRight"
        @click="$emit('goNext')"
      >
        <BaseIcon
          class="right-arrow"
          :class="{'disabled': !canScrollToRight}"
          name="chevron-up"
        />
      </button>
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
import BaseIcon from '@components/Base/BaseIcon.vue'
import CreateButton from '@components/Base/CreateButton.vue'
import CustomIcon from '@components/Base/CustomIcon.vue'
import Pellet from '@components/Base/Pellet.vue'
import { defineAsyncComponent } from 'vue'
const SaveNewsModal = defineAsyncComponent(() => import('@components/Dashboard/AnnouncementsWidget/SaveNewsModal.vue'))

export default {
  name: 'AnnouncementsHeader',
  components: { CustomIcon, BaseIcon, SaveNewsModal, CreateButton, Pellet },
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

h2 {
  @extend %widget-h2;
}

.header-pellet {
  margin-left: 10px;
  @extend %dashboard-header-pellet;
}

.read-only-button {
  margin-left: 10px;
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
  }
}

.arrow-button {
  width: 2rem;
  height: 100%;
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  margin: 0 0 0 1rem;
  border: none;
}

.left-arrow, .right-arrow {
  font-size: 1.3rem;
  color: $color-new-light-text;

  &.disabled {
    color: $color-border;
    background-color: transparent;
  }
}

.left-arrow {
  transform: rotate(-90deg);
}

.right-arrow {
  transform: rotate(90deg);
}

</style>

<i18n locale="fr">
{
  "announcements": "Annonces",
  "unreadFilter": "Filtrer les non lu",
  "create-annouce": "Créer une annonce"
}
</i18n>
