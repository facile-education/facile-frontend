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
        :is-error-list-displayed="isErrorListDisplayed"
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
import { required } from 'vuelidate/lib/validators'
import NeroUtils from '@/utils/nero.utils'

import NeroButton from '@/components/Nero/NeroButton'
import NeroWindow from '@/components/Nero/NeroWindow'
import RuleList from '@/components/ApplicationManager/RuleList'

export default {
  name: 'BroadcastScopeModal',
  components: {
    RuleList,
    NeroButton,
    NeroWindow
  },
  validations: {
    ruleList: {
      $each: {
        classes: {
          required
        },
        roles: {
          required
        }
      }
    }
  },
  data () {
    return {
      isErrorListDisplayed: false,
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
      var updateClassList = false

      for (var currentClass of currentRule.classes) {
        if (currentClass.value === 0 && currentRule.classes.length > 1) {
          currentRuleId.classes.length = 0
          currentRuleId.classes.push(currentClass.value)
          updateClassList = true
          break
        } else {
          currentRuleId.classes.push(currentClass.value)
        }
      }
      // Rewrite class list if all school item is selected
      if (updateClassList) {
        currentRule.classes.length = 0
        currentRule.classes.push(currentClass)
      }
    },
    buildRoleIdList (currentRule, currentRuleId) {
      var updateRoleList = false

      for (var currentRole of currentRule.roles) {
        if (currentRole.roleId === 0 && currentRule.roles.length > 1) {
          currentRuleId.roles.length = 0
          currentRuleId.roles.push(currentRole.roleId)
          updateRoleList = true
          break
        } else {
          currentRuleId.roles.push(currentRole.roleId)
        }
      }
      // Rewrite role list if all role item is selected
      if (updateRoleList) {
        currentRule.roles.length = 0
        currentRule.roles.push(currentRole)
      }
    },
    removeEmptyRuleList () {
      var currentRule
      var indexListToRemove = []

      for (var idx = 0; idx < this.ruleList.length; ++idx) {
        currentRule = this.ruleList[idx]
        if (currentRule.classes.length === 0 && currentRule.roles.length === 0) {
          if (this.ruleList.length > 1) {
            indexListToRemove.push(idx)
          }
        }
      }

      // Remove all empty rules unless it is the last one
      indexListToRemove.reverse().forEach((indexToRemove) => {
        if (this.ruleList.length > 1) {
          this.ruleList.splice(indexToRemove, 1)
        }
      })
    },
    closeModal () {
      this.$store.dispatch('applicationManager/closeBroadcastModal')
    },
    removeScope (index) {
      this.ruleList.splice(index, 1)
    },
    saveRuleList () {
      var ruleIdList = []
      this.removeEmptyRuleList()

      // Build id lists for saving
      this.ruleList.forEach((currentRule) => {
        var currentRuleId = { classes: [], roles: [] }
        this.buildRoleIdList(currentRule, currentRuleId)
        this.buildClassIdList(currentRule, currentRuleId)
        ruleIdList.push(currentRuleId)
      })

      if (this.$v.$invalid) {
        this.isErrorListDisplayed = true
      } else {
        this.$store.dispatch('applicationManager/updateBroadcastScope', {
          school: this.$store.state.administration.selectedSchool,
          ruleList: this.ruleList,
          ruleIdList
        })
      }
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
