<template>
  <div>
    <p><em>TODO : Hidden if no Dropbox && no Documents && no Agenda && no scheduler</em></p>
    <p v-t="'PreferencesWindow.BackupDetails.explanationText'" />
    <p v-t="'PreferencesWindow.BackupDetails.warningText'" />

    <div>
      {{ $t('PreferencesWindow.BackupDetails.selectionLabel') }}
      <PentilaCheckbox :label="$t('PreferencesWindow.BackupDetails.dropboxCheckboxLabel')" />
      <PentilaCheckbox :label="$t('PreferencesWindow.BackupDetails.workspaceCheckboxLabel')" />
      <div>
        <PentilaCheckbox :label="$t('PreferencesWindow.BackupDetails.agendaCheckboxLabel')" />
        <p v-t="'PreferencesWindow.BackupDetails.startDateLabel'" /> TODO Datepicker
        <p v-t="'PreferencesWindow.BackupDetails.endDateLabel'" /> TODO Datepicker
      </div>
      <div>
        <PentilaCheckbox :label="$t('PreferencesWindow.BackupDetails.schedulerCheckboxLabel')" />
        <p v-t="'PreferencesWindow.BackupDetails.startDateLabel'" /> TODO Datepicker
        <p v-t="'PreferencesWindow.BackupDetails.endDateLabel'" /> TODO Datepicker
      </div>
    </div>

    <PentilaButton
      :title="$t('PreferencesWindow.BackupDetails.copyButtonTitle')"
      :label="$t('PreferencesWindow.BackupDetails.copyButtonLabel')"
      @click="onCopy"
    />
  </div>
</template>

<script>
export default {
  name: 'BackupDetails',
  methods: {
    onCopy () {
      console.log('on copy')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
