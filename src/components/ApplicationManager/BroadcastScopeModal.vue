<template>
  <NeroWindow
    :modal="true"
    @close="closeModal"
  >
    <span
      slot="header"
      v-t="'ApplicationManager.BroadcastScopeModal.modalTitle'"
    />
    <div
      slot="body"
    >
      <NeroButton
        :label="$t('ApplicationManager.BroadcastScopeModal.addRuleButton')"
        class="add"
        @click="addScope"
      />

      <div
        v-if="!hasRules"
        v-t="'ApplicationManager.BroadcastScopeModal.defaultLabel'"
        class="fallback"
      />
      <RuleList
        v-else
        :rule-list="ruleList"
        @remove="removeScope"
      />
    </div>

    <NeroButton
      slot="footer"
      :label="$t('ApplicationManager.BroadcastScopeModal.updateButton')"
      @click="saveRuleList"
    />
  </NeroWindow>
</template>

<script>
import NeroUtils from '@/utils/nero.utils'
import RuleList from '@/components/ApplicationManager/RuleList'
import NeroButton from '@/components/Nero/NeroButton'
import NeroWindow from '@/components/Nero/NeroWindow'

export default {
  name: 'BroadcastScopeModal',
  components: {
    RuleList,
    NeroButton,
    NeroWindow
  },
  data () {
    return {
      ruleList: []
    }
  },
  computed: {
    hasRules () {
      return (this.ruleList.length > 0)
    }
  },
  created () {
    this.ruleList = NeroUtils.JSON.deepCopy(this.$store.state.applicationManager.selectedApplication.rules)
  },
  methods: {
    addScope () {
      this.ruleList.push({ classes: [], roles: [] })
    },
    buildClassIdList (currentRule, currentRuleId) {
      var currentClass
      var updateClassList = false

      for (var classIdx = 0; classIdx < currentRule.classes.length; ++classIdx) {
        currentClass = currentRule.classes[classIdx]
        if (currentClass.value === 0 && currentRule.classes.length > 1) {
          currentRuleId.classes.length = 0
          currentRuleId.classes.push(currentClass.value)
          updateClassList = true
          break
        } else {
          currentRuleId.classes.push(currentClass.value)
        }
      }
      // Rewrite class list
      if (updateClassList) {
        currentRule.classes.length = 0
        currentRule.classes.push(currentClass)
      }
    },
    buildRoleIdList (currentRule, currentRuleId) {
      var currentRole
      var updateRoleList = false

      for (var roleIdx = 0; roleIdx < currentRule.roles.length; ++roleIdx) {
        currentRole = currentRule.roles[roleIdx]
        if (currentRole.roleId === 0 && currentRule.roles.length > 1) {
          currentRuleId.roles.length = 0
          currentRuleId.roles.push(currentRole.roleId)
          updateRoleList = true
          break
        } else {
          currentRuleId.roles.push(currentRole.roleId)
        }
      }
      // Rewrite role list
      if (updateRoleList) {
        currentRule.roles.length = 0
        currentRule.roles.push(currentRole)
      }
    },
    closeModal () {
      this.$store.dispatch('applicationManager/closeBroadcastModal')
    },
    removeScope (index) {
      this.ruleList.splice(index, 1)
    },
    saveRuleList () {
      var currentRule
      var ruleIdList = []

      // Build id lists for saving
      for (var idx = 0; idx < this.ruleList.length; ++idx) {
        currentRule = this.ruleList[idx]
        if (currentRule.classes.length === 0 && currentRule.roles.length === 0) {
        // TODO if rule empty -> remove rule
        // TODO check incorrect rules : one field is undefined or no rule defined
        } else {
          var currentRuleId = { classes: [], roles: [] }
          this.buildRoleIdList(currentRule, currentRuleId)
          this.buildClassIdList(currentRule, currentRuleId)
          ruleIdList.push(currentRuleId)
        }
      }

      var params = {
        school: this.$store.state.administration.selectedSchool,
        ruleList: this.ruleList,
        ruleIdList
      }
      this.$store.dispatch('applicationManager/updateBroadcastScope', params)
    }
  }
}
</script>

<style lang="scss" scoped>
.add {
  margin: auto;
  display: block;
}

.fallback {
  text-align: center;
}
</style>
