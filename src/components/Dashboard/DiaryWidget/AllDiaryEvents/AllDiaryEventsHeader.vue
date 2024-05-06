<template>
  <div class="header">
    <div class="left">
      <RouterLink
        class="back"
        :to="'/' + $t('Menu.route.dashboard')"
        :title="$t('Dashboard.AllDiaryEventsHeader.dashboard')"
      >
        <CustomIcon :icon-name="'icon-chevron-right-m'" />
      </RouterLink>
      <h1
        v-t="'Dashboard.AllDiaryEventsHeader.header'"
        @click="back"
      />
      <Pellet
        v-if="nbNewEvents > 0"
        class="header-pellet"
        :count="nbNewEvents"
        :show-count="true"
      />
      <button
        class="read-only-button"
        :aria-label="$t('Dashboard.AllDiaryEventsHeader.unreadFilter')"
        :title="$t('Dashboard.AllDiaryEventsHeader.unreadFilter')"
        data-test="eventUnRealOnly"
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
      v-if="canCreateDiaryEvent"
      class="create-button"
      @click="isCreateModalDisplayed = true"
    />
  </div>

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
    back () {
      this.$router.push('/' + this.$t('Menu.route.dashboard'))
    },
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
  text-decoration: none;
  color: inherit;

  .icon-chevron-right-m {
    font-size: 2rem;
    transform: rotate(180deg);
  }
}

.read-only-button {
  @extend %read-only-button;
}

.create-button {
  margin-left: 10px;
}
</style>
