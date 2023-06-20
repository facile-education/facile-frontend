<template>
  <header>
    <div class="left">
      <h2 v-t="'diary'" />
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
        <img
          :src="unReadOnly ? require('@/assets/options/icon_unread_filter_active.svg') : require('@/assets/options/icon_unread_filter.svg')"
          alt="unread filter"
        >
      </button>
    </div>
    <CreateButton
      v-if="canCreateDiaryEvent"
      :title="$t('create-event')"
      @click="isCreateModalDisplayed = true"
    />
  </header>

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
import Pellet from '@components/Base/Pellet.vue'
import { defineAsyncComponent } from 'vue'
const SaveDiaryEventModal = defineAsyncComponent(() => import('@components/Dashboard/DiaryWidget/SaveDiaryEventModal.vue'))

export default {
  name: 'DiaryHeader',
  components: { SaveDiaryEventModal, CreateButton, Pellet },
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
  "diary": "Agenda",
  "unreadFilter": "Filtrer les non lu",
  "create-event": "Créer un évènement"
}
</i18n>
