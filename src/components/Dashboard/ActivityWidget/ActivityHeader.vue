<template>
  <header>
    <button
      v-if="displayAll"
      class="previous-button"
      @click="$router.back()"
    >
      <img
        src="@assets/arrow-left.svg"
        :alt="$t('previous')"
        :title="$t('previous')"
      >
    </button>
    <h1
      v-if="displayAll"
      v-t="'allActivities'"
    />
    <h2
      v-else
      v-t="'activities'"
    />
    <Pellet
      v-if="nbNewActivities > 0"
      class="header-pellet"
      :count="nbNewActivities"
      :show-count="true"
      :and-more="andMore"
    />
  </header>
</template>

<script>
import Pellet from '@components/Base/Pellet.vue'
import activityConstants from '@/constants/activityConstants'

export default {
  name: 'ActivityHeader',
  components: { Pellet },
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
  computed: {
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
}

h1 {
  font-size: 1.5em;
  text-transform: uppercase;
}

h2 {
  @extend %widget-h2;
}

.header-pellet {
  margin-left: 10px;
  @extend %dashboard-header-pellet;
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
</style>

<i18n locale="fr">
{
  "activities": "Activités",
  "allActivities": "Toutes les activités"
}
</i18n>
