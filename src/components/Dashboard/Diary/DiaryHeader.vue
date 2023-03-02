<template>
  <div class="header">
    <div class="left">
      <h2 v-t="'diary'" />
      <Pellet
        v-if="nbNewEvents > 0"
        class="pellet"
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
  name: 'DiaryHeader',
  components: { SaveDiaryEventModal, DashboardCreateButton, Pellet },
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
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    display: flex;
    align-items: center;
  }

  h2{
    font-weight: normal;
    margin: 0.3em 0;
  }
}

.pellet {
  margin-left: 10px;
  height: 20px;
  width: 20px;
}

.read-only-button {
  height: 15px;
  width: 15px;
  padding: 0;
  background-color: white;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>

<i18n locale="fr">
{
  "diary": "Agenda"
}
</i18n>
