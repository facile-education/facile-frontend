<template>
  <Layout>
    <h1 :aria-label="$t('serviceTitle')" />
    <CMToolbar />
    <div class="rules">
      <InternalRightList />
      <ExternalRightList />
    </div>
  </Layout>
</template>

<script>

import Layout from '@/router/layouts/EmptyLayout'
import CMToolbar from '@/components/CommunicationManager/CMToolbar'
import InternalRightList from '@/components/CommunicationManager/InternalRightList'
import ExternalRightList from '@/components/CommunicationManager/ExternalRightList'

export default {
  name: 'CommunicationManager',
  components: {
    CMToolbar,
    ExternalRightList,
    InternalRightList,
    Layout
  }
}
</script>

<style lang="scss" scoped>
.rules {
  padding: 5px;
}
</style>

<i18n locale="fr">
{
  "serviceTitle": "Administration des communications"
}
</i18n>
