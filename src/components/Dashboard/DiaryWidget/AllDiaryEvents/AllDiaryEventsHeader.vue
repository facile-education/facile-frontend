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
        v-if="nbNewEvents > 0"
        class="header-pellet"
        :count="nbNewEvents"
        :show-count="true"
      />
      <button
        class="read-only-button"
        :aria-label="$t('unreadFilter')"
        :title="$t('unreadFilter')"
        @click="toggleReadOnly"
      >
        <CustomIcon
          icon-name="icon-filtres"
          class="unread-filter-icon"
          :class="{'theme-text-color': unReadOnly}"
        />
      </button>
    </div>
    <CreateButton
      v-if="canCreateDiaryEvent"
      @click="isCreateModalDisplayed = true"
    />
  </div>

  <teleport
    v-if="isCreateModalDisplayed"
    to="body"
  >
    <SaveDiaryEventModal
      @createEvent="createEvent"
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
  name: 'AllDiaryEventsHeader',
  components: { CustomIcon, CreateButton, Pellet, SaveDiaryEventModal },
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
  emits: ['toggleReadOnly', 'createEvent'],
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
  created () {
    if (this.canCreateDiaryEvent === undefined) {
      this.$store.dispatch('dashboard/initDashboard')
    }
  },
  methods: {
    toggleReadOnly () {
      this.$emit('toggleReadOnly')
    },
    createEvent () {
      this.$emit('createEvent')
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
  "header": "Tous les événements",
  "dashboard": "Tableau de bord",
  "unreadFilter": "Filtrer les non lu",
  "errorPlaceholder": "Oups, une erreur est survenue..."
}
</i18n>
