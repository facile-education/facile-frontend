<template>
  <ul class="rules">
    <li
      v-for="(rule, index) in ruleList"
      :key="rule.ruleId"
    >
      <RuleItem
        :rule="rule"
        :is-error-list-displayed="isErrorListDisplayed"
        :is-remove-button-displayed="isRemovalAllowed"
        @update="update($event, index)"
        @remove="remove(index)"
      />
    </li>
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
    isErrorListDisplayed: {
      type: Boolean,
      default: false
    },
    ruleList: {
      type: Array,
      required: true
    }
  },
  emits: ['blur', 'remove', 'update'],
  computed: {
    isRemovalAllowed () {
      return this.ruleList.length > 1
    }
  },
  methods: {
    remove (index) {
      this.$emit('remove', index)
    },
    update (rule, index) {
      this.$emit('update', { index, rule })
    }
  }
}
</script>

<style lang="scss" scoped>
.rules {
  padding: 0;
}
</style>
