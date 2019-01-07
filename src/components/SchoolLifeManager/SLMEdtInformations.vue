<template>
  <div>
    <p v-t="'SchoolLifeManager.SLMEdtInformations.edtLabel'" />
    <p v-t="'SchoolLifeManager.SLMEdtInformations.lastReceivedLabel'" />
    <p v-t="'SchoolLifeManager.SLMEdtInformations.lastDoneLabel'" />
    <div v-if="isAdministrator">
      <NeroCheckbox
        v-model="isMembershipsSynchronizationActive"
        :label="$t('SchoolLifeManager.SLMEdtInformations.groupsCheckbox')"
      />
      <NeroCheckbox
        v-model="isNotebookSynchronizationActive"
        :label="$t('SchoolLifeManager.SLMEdtInformations.notebookCheckbox')"
      />

      <div v-if="isNotebookSynchronizationActive">
        <NeroCheckbox
          v-model="isAgendaSynchronizationActive"
          :label="$t('SchoolLifeManager.SLMEdtInformations.agendaCheckbox')"
        />
        <h5 v-t="'SchoolLifeManager.SLMEdtInformations.filtersLabel'" />
        TODO period date pickers
        TODO teacher dropdown
        TODO class dropdown
      </div>

      <p>TODO file input</p>

      <NeroButton
        :label="$t('SchoolLifeManager.SLMEdtInformations.synchronizeButton')"
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
  name: 'SLMEdtInformations',
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
