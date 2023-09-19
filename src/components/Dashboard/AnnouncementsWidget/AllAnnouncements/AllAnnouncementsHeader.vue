<template>
  <div class="header">
    <div class="left">
      <RouterLink
        class="back"
        :to="'/' + $t('Menu.route.dashboard')"
      >
        <img
          src="@assets/arrow-left.svg"
          :alt="$t('dashboard')"
          :title="$t('dashboard')"
        >
      </RouterLink>
      <h1 v-t="'header'" />
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
          :icon-name="unReadOnly ? 'icon-filter-plain' : 'icon-filter'"
          class="unread-filter-icon"
          :class="{'theme-text-color': unReadOnly}"
        />
      </button>
    </div>
    <CreateButton
      v-if="canCreateAnnouncements"
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
  }
}

h1 {
  font-size: 1.5em;
  text-transform: uppercase;
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
  "header": "Toutes les annonces",
  "dashboard": "Tableau de bord",
  "unreadFilter": "Filtrer les non lues",
  "errorPlaceholder": "Oups, une erreur est survenue..."
}
</i18n>
