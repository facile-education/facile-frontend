<template>
  <div>
    <p v-t="'SchoolLifeManager.EDTInformations.edtLabel'" />
    <p v-t="'SchoolLifeManager.EDTInformations.lastReceivedLabel'" />
    <p v-t="'SchoolLifeManager.EDTInformations.lastDoneLabel'" />
    <div v-if="isAdministrator">
      <NeroCheckbox
        v-model="isMembershipsSynchronizationActive"
        :label="$t('SchoolLifeManager.EDTInformations.groupsCheckbox')"
      />
      <NeroCheckbox
        v-model="isNotebookSynchronizationActive"
        :label="$t('SchoolLifeManager.EDTInformations.notebookCheckbox')"
      />

      <div v-if="isNotebookSynchronizationActive">
        <NeroCheckbox
          v-model="isAgendaSynchronizationActive"
          :label="$t('SchoolLifeManager.EDTInformations.agendaCheckbox')"
        />
        <h5 v-t="'SchoolLifeManager.EDTInformations.filtersLabel'" />
        TODO period date pickers
        TODO teacher dropdown
        TODO class dropdown
      </div>

      <p>TODO file input</p>

      <NeroButton
        :label="$t('SchoolLifeManager.EDTInformations.synchronizeButton')"
        @click="synchronize"
      />
    </div>
  </div>
</template>

<script>
// TODO Display dates
import NeroButton from '@/components/Nero/NeroButton'
import NeroCheckbox from '@/components/Nero/NeroCheckbox'
// import NeroDropdown from '@/components/Nero/NeroDropdown'

export default {
  name: 'EDTInformations',
  components: {
    NeroButton,
    NeroCheckbox
    // NeroDropdown
  },
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
