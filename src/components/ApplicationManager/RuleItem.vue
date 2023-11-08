<template>
  <li
    class="rule"
    :class="{ phone: mq.phone }"
  >
    <div class="column">
      <WeprodeTagsInput
        :model-value="rule.roles"
        :placeholder="$t('rolesPlaceholder') + '*'"
        :list="roleList"
        display-field="displayText"
        :sort="false"
        :error-message="formErrorList.roles"
        @blur="onBlurRoles"
        @update:model-value="updateRoles"
      />
      <WeprodeErrorMessage :error-message="formErrorList.roles" />
    </div>
    &nbsp;
    <p v-t="'fromLabel'" />
    &nbsp;
    <div class="column">
      <WeprodeTagsInput
        :model-value="rule.orgs"
        :placeholder="$t('orgsPlaceholder') + '*'"
        :list="classList"
        :sort="false"
        display-field="orgName"
        @blur="onBlurOrgs"
        @update:model-value="updateOrgs"
      />
      <WeprodeErrorMessage :error-message="formErrorList.orgs" />
    </div>
    <WeprodeButton
      v-if="isRemoveButtonDisplayed"
      type="circle"
      cls="delete"
      class="delete-button"
      @click="remove"
    >
      <img
        src="@assets/icons/trash_white.svg"
        :alt="$t('deleteButtonTooltip')"
      >
    </WeprodeButton>
  </li>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { requiredIf } from '@vuelidate/validators'

import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeTagsInput from '@/components/Base/Weprode/WeprodeTagsInput.vue'

export default {
  name: 'RuleItem',
  components: { WeprodeButton, WeprodeErrorMessage, WeprodeTagsInput },
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
      orgs: {
        required: requiredIf(function (form) {
          return !this.isDefault
        })
      }
    }
  },
  computed: {
    classList () {
      if (this.$store.state.administration.classList === undefined) {
        return undefined
      }

      const classList = [{ orgId: 0, orgName: this.$t('all-school') }]
      classList.push(...this.$store.state.administration.classList)
      return classList
    },
    formErrorList () {
      const form = this.v$.rule
      return {
        orgs: (form.orgs.$invalid && (form.orgs.$dirty || this.isErrorListDisplayed)) ? this.$t('Commons.formRequired') : '',
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
    onBlurOrgs () {
      this.v$.rule.orgs.$touch()
      this.blur()
    },
    onBlurRoles () {
      this.v$.rule.roles.$touch()
      this.blur()
    },
    remove () {
      this.$emit('remove')
    },
    updateOrgs (orgs) {
      const copy = JSON.parse(JSON.stringify(this.rule))
      copy.orgs = orgs
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

.delete-button {
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 18px;
  }
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
  "all-school": "Tout l'établissement",
  "orgsPlaceholder": "Liste des classes",
  "fromLabel": "de",
  "rolesPlaceholder": "Liste des profils"
}
</i18n>
