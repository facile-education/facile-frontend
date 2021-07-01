<template>
  <div class="internal-rights">
    <Transition
      appear
      name="fade"
    >
      <div v-if="roleList">
        <h4 v-t="'CommunicationManager.InternalRightList.title'" />
        <p v-t="'CommunicationManager.InternalRightList.informations'" />
        <PentilaTabList>
          <PentilaTabItem
            v-for="role in roleList"
            :key="role.roleId"
            :title="role.label"
          >
            <InternalRoleTab
              :role="role"
              :right-list="rightList"
              @input="onInput"
            />
          </PentilaTabItem>
        </PentilaTabList>
        <PentilaButton
          :label="$t('CommunicationManager.InternalRightList.save')"
          @click="onSave"
        />
      </div>
      <PentilaSpinner v-else />
    </Transition>
  </div>
</template>

<script>
import InternalRoleTab from '@/components/CommunicationManager/InternalRoleTab'

export default {
  name: 'InternalRightList',
  components: {
    InternalRoleTab
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
