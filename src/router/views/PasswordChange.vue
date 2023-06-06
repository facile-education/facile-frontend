<template>
  <EmptyLayout>
    <div class="main">
      <p v-t="'password-change'" />
      <div class="password">
        <PentilaInput
          v-model="password1"
          class="input"
          type="password"
          :placeholder="$t('passwordPlaceholder')"
          :maxlength="75"
          @input="typing"
          @keyup.enter.stop="updatePassword"
        />
        <PentilaInput
          v-model="password2"
          class="input"
          type="password"
          :placeholder="$t('confirmPasswordPlaceholder')"
          :maxlength="75"
          @input="typing"
          @keyup.enter.stop="updatePassword"
        />
        <p
          v-show="arePasswordsDifferent"
          v-t="'differentPasswords'"
          class="errorMessage"
        />
        <p
          v-show="isError && error"
          class="errorMessage"
          v-html="error"
        />
        <p
          v-show="isError && !error"
          v-t="'errorMessage'"
          class="errorMessage"
        />
        <div class="wrapper">
          <PentilaButton
            class="button"
            :disabled="isButtonDisabled"
            @click="updatePassword"
          >
            <span>{{ $t('update-password') }}</span>
          </PentilaButton>
        </div>
      </div>
    </div>
  </Emptylayout>
</template>

<script>
import userService from '@/api/user.service'
import constants from '@/api/constants'
import EmptyLayout from '@router/layouts/EmptyLayout'

export default {
  name: 'PasswordChange',
  components: { EmptyLayout },
  data () {
    return {
      password1: '',
      password2: '',
      error: '',
      isError: false,
      arePasswordsDifferent: false
    }
  },
  computed: {
    isButtonDisabled () {
      return this.password1 === '' && this.password2 === ''
    }
  },
  methods: {
    updatePassword () {
      // First check if passwords are equal
      if (this.password1 !== this.password2) {
        this.arePasswordsDifferent = true
      } else {
        userService.updatePassword(this.password1, this.password2).then((data) => {
          if (data.success) {
            // Reset p_auth_token
            this.$store.commit('user/setPAuth', undefined)
            // Logout
            window.location = constants.LOGOUT_URL
          } else {
            this.isError = true
            this.error = data.error
          }
        })
      }
    },
    typing () {
      this.arePasswordsDifferent = false
      this.isError = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.main {
  display: flex;
  flex-direction: column;
  margin-top: 100px;
}

p {
  text-align: center;
}

.password {
  margin: auto;
  max-width: 300px;
  max-height: 400px;
  overflow: auto;
}

.input {
  margin-bottom: 20px;
}

.wrapper {
  width: 100%;
  margin: auto;
  text-align: center;
}

.button {
  margin: auto;
}

.errorMessage {
  color: $error-color;
  margin-bottom: 20px;
}
</style>

<i18n locale="fr">
{
  "password-change": "Vous devez mettre à jour votre mot de passe",
  "passwordPlaceholder": "Mot de passe",
  "confirmPasswordPlaceholder": "Confirmer le mot de passe",
  "update-password": "Mettre à jour",
  "differentPasswords": "Les mots de passe sont différents",
  "errorMessage": "Une erreur est survenue"
}
</i18n>
