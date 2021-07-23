<template>
  <li>
    {{ label }}
  </li>
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
      if (this.rule.classes.length !== 0 && this.rule.roles.length !== 0) {
        if (this.rule.roles.length === 1 && this.rule.roles[0].roleId === 0) {
          label += this.$t('ApplicationManager.RuleLabel.everyRoleLabel')
        } else {
          for (let k = 0; k < this.rule.roles.length; k++) {
            const role = this.rule.roles[k]
            if (k > 0) {
              label += ', '
            }
            label += role.displayText
          };
        }
        if (this.rule.classes.length === 1 && this.rule.classes[0].value === 0) {
          label += ' ' + this.$t('ApplicationManager.RuleLabel.allSchoolLabel')
        } else {
          label += ' ' + this.$t('ApplicationManager.RuleLabel.fromClassesLabel') + ' '
          for (let j = 0; j < this.rule.classes.length; j++) {
            const classe = this.rule.classes[j]
            if (j > 0) {
              label += ', '
            }
            label += classe.displayText
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
