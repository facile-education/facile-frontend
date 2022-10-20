<template>
  <Layout :is-allowed="$store.state.user.isAdministrator">
    <PentilaTabList class="tablist">
      <PentilaTabItem
        :title="$t('administration')"
        class="tab"
      >
        <Administration />
      </PentilaTabItem>
      <PentilaTabItem
        :title="$t('groups')"
        class="tab"
      >
        <Groups />
      </PentilaTabItem>
    </PentilaTabList>
  </Layout>
</template>

<script>

import Layout from '@/router/layouts/EmptyLayout'
import Administration from '@/components/Maintenance/Administration.vue'
import Groups from '@/components/Maintenance/Groups.vue'

export default {
  name: 'Maintenance',
  components: {
    Layout,
    Administration,
    Groups
  },
  inject: ['mq'],
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.tablist {
  height: 100%;
  display: flex;
  margin-left: 30px;
  margin-top: 30px;
}
</style>

<i18n locale="fr">
{
  "administration": "Administration",
  "groups": "Groupes "
}
</i18n>
