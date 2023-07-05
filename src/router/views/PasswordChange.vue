<template>
  <GVELayout>
    <div class="password-change">
      <img
        class="lock-open"
        src="@/assets/icons/lock-open.svg"
        alt=""
      >

      <h1 v-t="'title'" />

      <div class="passwords-section">
        <div class="password1 input-container">
          <PentilaInput
            v-model="password1"
            class="input"
            :type="password1InputType"
            :placeholder="$t('passwordPlaceholder')"
            :maxlength="75"
            @input="errorMessage = ''"
            @keyup.enter.stop="updatePassword"
          />
          <!--  TODO: Put those logic on pentila component-->
          <button
            class="toggle-password-type"
            @click="togglePassword1Type"
          >
            <img
              src="@/assets/icons/eye-off.svg"
              alt=""
            >
          </button>
        </div>

        <div
          v-t="'passwordPolicy'"
          class="password-policy"
        />

        <div class="password2">
          <div class="input-container">
            <PentilaInput
              v-model="password2"
              class="input"
              :type="password2InputType"
              :placeholder="$t('confirmPasswordPlaceholder')"
              :maxlength="75"
              @input="errorMessage = ''"
              @keyup.enter.stop="updatePassword"
            />
            <!--  TODO: Put those logic on pentila component-->
            <button
              class="toggle-password-type"
              @click="togglePassword2Type"
            >
              <img
                src="@/assets/icons/eye-off.svg"
                alt=""
              >
            </button>
          </div>
          <div
            class="error-message"
            v-html="errorMessage"
          />
        </div>
      </div>

      <PentilaButton
        v-t="'submit'"
        class="button"
        type="submit"
        @click="updatePassword"
      />
    </div>
  </GVELayout>
</template>

<script>

import GVELayout from '@layouts/GVELayout.vue'

import constants from '@/api/constants'
import userService from '@/api/user.service'

export default {
  name: 'PasswordChange',
  components: { GVELayout },
  data () {
    return {
      password1: '',
      password2: '',
      password1InputType: 'password',
      password2InputType: 'password',
      errorMessage: ''
    }
  },
  methods: {
    updatePassword () {
      // First check if passwords are equals
      if (this.password1.trim() === '') {
        this.errorMessage = this.$t('emptyPassword')
      } else if (this.password1 !== this.password2) {
        this.errorMessage = this.$t('differentPasswords')
      } else {
        userService.updatePassword(this.password1, this.password2).then((data) => {
          if (data.success) {
            this.errorMessage = ''
            // Reset p_auth_token
            this.$store.commit('user/setPAuth', undefined)
            window.location = constants.LOGOUT_URL // Logout
          } else {
            this.errorMessage = data.error ? data.error : this.$t('unknownError')
          }
        }, (err) => {
          console.error(err)
          this.errorMessage = this.$t('unknownError')
        })
      }
    },
    togglePassword1Type () {
      if (this.password1InputType === 'password') {
        this.password1InputType = 'text'
      } else {
        this.password1InputType = 'password'
      }
    },
    togglePassword2Type () {
      if (this.password2InputType === 'password') {
        this.password2InputType = 'text'
      } else {
        this.password2InputType = 'password'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.password-change {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;
}

.lock-open {
  height: 1.5rem;
}

h1 {
  line-height: 2rem;
  margin: 1rem 0 2rem 0;
  @extend %font-heading-s;
}

.passwords-section {
  max-width: 360px;
}

.input-container {
  position: relative;

  .input {
    width: 360px;
  }

  .toggle-password-type {
    height: 1rem;
    cursor: pointer;
    background-color: transparent;
    border-radius: 0;
    padding: 0;
    margin: 0;
    border: none;

    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);

    img {
      height: 1rem;
    }
  }
}

.password-policy, .error-message {
  margin-top: 8px;
  @extend %font-regular-s;
}

.error-message {
  color: $danger;
}

.password2 {
  margin: 1.5rem 0;
}

.button {
  width: 200px;
}

</style>

<i18n locale="fr">
{
  "title": "Mise à jour de votre mot de passe",
  "passwordPlaceholder": "Mot de passe",
  "confirmPasswordPlaceholder": "Confirmer le mot de passe",
  "submit": "Mettre à jour",
  "differentPasswords": "Les mots de passe sont différents",
  "errorMessage": "Une erreur est survenue",
  "passwordPolicy": "Le mot de passe doit contenir au moins 8 caractères dont une majuscule, un chiffre et un caractère spécial",
  "emptyPassword": "Veuillez saisir un mot de passe",
  "unknownError": "Oups, une erreur est survenue..."
}
</i18n>
