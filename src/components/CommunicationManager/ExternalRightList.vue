<template>
  <div class="external-rights">
    <Transition
      appear
      name="fade"
    >
      <div v-if="rightList">
        <h4 v-t="'CommunicationManager.ExternalRightList.title'" />
        <p v-t="'CommunicationManager.ExternalRightList.informations'" />
        <ExternalRoleItem
          v-for="role in roleList"
          :key="role.roleId"
          :role="role"
          :current="rightList[role.roleCode]"
          @input="onInput"
        />
        <WeprodeButton
          :label="$t('CommunicationManager.ExternalRightList.save')"
          @click="onSave"
        />
      </div>
      <WeprodeSpinner v-else />
    </Transition>
  </div>
</template>

<script>
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import ExternalRoleItem from '@/components/CommunicationManager/ExternalRoleItem'

export default {
  name: 'ExternalRightList',
  components: {
    ExternalRoleItem,
    WeprodeButton,
    WeprodeSpinner
  },
  data () {
    return {
      rightList: undefined
    }
  },
  computed: {
    roleList () {
      return this.$store.state.communicationManager.roleList
    },
    savedRightList () {
      return this.$store.state.communicationManager.externalRightList
    }
  },
  watch: {
    savedRightList (value) {
      this.rightList = value
    }
  },
  created () {
    if (this.roleList === undefined) {
      this.$store.dispatch('communicationManager/initCommunicationManagerRoleList')
    }
  },
  methods: {
    onSave () {
      const schoolId = this.$store.state.communicationManager.selectedSchoolId
      const result = {
        national1ExternalCommunicationActive: this.rightList.National_1,
        national2ExternalCommunicationActive: this.rightList.National_2,
        national3ExternalCommunicationActive: this.rightList.National_3,
        national4ExternalCommunicationActive: this.rightList.National_4,
        national7ExternalCommunicationActive: this.rightList.National_7
      }

      this.$store.dispatch('communicationManager/updateSchoolExternalCommunicationRights',
        { schoolId, rightList: result })
    },
    onInput (params) {
      this.$set(this.rightList, params.code, params.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.external-rights {
  position: relative;
  min-height: 100px;
}
</style>
