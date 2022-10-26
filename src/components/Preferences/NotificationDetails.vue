<template>
  <div>
    <p><em>TODO : Hidden if no Messaging || (no Dropbox && no News && no Documents & no Forums & no Agenda & no Groups)</em></p>
    <p v-t="'panelExplanationText'" />
    <div>
      {{ $t('servicesLabel') }}

      <PentilaCheckbox :label="$t('newsCheckboxLabel')" />
      <PentilaCheckbox :label="$t('agendaCheckboxLabel')" />
      <PentilaCheckbox :label="$t('dropboxCheckboxLabel')" />
      <PentilaCheckbox :label="$t('workspaceCheckboxLabel')" />
      <PentilaCheckbox :label="$t('forumsCheckboxLabel')" />
      <PentilaCheckbox :label="$t('synchronizationCheckboxLabel')" />
    </div>
    <div>
      {{ $t('frequencyLabel') }}
      <PentilaDropdown :list="[]" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'NotificationDetails'
}
</script>

<style lang="scss" scoped>

</style>

<i18n locale="fr">
{
  "agendaCheckboxLabel": "Agenda",
  "dropboxCheckboxLabel": "Casier",
  "forumsCheckboxLabel": "Messages des forums",
  "frequencyLabel": "Fréquence des notifications",
  "newsCheckboxLabel": "Actualités des groupes",
  "panelExplanationText": "Le service de notifications vous permet de rester informé des dernières ressources publiées dans votre ENT, en vous envoyant un récapitulatif dans votre messagerie interne.",
  "servicesLabel": "Suivre les services",
  "synchronizationCheckboxLabel": "Synchronisation des utilisateurs et des groupes",
  "workspaceCheckboxLabel": "Documents des groupes"
}
</i18n>
