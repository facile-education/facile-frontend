<template>
  <PentilaWindow
    :modal="true"
    :class="{ 'app-broadcast-modal': mq.phone }"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'modalTitle'" />
    </template>
    <template #body>
      <div
        v-if="!hasRules"
        v-t="'defaultLabel'"
        class="fallback"
      />
      <template v-else>
        <RuleList
          :rule-list="ruleList"
          :is-error-list-displayed="isErrorListDisplayed"
          @remove="removeScope"
          @update="updateRule"
        />
      </template>
      <RuleItem
        :rule="emptyRule"
        :is-default="true"
        :is-error-list-displayed="false"
        @blur="addScope"
        @update="updateEmptyRule"
      />
    </template>

    <template #footer>
      <PentilaButton
        :label="$t('updateButton')"
        @click="saveRuleList"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import PentilaUtils from 'pentila-utils'

import RuleItem from '@/components/ApplicationManager/RuleItem'
import RuleList from '@/components/ApplicationManager/RuleList'

export default {
  name: 'BroadcastScopeModal',
  components: {
    RuleItem,
    RuleList
  },
  inject: ['mq'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    ruleList: {
      $each: {
        orgs: {
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
      emptyRule: { orgs: [], roles: [] },
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
    this.ruleList = PentilaUtils.JSON.deepCopy(this.$store.state.applicationManager.selectedApplication.rules)
  },
  methods: {
    addScope (rule) {
      if (rule.orgs.length && rule.roles.length) {
        this.ruleList.push(PentilaUtils.JSON.deepCopy(rule))
        this.emptyRule.orgs.length = 0
        this.emptyRule.roles.length = 0
      }
    },
    buildClassIdList (currentRule, currentRuleId) {
      let updateClassList = false
      let currentClass

      for (currentClass of currentRule.orgs) {
        if (currentClass.orgId === 0 && currentRule.orgs.length > 1) {
          currentRuleId.orgIds.length = 0
          currentRuleId.orgIds.push(currentClass.orgId)
          updateClassList = true
          break
        } else {
          currentRuleId.orgIds.push(currentClass.orgId)
        }
      }
      // Rewrite class list if all school item is selected
      if (updateClassList) {
        currentRule.orgIds.length = 0
        currentRule.orgIds.push(currentClass.orgId)
      }
    },
    buildRoleIdList (currentRule, currentRuleId) {
      let updateRoleList = false

      let currentRole
      for (currentRole of currentRule.roles) {
        if (currentRole.roleId === 0 && currentRule.roles.length > 1) {
          currentRuleId.roleIds.length = 0
          currentRuleId.roleIds.push(currentRole.roleId)
          updateRoleList = true
          break
        } else {
          currentRuleId.roleIds.push(currentRole.roleId)
        }
      }
      // Rewrite role list if all role item is selected
      if (updateRoleList) {
        currentRule.roleIds.length = 0
        currentRule.roleIds.push(currentRole.roleId)
      }
    },
    removeEmptyRuleList () {
      let currentRule
      const indexListToRemove = []

      for (let idx = 0; idx < this.ruleList.length; ++idx) {
        currentRule = this.ruleList[idx]
        if (currentRule.orgs.length === 0 && currentRule.roles.length === 0) {
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
      const ruleIdList = []
      this.removeEmptyRuleList()

      // Build id lists for saving
      this.ruleList.forEach((currentRule) => {
        const currentRuleId = { roleIds: [], orgIds: [] }
        this.buildRoleIdList(currentRule, currentRuleId)
        this.buildClassIdList(currentRule, currentRuleId)
        ruleIdList.push(currentRuleId)
      })

      if (this.v$.$invalid) {
        this.isErrorListDisplayed = true
      } else {
        this.$store.dispatch('applicationManager/updateBroadcastScope', {
          school: this.$store.state.administration.selectedSchool,
          ruleList: this.ruleList,
          ruleIdList
        })
      }
    },
    updateEmptyRule (rule) {
      this.emptyRule = rule
    },
    updateRule ({ index, rule }) {
      this.ruleList.splice(index, 1, rule)
    }
  }
}
</script>

<style lang="scss">
.app-broadcast-modal .window-body {
  overflow: auto;
}
</style>

<style lang="scss" scoped>
.add {
  margin: auto;
  display: block;
}

.fallback {
  text-align: center;
}
</style>

<i18n locale="fr">
{
  "addRuleButton":"Ajouter une règle de diffusion",
  "defaultLabel": "L'application n'est pas diffusée",
  "modalTitle": "Règles de diffusion",
  "updateButton": "Valider"
}
</i18n>
