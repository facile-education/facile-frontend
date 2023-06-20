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

import CMToolbar from '@/components/CommunicationManager/CMToolbar'
import ExternalRightList from '@/components/CommunicationManager/ExternalRightList'
import InternalRightList from '@/components/CommunicationManager/InternalRightList'
import Layout from '@/router/layouts/BannerLayout'

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
