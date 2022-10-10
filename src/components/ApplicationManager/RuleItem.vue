<template>
  <li
    class="rule"
    :class="{ phone: mq.phone }"
  >
    <div class="column">
      <PentilaTagsInput
        :model-value="rule.roles"
        :placeholder="$t('rolesPlaceholder') + '*'"
        :list="roleList"
        display-field="displayText"
        :error-message="formErrorList.roles"
        @blur="onBlurRoles"
        @update:modelValue="updateRoles"
      />
      <PentilaErrorMessage :error-message="formErrorList.roles" />
    </div>
    &nbsp;
    <p v-t="'fromLabel'" />
    &nbsp;
    <div class="column">
      <PentilaTagsInput
        :model-value="rule.classes"
        :placeholder="$t('classesPlaceholder') + '*'"
        :list="classList"
        display-field="displayText"
        @blur="onBlurClasses"
        @update:modelValue="updateClasses"
      />
      <PentilaErrorMessage :error-message="formErrorList.classes" />
    </div>
    <PentilaButton
      v-if="isRemoveButtonDisplayed"
      type="circle"
      cls="delete"
      @click="remove"
    >
      <NeroIcon name="trash" />
    </PentilaButton>
  </li>
</template>

<script>
import { requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

import NeroIcon from '@/components/Nero/NeroIcon'

export default {
  name: 'RuleItem',
  components: { NeroIcon },
  inject: ['mq'],
  props: {
    rule: {
      type: Object,
      required: true
    },
    isDefault: {
      type: Boolean,
      default: false
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
  emits: ['blur', 'remove', 'update'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    rule: {
      roles: {
        required: requiredIf(function (form) {
          return !this.isDefault
        })
      },
      classes: {
        required: requiredIf(function (form) {
          return !this.isDefault
        })
      }
    }
  },
  computed: {
    classList () {
      return this.$store.state.administration.classList
    },
    formErrorList () {
      const form = this.v$.rule
      return {
        classes: (form.classes.$invalid && (form.classes.$dirty || this.isErrorListDisplayed)) ? this.$t('Commons.formRequired') : '',
        roles: (form.roles.$invalid && (form.roles.$dirty || this.isErrorListDisplayed)) ? this.$t('Commons.formRequired') : ''
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
    blur () {
      this.$emit('blur', JSON.parse(JSON.stringify(this.rule)))
    },
    onBlurClasses () {
      this.v$.rule.classes.$touch()
      this.blur()
    },
    onBlurRoles () {
      this.v$.rule.roles.$touch()
      this.blur()
    },
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
      this.$emit('update', copy)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

.rule {
  display: flex;
  align-items: center;
  min-height: 70px;
}

.column {
  width: 46%;
  height: 100%;
}

.delete {
  margin: auto;
}

.phone {
  &.rule {
    flex-direction: column;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid $color-border;
  }

  .column {
    width: 100%;
  }

  p {
    margin: 0;
  }

  .delete {
    margin-top: 10px;
  }
}
</style>

<i18n locale="fr">
{
  "classesPlaceholder": "Liste des classes",
  "fromLabel": "de",
  "rolesPlaceholder": "Liste des profils"
}
</i18n>
