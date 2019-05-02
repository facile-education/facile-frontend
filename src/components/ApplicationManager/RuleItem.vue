<template>
  <li class="rule">
    <NeroTagsInput
      v-model="rule.roles"
      :placeholder="$t('ApplicationManager.RuleItem.rolesPlaceholder') + '*'"
      :list="roleList"
      display-field="displayText"
      class="column"
    />
    <p v-t="'ApplicationManager.RuleItem.fromLabel'" />
    <NeroTagsInput
      v-model="rule.classes"
      :placeholder="$t('ApplicationManager.RuleItem.classesPlaceholder') + '*'"
      :list="classList"
      display-field="displayText"
      class="column"
    />
    <NeroButton
      v-if="isRemoveButtonDisplayed"
      cls="cancel"
      icon="fa fa-trash"
      type="circle"
      @click="remove()"
    />
  </li>
</template>

<script>
import NeroButton from '@/components/Nero/NeroButton'
import NeroTagsInput from '@/components/Nero/NeroTagsInput'

export default {
  name: 'RuleItem',
  components: {
    NeroButton,
    NeroTagsInput
  },
  props: {
    rule: {
      type: Object,
      required: true
    },
    isRemoveButtonDisplayed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classList () {
      return this.$store.state.administration.classList
    },
    roleList () {
      return this.$store.state.administration.roleList
    }
  },
  created () {
    if (this.roleList === undefined) {
      this.$store.dispatch('administration/getRoleList')
    }
    if (this.classList === undefined) {
      this.$store.dispatch('administration/getClassList')
    }
  },
  methods: {
    remove () {
      this.$emit('remove')
    }
  }
}
</script>

<style lang="scss" scoped>
.rule {
  display: flex;
  margin-top: 10px;
}

.column {
  width: 46%;
  height: 100%;
}

.cancel {
  margin-left: auto;
}
</style>
