<template>
  <div>
    <p><em>TODO : Hidden if no Dropbox && no Documents && no Agenda && no scheduler</em></p>
    <p v-t="'explanationText'" />
    <p v-t="'warningText'" />

    <div>
      {{ $t('selectionLabel') }}
      <PentilaCheckbox :label="$t('dropboxCheckboxLabel')" />
      <PentilaCheckbox :label="$t('workspaceCheckboxLabel')" />
      <div>
        <PentilaCheckbox :label="$t('agendaCheckboxLabel')" />
        <p v-t="'startDateLabel'" />
        <!-- Max date min date ? -->
        <DatePicker v-model="agendaStartDate">
          <template #default="{ inputValue, inputEvents }">
            <PentilaInput
              :value="inputValue"
              v-on="inputEvents"
            />
          </template>
        </DatePicker>

        <p v-t="'endDateLabel'" />
        <DatePicker v-model="agendaEndDate">
          <template #default="{ inputValue, inputEvents }">
            <PentilaInput
              :value="inputValue"
              v-on="inputEvents"
            />
          </template>
        </DatePicker>
      </div>
      <div>
        <PentilaCheckbox :label="$t('schedulerCheckboxLabel')" />
        <p v-t="'startDateLabel'" />
        <DatePicker v-model="scheduleStartDate">
          <template #default="{ inputValue, inputEvents }">
            <PentilaInput
              :value="inputValue"
              v-on="inputEvents"
            />
          </template>
        </DatePicker>
        <p v-t="'endDateLabel'" />
        <DatePicker v-model="scheduleEndDate">
          <template #default="{ inputValue, inputEvents }">
            <PentilaInput
              :value="inputValue"
              v-on="inputEvents"
            />
          </template>
        </DatePicker>
      </div>
    </div>

    <PentilaButton
      :title="$t('copyButtonTitle')"
      :label="$t('copyButtonLabel')"
      @click="onCopy"
    />
  </div>
</template>

<script>
import { DatePicker } from 'v-calendar'

export default {
  name: 'BackupDetails',
  components: { DatePicker },
  data () {
    return {
      agendaEndDate: undefined,
      agendaStartDate: undefined,
      scheduleEndDate: undefined,
      scheduleStartDate: undefined
    }
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

<i18n locale="fr">
{
  "agendaCheckboxLabel": "Mes agendas",
  "copyButtonLabel": "Copier mes données",
  "copyButtonTitle": "@:PreferencesWindow.BackupDetails.copyButtonLabel",
  "dropboxCheckboxLabel": "Casier",
  "endDateLabel": "Date de fin",
  "explanationText": "Toutes les données de l'ENT sont sauvegardées quotidiennement par les services techniques.",
  "selectionLabel": "Sélectionner les données à copier",
  "schedulerCheckboxLabel": "Mon cahier de texte",
  "startDateLabel": "Date de début",
  "warningText": "Ce service vous permet de réaliser une copie de vos données personnelles.",
  "workspaceCheckboxLabel": "Documents"
}
</i18n>
