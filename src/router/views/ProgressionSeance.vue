<template>
  <Layout
    class="layout"
  >
    <h1 :aria-label="$t('serviceTitle')" />
    <PentilaSpinner v-if="areActionsInProgress" />
    <template v-if="contentList">
      <ProgressionItemContent
        v-for="content in contentList"
        :key="content.contentId"
        :content="content"
        :read-only="true"
        class="item-content"
      />
    </template>
  </Layout>
</template>

<script>
import { getItemContents } from '@/api/progression.service'
import ProgressionItemContent from '@/components/Progression/Edit/ProgressionItemContent'
import Layout from '@/router/layouts/BannerLayout'

export default {
  name: 'Progression',
  components: {
    Layout,
    ProgressionItemContent
  },
  data () {
    return {
      contentList: []
    }
  },
  computed: {
    areActionsInProgress () {
      return this.$store.getters['currentActions/areActionsInProgress']
    }
  },
  created () {
    // Watch route changes to react on progressionId change
    this.$watch(
      () => this.$route.params,
      () => {
        this.contentList.length = 0
        if (this.$route.params.itemId) {
          // Get item content
          getItemContents(this.$route.params.itemId).then(
            (data) => {
              if (data.success) {
                this.contentList = data.contents
              }
            },
            (err) => {
              // TODO toastr
              console.error(err)
            })
        }
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    )
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
}

.item-content {
  margin: 10px;
}
</style>

<i18n locale="fr">
{
  "serviceTitle": "Détail de la progression"
}
</i18n>
