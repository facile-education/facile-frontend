<template>
  <div class="internal-rights">
    <template v-if="rightList">
      <h4 v-t="'CommunicationManager.InternalRights.title'"/>
      <p v-t="'CommunicationManager.InternalRights.informations'"/>
      <NeroDropdown
        v-if="showDropdown"
        :list="roleList"
        display-field="label"
        @dropdown-select="onRoleSelect"/>
      <div
        v-for="right in selectedRoleRightList"
        :key="right">
        <NeroCheckbox
          v-model="rightList[right]"
          :label="$t('CommunicationManager.InternalRights.' + removePrefix(right))"/>
      </div>
      <NeroButton
        :label="$t('CommunicationManager.InternalRights.save')"
        @click="onSave"/>
    </template>
    <NeroSpinner v-else/>
  </div>
</template>

<script>
import NeroCheckbox from '@/components/NeroCheckbox'
import NeroDropdown from '@/components/NeroDropdown'
import NeroButton from '@/components/NeroButton'
import NeroSpinner from '@/components/NeroSpinner'

export default {
  name: 'InternalRights',
  components: {
    NeroCheckbox,
    NeroDropdown,
    NeroButton,
    NeroSpinner
  },
  data () {
    return {
      selectedRole: undefined
    }
  },
  computed: {
    showDropdown () {
      return (this.roleList !== undefined)
    },
    roleList () {
      return this.$store.state.communicationManager.roleList
    },
    rightList () {
      return this.$store.state.communicationManager.internalRights
    },
    selectedRolePrefix () {
      var prefix
      if (this.selectedRole) {
        prefix = 'n' + this.selectedRole.roleCode.split('_')[1] + '_'
      }
      return prefix
    },
    selectedRoleRightList () {
      var results = []
      if (this.selectedRolePrefix && this.rightList) {
        var item
        for (item in this.rightList) {
          if (item.startsWith(this.selectedRolePrefix)) {
            results.push(item)
          }
        }
      }
      return results
    }
  },
  created () {
    if (this.roleList === undefined) {
      this.$store.dispatch('initCommunicationManagerRoleList')
    }
  },
  methods: {
    onRoleSelect (role) {
      this.selectedRole = role
    },
    onSave () {
      var schoolId = this.$store.state.communicationManager.selectedSchoolId
      this.$store.dispatch('updateSchoolInternalCommunicationRights',
        { schoolId, rightList: this.rightList })
    },
    removePrefix (right) {
      return right.replace(this.selectedRolePrefix, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.internal-rights {
  position: relative;
  min-height: 100px;
}
</style>
