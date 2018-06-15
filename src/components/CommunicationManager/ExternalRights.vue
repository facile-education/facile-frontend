<template>
  <div v-if="rightList">
    <h4 v-t="'CommunicationManager.ExternalRights.title'"/>
    <p v-t="'CommunicationManager.ExternalRights.informations'"/>
    <ExternalRoleItem
      v-for="role in roleList"
      :key="role.roleId"
      :role="role"
      :current="rightList[role.roleCode]"
      @input="onInput"/>
    <NeroButton
      :label="$t('CommunicationManager.ExternalRights.save')"
      @click="onSave"/>
  </div>
</template>

<script>
import NeroButton from '@/components/NeroButton'
import ExternalRoleItem from '@/components/CommunicationManager/ExternalRoleItem'

export default {
  name: 'ExternalRights',
  components: {
    NeroButton,
    ExternalRoleItem
  },
  computed: {
    roleList () {
      return this.$store.state.communicationManager.roleList
    },
    rightList () {
      return this.$store.state.communicationManager.externalRights
    }
  },
  created () {
    if (this.roleList === undefined) {
      this.$store.dispatch('initCommunicationManagerRoleList')
    }
  },
  methods: {
    onSave () {
      var schoolId = this.$store.state.communicationManager.selectedSchoolId
      var result = {
        national1ExternalCommunicationActive: this.rightList.National_1,
        national2ExternalCommunicationActive: this.rightList.National_2,
        national3ExternalCommunicationActive: this.rightList.National_3,
        national4ExternalCommunicationActive: this.rightList.National_4,
        national7ExternalCommunicationActive: this.rightList.National_7
      }

      this.$store.dispatch('updateSchoolExternalCommunicationRights',
        { schoolId, rightList: result })
    },
    onInput (params) {
      this.$set(this.rightList, params.code, params.value)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
