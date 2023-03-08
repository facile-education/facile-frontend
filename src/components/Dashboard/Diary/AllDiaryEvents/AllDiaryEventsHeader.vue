<template>
  <div class="header">
    <div class="left">
      <button
        class="previous-button"
        @click="back"
      >
        <img
          src="@assets/arrow-left.svg"
          :alt="$t('previous')"
          :title="$t('previous')"
        >
      </button>
      <h1 v-t="'header'" />
      <Pellet
        v-if="nbNewEvents > 0"
        class="header-pellet"
        :count="nbNewEvents"
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
    <DashboardCreateButton
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
import Pellet from '@components/Base/Pellet.vue'
import DashboardCreateButton from '@components/Dashboard/DashboardCreateButton.vue'
import { defineAsyncComponent } from 'vue'
const SaveDiaryEventModal = defineAsyncComponent(() => import('@/components/Dashboard/Diary/SaveDiaryEventModal.vue'))

export default {
  name: 'AllDiaryEventsHeader',
  components: { DashboardCreateButton, Pellet, SaveDiaryEventModal },
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
    },
    back () {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.header {
  display: flex;
  align-items: center;
  height: 48px;
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

.previous-button {
  width: 30px;
  height: 100%;
  background-color: white;
  cursor: pointer;
  border: none;

  img {
    width: 20px;
    height: 20px;
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
  "header": "Tous les événements",
  "previous": "Précédent",
  "errorPlaceholder": "Oups, une erreur est survenue..."
}
</i18n>
