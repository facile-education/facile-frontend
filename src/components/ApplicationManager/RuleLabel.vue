<template>
  <div>
    {{ label }}
  </div>
</template>

<script>
export default {
  name: 'RuleLabel',
  props: {
    rule: {
      type: Object,
      required: true
    }
  },
  computed: {
    label () {
      let label = ''
      if (this.rule.orgs.length !== 0 && this.rule.roles.length !== 0) {
        if (this.rule.roles.length === 1 && this.rule.roles[0].roleId === 0) {
          label += this.$t('ApplicationManager.RuleLabel.everyRoleLabel')
        } else {
          for (let k = 0; k < this.rule.roles.length; k++) {
            const role = this.rule.roles[k]
            if (k > 0) {
              label += ', '
            }
            label += role.displayText
          }
        }
        if (this.rule.orgs.length === 1 && this.rule.orgs[0].orgId === 0) {
          label += ' ' + this.$t('ApplicationManager.RuleLabel.allSchoolLabel')
        } else {
          label += ' ' + this.$t('ApplicationManager.RuleLabel.fromOrgsLabel') + ' '
          for (let j = 0; j < this.rule.orgs.length; j++) {
            const org = this.rule.orgs[j]
            if (j > 0) {
              label += ', '
            }
            label += org.orgName
          }
        }
      }

      return label
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
