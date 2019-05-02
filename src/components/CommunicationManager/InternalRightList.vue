<template>
  <div class="internal-rights">
    <Transition
      appear
      name="fade"
    >
      <div v-if="roleList">
        <h4 v-t="'CommunicationManager.InternalRightList.title'" />
        <p v-t="'CommunicationManager.InternalRightList.informations'" />
        <NeroTabList>
          <NeroTabItem
            v-for="role in roleList"
            :key="role.roleId"
            :title="role.label"
          >
            <InternalRoleTab
              :role="role"
              :right-list="rightList"
              @input="onInput"
            />
          </NeroTabItem>
        </NeroTabList>
        <NeroButton
          :label="$t('CommunicationManager.InternalRightList.save')"
          @click="onSave"
        />
      </div>
      <NeroSpinner v-else />
    </Transition>
  </div>
</template>

<script>
import NeroButton from '@/components/Nero/NeroButton'
import NeroSpinner from '@/components/Nero/NeroSpinner'
import NeroTabItem from '@/components/Nero/NeroTabItem'
import NeroTabList from '@/components/Nero/NeroTabList'
import InternalRoleTab from '@/components/CommunicationManager/InternalRoleTab'

export default {
  name: 'InternalRightList',
  components: {
    InternalRoleTab,
    NeroButton,
    NeroSpinner,
    NeroTabItem,
    NeroTabList
  },
  data () {
    return {
      rightList: {}
    }
  },
  computed: {
    savedRightList () {
      return this.$store.state.communicationManager.internalRightList
    },
    roleList () {
      return this.$store.state.communicationManager.roleList
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
      console.log(this.rightList)
      var schoolId = this.$store.state.communicationManager.selectedSchoolId
      this.$store.dispatch('communicationManager/updateSchoolInternalCommunicationRights',
        { schoolId, rightList: this.rightList })
    },
    onInput (right) {
      this.$set(this.rightList, right, !this.rightList[right])
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
