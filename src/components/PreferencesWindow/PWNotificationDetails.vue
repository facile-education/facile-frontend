<template>
  <div>
    <p><em>TODO : Hidden if no Messaging || (no Dropbox && no News && no Documents & no Forums & no Agenda & no Groups)</em></p>
    <p v-t="'PreferencesWindow.PWNotificationDetails.panelExplanationText'" />
    <div>
      {{ $t('PreferencesWindow.PWNotificationDetails.servicesLabel') }}

      <NeroCheckbox :label="$t('PreferencesWindow.PWNotificationDetails.newsCheckboxLabel')" />
      <NeroCheckbox :label="$t('PreferencesWindow.PWNotificationDetails.agendaCheckboxLabel')" />
      <NeroCheckbox :label="$t('PreferencesWindow.PWNotificationDetails.dropboxCheckboxLabel')" />
      <NeroCheckbox :label="$t('PreferencesWindow.PWNotificationDetails.workspaceCheckboxLabel')" />
      <NeroCheckbox :label="$t('PreferencesWindow.PWNotificationDetails.forumsCheckboxLabel')" />
      <NeroCheckbox :label="$t('PreferencesWindow.PWNotificationDetails.synchronizationCheckboxLabel')" />
    </div>
    <div>
      {{ $t('PreferencesWindow.PWNotificationDetails.frequencyLabel') }}
      <NeroDropdown :list="[]" />
    </div>
  </div>
</template>

<script>
import NeroCheckbox from '@/components/Nero/NeroCheckbox'
import NeroDropdown from '@/components/Nero/NeroDropdown'

export default {
  name: 'PWNotificationDetails',
  components: {
    NeroCheckbox,
    NeroDropdown
  }
}
</script>

<style lang="scss" scoped>

</style>
