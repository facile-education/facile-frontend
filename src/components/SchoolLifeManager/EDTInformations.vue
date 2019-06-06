<template>
  <div>
    <p v-t="'SchoolLifeManager.EDTInformations.edtLabel'" />
    <p v-t="'SchoolLifeManager.EDTInformations.lastReceivedLabel'" />
    <p v-t="'SchoolLifeManager.EDTInformations.lastDoneLabel'" />
    <div v-if="isAdministrator">
      <PentilaCheckbox
        v-model="isMembershipsSynchronizationActive"
        :label="$t('SchoolLifeManager.EDTInformations.groupsCheckbox')"
      />
      <PentilaCheckbox
        v-model="isNotebookSynchronizationActive"
        :label="$t('SchoolLifeManager.EDTInformations.notebookCheckbox')"
      />

      <div v-if="isNotebookSynchronizationActive">
        <PentilaCheckbox
          v-model="isAgendaSynchronizationActive"
          :label="$t('SchoolLifeManager.EDTInformations.agendaCheckbox')"
        />
        <h5 v-t="'SchoolLifeManager.EDTInformations.filtersLabel'" />
        TODO period date pickers
        TODO teacher dropdown
        TODO class dropdown
      </div>

      <p>TODO file input</p>

      <PentilaButton
        :label="$t('SchoolLifeManager.EDTInformations.synchronizeButton')"
        @click="synchronize"
      />
    </div>
  </div>
</template>

<script>
// TODO Display dates

export default {
  name: 'EDTInformations',
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    isAgendaSynchronizationActive () {
      return this.$store.state.schoolLifeManager.isAgendaSynchronizationActive
    },
    isMembershipsSynchronizationActive () {
      return this.$store.state.schoolLifeManager.isMembershipsSynchronizationActive
    },
    isNotebookSynchronizationActive () {
      return this.$store.state.schoolLifeManager.isNotebookSynchronizationActive
    }
  },
  methods: {
    synchronize () {
      console.log('TODO synchronize')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
