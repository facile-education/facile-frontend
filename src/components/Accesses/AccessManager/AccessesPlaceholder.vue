<template>
  <div class="placeholder">
    <span v-t="'noAccess'" />
    <!--    <em-->
    <!--      v-t="'createAccess'"-->
    <!--      @click="$emit('createAccess')"-->
    <!--    />-->
  </div>
</template>

<script>
export default {
  name: 'AccessesPlaceholder',
  emits: ['createAccess']
}
</script>

<style lang="scss" scoped>
@import "@design";

.placeholder {
  margin-left: 30px;
  margin-top: 10px;
  height: 10vh;
  width: calc(100% - 30px);
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
  "createAccess": "Ajoutez un accès"
}
</i18n>
