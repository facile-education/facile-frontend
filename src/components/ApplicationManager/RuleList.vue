<template>
  <ul>
    <RuleItem
      v-for="(rule, index) in ruleList"
      :key="rule.ruleId"
      :rule="rule"
      @remove="remove(index)"
    />
  </ul>
</template>

<script>
import RuleItem from '@/components/ApplicationManager/RuleItem'

export default {
  name: 'RuleList',
  components: {
    RuleItem
  },
  props: {
    ruleList: {
      type: Array,
      required: true
    }
  },
  methods: {
    remove (index) {
      this.$emit('remove', index)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
