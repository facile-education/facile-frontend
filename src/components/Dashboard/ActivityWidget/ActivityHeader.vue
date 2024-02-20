<template>
  <header>
    <div class="left">
      <RouterLink
        v-if="displayAll"
        class="back"
        :to="'/' + $t('Menu.route.dashboard')"
      >
        <img
          src="@assets/icons/chevron_left.svg"
          :alt="$t('Dashboard.ActivityHeader.dashboard')"
          :title="$t('Dashboard.ActivityHeader.dashboard')"
        >
      </RouterLink>
      <h1
        v-if="displayAll"
        v-t="'Dashboard.ActivityHeader.allActivities'"
      />
      <h2
        v-else
        v-t="'Dashboard.ActivityHeader.activities'"
      />
      <Pellet
        v-if="nbNewActivities > 0"
        class="header-pellet"
        :count="nbNewActivities"
        :show-count="true"
        :and-more="andMore"
      />
    </div>
    <div
      class="right"
    >
      <button
        v-if="!displayAll"
        v-t="'Dashboard.ActivityHeader.showMore'"
        class="show-more"
        @click="$router.push({ name: 'AllActivities' })"
      />
      <CreateButton
        v-if="canCreateNews"
        data-test="CreateActivity"
        :title="$t('Dashboard.ActivityHeader.create-news')"
        @click="isCreateModalDisplayed = true"
      />
    </div>
  </header>

  <teleport
    v-if="isCreateModalDisplayed"
    to="body"
  >
    <SaveNewsModal
      @create="$emit('createNews')"
      @close="isCreateModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import CreateButton from '@components/Base/CreateButton.vue'
import Pellet from '@components/Base/Pellet.vue'
import { defineAsyncComponent } from 'vue'

import activityConstants from '@/constants/activityConstants'
const SaveNewsModal = defineAsyncComponent(() => import('@components/Dashboard/AnnouncementsWidget/SaveNewsModal.vue'))

export default {
  name: 'ActivityHeader',
  components: { SaveNewsModal, CreateButton, Pellet },
  props: {
    nbNewActivities: {
      type: Number,
      default: 0
    },
    displayAll: {
      type: Boolean,
      default: false
    }
  },
  emits: ['createNews'],
  data () {
    return {
      isCreateModalDisplayed: false
    }
  },
  computed: {
    canCreateNews () {
      return this.$store.state.dashboard.canAddGroupNews
    },
    andMore () {
      return this.nbNewActivities >= activityConstants.nbActivityInWidget
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

header {
  @extend %widget-header;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left, .right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

h1 {
  font-size: 1.5em;
  text-transform: uppercase;
}

h2 {
  @extend %widget-h2;
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

.show-more {
  @extend %show-more-button;
}

</style>
