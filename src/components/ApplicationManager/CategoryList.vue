<template>
  <div v-if="categories">
    <div
      v-for="category in categories"
      :key="category"
      class="category"
    >
      <h3 class="header">
        {{ category }}
        <!-- span v-if / v-t / class -->
        <span
          v-if="category === 'Création de contenu'"
          v-t="'documents-info'"
          class="info"
        />
      </h3>
      <ApplicationList :category="category" />
    </div>
  </div>
</template>

<script>
import ApplicationList from '@/components/ApplicationManager/ApplicationList'

export default {
  name: 'CategoryList',
  components: {
    ApplicationList
  },
  computed: {
    categories () {
      return this.$store.getters['applicationManager/categoryList']
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

.category {
  margin-bottom: 30px;
}

.header {
  margin-top: 0;
  margin-bottom: 5px;
  margin-left: 15px;
  padding: 10px 0;
  border-bottom: 1px solid $color-border;

  @extend %font-heading-s;
}

.info {
  text-transform: initial;
  font-style: italic;
}
</style>

<i18n locale="fr">
{
  "documents-info": " - Disponibles directement au sein du service \"Mes documents\""
}
</i18n>
