<template>
  <div>
    <p><em>TODO : Hidden if no Dropbox && no Documents && no Agenda && no scheduler</em></p>
    <p v-t="'PreferencesWindow.BackupDetails.explanationText'" />
    <p v-t="'PreferencesWindow.BackupDetails.warningText'" />

    <div>
      {{ $t('PreferencesWindow.BackupDetails.selectionLabel') }}
      <NeroCheckbox :label="$t('PreferencesWindow.BackupDetails.dropboxCheckboxLabel')" />
      <NeroCheckbox :label="$t('PreferencesWindow.BackupDetails.workspaceCheckboxLabel')" />
      <div>
        <NeroCheckbox :label="$t('PreferencesWindow.BackupDetails.agendaCheckboxLabel')" />
        <p v-t="'PreferencesWindow.BackupDetails.startDateLabel'" /> TODO Datepicker
        <p v-t="'PreferencesWindow.BackupDetails.endDateLabel'" /> TODO Datepicker
      </div>
      <div>
        <NeroCheckbox :label="$t('PreferencesWindow.BackupDetails.schedulerCheckboxLabel')" />
        <p v-t="'PreferencesWindow.BackupDetails.startDateLabel'" /> TODO Datepicker
        <p v-t="'PreferencesWindow.BackupDetails.endDateLabel'" /> TODO Datepicker
      </div>
    </div>

    <NeroButton
      :title="$t('PreferencesWindow.BackupDetails.copyButtonTitle')"
      :label="$t('PreferencesWindow.BackupDetails.copyButtonLabel')"
      @click="onCopy"
    />
  </div>
</template>

<script>
import NeroButton from '@/components/Nero/NeroButton'
import NeroCheckbox from '@/components/Nero/NeroCheckbox'

export default {
  name: 'BackupDetails',
  components: {
    NeroButton,
    NeroCheckbox
  },
  methods: {
    onCopy () {
      console.log('on copy')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
