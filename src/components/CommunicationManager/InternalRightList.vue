<template>
  <div class="internal-rights">
    <Transition
      appear
      name="fade"
    >
      <div v-if="roleList">
        <h4 v-t="'CommunicationManager.InternalRightList.title'" />
        <p v-t="'CommunicationManager.InternalRightList.informations'" />
        <WeprodeTabList>
          <WeprodeTabItem
            v-for="role in roleList"
            :key="role.roleId"
            :title="role.label"
          >
            <InternalRoleTab
              :role="role"
              :right-list="rightList"
              @input="onInput"
            />
          </WeprodeTabItem>
        </WeprodeTabList>
        <WeprodeButton
          :label="$t('CommunicationManager.InternalRightList.save')"
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
import WeprodeTabItem from '@/components/Base/Weprode/WeprodeTabItem.vue'
import WeprodeTabList from '@/components/Base/Weprode/WeprodeTabList.vue'
import InternalRoleTab from '@/components/CommunicationManager/InternalRoleTab'

export default {
  name: 'InternalRightList',
  components: {
    InternalRoleTab,
    WeprodeTabList,
    WeprodeTabItem,
    WeprodeButton,
    WeprodeSpinner
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
      const schoolId = this.$store.state.communicationManager.selectedSchoolId
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
