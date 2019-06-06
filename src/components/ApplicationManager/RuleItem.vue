<template>
  <li class="rule">
    <PentilaTagsInput
      v-model="rule.roles"
      :placeholder="$t('ApplicationManager.RuleItem.rolesPlaceholder') + '*'"
      :list="roleList"
      display-field="displayText"
      :error-type="formErrorList.roles"
      class="column"
      @blur="$v.rule.roles.$touch()"
    />
    <p v-t="'ApplicationManager.RuleItem.fromLabel'" />
    <PentilaTagsInput
      v-model="rule.classes"
      :placeholder="$t('ApplicationManager.RuleItem.classesPlaceholder') + '*'"
      :list="classList"
      display-field="displayText"
      :error-type="formErrorList.classes"
      class="column"
      @blur="$v.rule.classes.$touch()"
    />
    <PentilaButton
      v-if="isRemoveButtonDisplayed"
      cls="cancel"
      icon="fa fa-trash"
      type="circle"
      @click="remove()"
    />
  </li>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'RuleItem',
  props: {
    rule: {
      type: Object,
      required: true
    },
    isErrorListDisplayed: {
      type: Boolean,
      default: false
    },
    isRemoveButtonDisplayed: {
      type: Boolean,
      default: false
    }
  },
  validations: {
    rule: {
      roles: { required },
      classes: { required }
    }
  },
  computed: {
    classList () {
      return this.$store.state.administration.classList
    },
    formErrorList () {
      var form = this.$v.rule
      return {
        classes: (form.classes.$invalid && (form.classes.$dirty || this.isErrorListDisplayed)) ? 'required' : '',
        roles: (form.roles.$invalid && (form.roles.$dirty || this.isErrorListDisplayed)) ? 'required' : ''
      }
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
