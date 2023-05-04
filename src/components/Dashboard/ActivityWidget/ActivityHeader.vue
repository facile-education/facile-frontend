<template>
  <header>
    <h2 v-t="'activities'" />
    <Pellet
      v-if="nbNewActivities > 0"
      class="header-pellet"
      :count="nbNewActivities"
      :show-count="true"
    />
  </header>
</template>

<script>
import Pellet from '@components/Base/Pellet.vue'

export default {
  name: 'ActivityHeader',
  components: { Pellet },
  props: {
    nbNewActivities: {
      type: Number,
      default: 0
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

h2 {
  @extend %widget-h2;
}

.header-pellet {
  margin-left: 10px;
  @extend %dashboard-header-pellet;
}
</style>

<i18n locale="fr">
{
  "activities": "Activités"
}
</i18n>
