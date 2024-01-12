<template>
  <div class="placeholder">
    <span v-t="'noAccess'" />
    <em
      v-t="'createCategory'"
      data-test="buttonAddCategoryPlaceholder"
      @click="$emit('createCategory')"
    />
  </div>
</template>

<script>
export default {
  name: 'CategoriesPlaceholder',
  emits: ['createCategory']
}
</script>

<style lang="scss" scoped>
@import "@design";

.placeholder {
  height: 20vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  text-align: center;
  border: 1px solid $color-border;
  border-radius: 6px;
}

em {
  // TODO: Uniform placeholder style with progression
  font-size: 0.9rem;
  margin-top: 5px;
  cursor: pointer;
  color: $color-link;
  text-decoration: underline;
  font-style: normal;
  font-weight: 600;
}
</style>

<i18n locale="fr">
{
  "noAccess": "Aucun accès",
  "createCategory": "Ajoutez votre première catégorie d'accès !"
}
</i18n>
