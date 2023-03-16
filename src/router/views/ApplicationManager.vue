<template>
  <Layout>
    <h1 :aria-label="$t('serviceTitle')" />
    <AMToolbar />
    <CategoryList />
    <div class="filler" />
    <teleport
      v-if="showBroadcastModal || showEditionModal"
      to="body"
    >
      <BroadcastScopeModal v-if="showBroadcastModal" />
      <ApplicationEditionModal v-if="showEditionModal" />
    </teleport>
  </Layout>
</template>

<script>

import Layout from '@/router/layouts/BannerLayout'
import AMToolbar from '@/components/ApplicationManager/AMToolbar'
import ApplicationEditionModal from '@/components/ApplicationManager/ApplicationEditionModal'
import BroadcastScopeModal from '@/components/ApplicationManager/BroadcastScopeModal'
import CategoryList from '@/components/ApplicationManager/CategoryList'

export default {
  name: 'ApplicationManager',
  components: {
    AMToolbar,
    ApplicationEditionModal,
    BroadcastScopeModal,
    CategoryList,
    Layout
  },
  computed: {
    showBroadcastModal () {
      return this.$store.state.applicationManager.showBroadcastModal
    },
    showEditionModal () {
      return this.$store.state.applicationManager.showEditionModal
    }
  },
  created () {
    if (this.$store.state.administration.schoolList === undefined) {
      this.$store.dispatch('administration/getAdministrationSchools').then(() => {
        this.$store.dispatch('applicationManager/getSchoolApplicationList', this.$store.state.administration.selectedSchool)
      })
    } else if (this.$store.state.applicationManager.applicationList === undefined) {
      this.$store.dispatch('applicationManager/getSchoolApplicationList', this.$store.state.administration.selectedSchool)
    }
  }
}
</script>

<style lang="scss" scoped>
.filler {
  padding: 40px;
}
</style>

<i18n locale="fr">
{
  "serviceTitle": "Administration des applications"
}
</i18n>
