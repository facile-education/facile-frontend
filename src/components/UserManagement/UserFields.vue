<template>
  <div class="user-fields">
    <div
      v-for="(field, index) in fields"
      :key="index"
      v-t="field"
      class="field"
    />
  </div>
</template>

<script>
export default {
  name: 'UserFields',
  props: {
    fields: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.user-fields {
  height: $um-fields-height;
  width: 100%;
  display: flex;
  align-items: center;

  .field {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    font-weight: bold;
  }
}
</style>

<i18n locale="fr">
{
  "firstName": "Prénom",
  "lastName": "Nom",
  "roles": "Profil",
  "affectations": "Affectations",
  "isSchoolAdmin": "Administrateur local",
  "isNewsDelegate": "Rédacteur annonces"
}
</i18n>
