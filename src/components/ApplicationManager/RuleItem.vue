<template>
  <li class="rule">
    <PentilaTagsInput
      :model-value="rule.roles"
      :placeholder="$t('ApplicationManager.RuleItem.rolesPlaceholder') + '*'"
      :list="roleList"
      display-field="displayText"
      :error-message="formErrorList.roles"
      class="column"
      @blur="v$.rule.roles.$touch()"
      @update:modelValue="updateRoles"
    />
    <p v-t="'ApplicationManager.RuleItem.fromLabel'" />
    <PentilaTagsInput
      :model-value="rule.classes"
      :placeholder="$t('ApplicationManager.RuleItem.classesPlaceholder') + '*'"
      :list="classList"
      display-field="displayText"
      :error-message="formErrorList.classes"
      class="column"
      @blur="v$.rule.classes.$touch()"
      @update:modelValue="updateClasses"
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
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

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
  emits: ['remove', 'update'],
  setup: () => ({ v$: useVuelidate() }),
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
      var form = this.v$.rule
      return {
        classes: (form.classes.$invalid && (form.classes.$dirty || this.isErrorListDisplayed)) ? this.$t('Nero.formErrorMessage.required') : '',
        roles: (form.roles.$invalid && (form.roles.$dirty || this.isErrorListDisplayed)) ? this.$t('Nero.formErrorMessage.required') : ''
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
    },
    updateClasses (classes) {
      const copy = JSON.parse(JSON.stringify(this.rule))
      copy.classes = classes
      this.$emit('update', copy)
    },
    updateRoles (roles) {
      const copy = JSON.parse(JSON.stringify(this.rule))
      copy.roles = roles
      console.log('copy', copy)
      this.$emit('update', copy)
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
