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
      if (this.rule.classes.length !== 0 && this.rule.roles.length !== 0) {
        var label = ''

        if (this.rule.roles.length === 1 && this.rule.roles[0].roleId === 0) {
          label += this.$t('ApplicationManager.RuleLabel.everyRoleLabel')
        } else {
          for (var k = 0; k < this.rule.roles.length; k++) {
            var role = this.rule.roles[k]
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
          for (var j = 0; j < this.rule.classes.length; j++) {
            var classe = this.rule.classes[j]
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
