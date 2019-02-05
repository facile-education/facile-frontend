<template>
  <div>
    <p><em>TODO : Hidden if no Dropbox && no Documents && no Agenda && no scheduler</em></p>
    <p v-t="'PreferencesWindow.PWBackupDetails.explanationText'" />
    <p v-t="'PreferencesWindow.PWBackupDetails.warningText'" />

    <div>
      {{ $t('PreferencesWindow.PWBackupDetails.selectionLabel') }}
      <NeroCheckbox :label="$t('PreferencesWindow.PWBackupDetails.dropboxCheckboxLabel')" />
      <NeroCheckbox :label="$t('PreferencesWindow.PWBackupDetails.workspaceCheckboxLabel')" />
      <div>
        <NeroCheckbox :label="$t('PreferencesWindow.PWBackupDetails.agendaCheckboxLabel')" />
        <p v-t="'PreferencesWindow.PWBackupDetails.startDateLabel'" /> TODO Datepicker
        <p v-t="'PreferencesWindow.PWBackupDetails.endDateLabel'" /> TODO Datepicker
      </div>
      <div>
        <NeroCheckbox :label="$t('PreferencesWindow.PWBackupDetails.schedulerCheckboxLabel')" />
        <p v-t="'PreferencesWindow.PWBackupDetails.startDateLabel'" /> TODO Datepicker
        <p v-t="'PreferencesWindow.PWBackupDetails.endDateLabel'" /> TODO Datepicker
      </div>
    </div>

    <NeroButton
      :title="$t('PreferencesWindow.PWBackupDetails.copyButtonTitle')"
      :label="$t('PreferencesWindow.PWBackupDetails.copyButtonLabel')"
      @click="onCopy"
    />
  </div>
</template>

<script>
import NeroButton from '@/components/Nero/NeroButton'
import NeroCheckbox from '@/components/Nero/NeroCheckbox'

export default {
  name: 'PWBackupDetails',
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
