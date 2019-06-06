<template>
  <div>
    <p><em>TODO : Hidden if no Messaging || (no Dropbox && no News && no Documents & no Forums & no Agenda & no Groups)</em></p>
    <p v-t="'PreferencesWindow.NotificationDetails.panelExplanationText'" />
    <div>
      {{ $t('PreferencesWindow.NotificationDetails.servicesLabel') }}

      <PentilaCheckbox :label="$t('PreferencesWindow.NotificationDetails.newsCheckboxLabel')" />
      <PentilaCheckbox :label="$t('PreferencesWindow.NotificationDetails.agendaCheckboxLabel')" />
      <PentilaCheckbox :label="$t('PreferencesWindow.NotificationDetails.dropboxCheckboxLabel')" />
      <PentilaCheckbox :label="$t('PreferencesWindow.NotificationDetails.workspaceCheckboxLabel')" />
      <PentilaCheckbox :label="$t('PreferencesWindow.NotificationDetails.forumsCheckboxLabel')" />
      <PentilaCheckbox :label="$t('PreferencesWindow.NotificationDetails.synchronizationCheckboxLabel')" />
    </div>
    <div>
      {{ $t('PreferencesWindow.NotificationDetails.frequencyLabel') }}
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
