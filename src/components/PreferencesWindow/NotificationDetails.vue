<template>
  <div>
    <p><em>TODO : Hidden if no Messaging || (no Dropbox && no News && no Documents & no Forums & no Agenda & no Groups)</em></p>
    <p v-t="'PreferencesWindow.NotificationDetails.panelExplanationText'" />
    <div>
      {{ $t('PreferencesWindow.NotificationDetails.servicesLabel') }}

      <NeroCheckbox :label="$t('PreferencesWindow.NotificationDetails.newsCheckboxLabel')" />
      <NeroCheckbox :label="$t('PreferencesWindow.NotificationDetails.agendaCheckboxLabel')" />
      <NeroCheckbox :label="$t('PreferencesWindow.NotificationDetails.dropboxCheckboxLabel')" />
      <NeroCheckbox :label="$t('PreferencesWindow.NotificationDetails.workspaceCheckboxLabel')" />
      <NeroCheckbox :label="$t('PreferencesWindow.NotificationDetails.forumsCheckboxLabel')" />
      <NeroCheckbox :label="$t('PreferencesWindow.NotificationDetails.synchronizationCheckboxLabel')" />
    </div>
    <div>
      {{ $t('PreferencesWindow.NotificationDetails.frequencyLabel') }}
      <NeroDropdown :list="[]" />
    </div>
  </div>
</template>

<script>
import NeroCheckbox from '@/components/Nero/NeroCheckbox'
import NeroDropdown from '@/components/Nero/NeroDropdown'

export default {
  name: 'NotificationDetails',
  components: {
    NeroCheckbox,
    NeroDropdown
  }
}
</script>

<style lang="scss" scoped>

</style>
