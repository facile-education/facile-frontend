<template>
  <h2 class="msg">
    {{ $t('notAllowed') }}
  </h2>
</template>

<script>
export default {
  name: 'NotAllowed'
}
</script>

<style lang="scss" scoped>
.msg {
  text-align: center;
}
</style>

<i18n locale="fr">
{
  "notAllowed": "Vous ne possédez pas les droits requis pour accéder à ce service."
}
</i18n>
