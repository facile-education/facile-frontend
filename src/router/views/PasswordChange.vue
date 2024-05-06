<template>
  <div class="password-change">
    <img
      class="lock-open"
      src="@assets/icons/lock.svg"
      alt=""
    >

    <h1 v-t="'PasswordChange.title'" />

    <div class="passwords-section">
      <div class="password1 input-container">
        <WeprodeInput
          v-model="password1"
          class="input"
          :type="password1InputType"
          :placeholder="$t('PasswordChange.passwordPlaceholder')"
          :maxlength="75"
          @input="errorMessage = ''"
          @keyup.enter.stop="updatePassword"
        />
        <!--  TODO: Put those logic on pentila component-->
        <button
          class="toggle-password-type"
          :aria-label="$t('PasswordChange.showPassword')"
          :title="$t('PasswordChange.showPassword')"
          @click="togglePassword1Type"
        >
          <img
            src="@assets/icons/eye_off.svg"
            alt=""
          >
        </button>
      </div>

      <div
        v-t="'PasswordChange.passwordPolicy'"
        class="password-policy"
      />

      <div class="password2">
        <div class="input-container">
          <WeprodeInput
            v-model="password2"
            class="input"
            :type="password2InputType"
            :placeholder="$t('PasswordChange.confirmPasswordPlaceholder')"
            :maxlength="75"
            @input="errorMessage = ''"
            @keyup.enter.stop="updatePassword"
          />
          <!--  TODO: Put those logic on pentila component-->
          <button
            class="toggle-password-type"
            :aria-label="$t('PasswordChange.showPassword')"
            :title="$t('PasswordChange.showPassword')"
            @click="togglePassword2Type"
          >
            <img
              src="@assets/icons/eye_off.svg"
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

    <div class="buttons">
      <a
        v-t="'PasswordChange.logout'"
        :href="logoutUrl"
        class="logout-link"
      />
      <WeprodeButton
        v-t="'PasswordChange.submit'"
        class="button"
        type="submit"
        @click="updatePassword"
      />
    </div>
  </div>
</template>

<script>

import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'

import constants from '@/api/constants'
import userManagement from '@/api/userManagement.service'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'

export default {
  name: 'PasswordChange',
  components: { WeprodeButton, WeprodeInput },
  emits: ['update:layout'],
  data () {
    return {
      logoutUrl: constants.LOGOUT_URL,
      password1: '',
      password2: '',
      password1InputType: 'password',
      password2InputType: 'password',
      errorMessage: '',
      ticketKey: undefined
    }
  },
  beforeCreate () {
    this.$emit('update:layout', 'PublicLayout')
  },
  created () {
    if (window.location.href.includes('ticketKey')) {
      this.ticketKey = new URLSearchParams(window.location.search).get('ticketKey')
    }
  },
  methods: {
    updatePassword () {
      // First check if passwords are equals
      if (this.password1.trim() === '') {
        this.errorMessage = this.$t('PasswordChange.emptyPassword')
      } else if (this.password1 !== this.password2) {
        this.errorMessage = this.$t('PasswordChange.differentPasswords')
      } else {
        // 2 cases :
        if (this.$store.state.user !== undefined && this.ticketKey === undefined) {
          // A manager has changed the user's password, and the user changes it again. The user is now connected
          userManagement.updatePasswordAfterReinitByManager(this.password1, this.password2).then((data) => {
            if (data.success) {
              this.errorMessage = ''
              // Reset p_auth_token
              this.$store.commit('user/setPAuth', undefined)
              window.location = constants.LOGOUT_URL // Logout
            } else {
              this.errorMessage = data.error ? data.error : this.$t('PasswordChange.unknownError')
            }
          }, (err) => {
            console.error(err)
            this.errorMessage = this.$t('PasswordChange.unknownError')
          })
        } else if (this.$store.state.user.userId === undefined && this.ticketKey !== undefined) {
          // The user has asked for a password retrieval : the user is not connected, but has a ticketId
          // The webservice is public
          userManagement.updateForgottenPassword(this.password1, this.password2, this.ticketKey).then((data) => {
            if (data.success) {
              this.errorMessage = ''
              // Reset p_auth_token
              this.$store.commit('user/setPAuth', undefined)
              window.location = constants.LOGOUT_URL // Logout
            } else {
              this.errorMessage = data.error ? data.error : this.$t('PasswordChange.unknownError')
            }
          }, (err) => {
            console.error(err)
            this.errorMessage = this.$t('PasswordChange.unknownError')
          })
        } else {
          console.error('Password change init error : store userId is ', this.$store.state.user.userId, ' and ticketKey=' + this.ticketKey)
        }
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
  max-width: min(100%, 360px);
}

.input-container {
  position: relative;

  .input {
    width: min(100%, 360px);
  }

  .toggle-password-type {
    @extend %toggle-password-type;
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

.buttons {
  display: flex;
  gap: 1rem;
}

.logout-link, .button {
  width: 125px;
}

a.logout-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 6px;
  color: $color-dark-text;
  text-decoration: none;
  background-color: $neutral-40;
  border-radius: 6px;
}

@media screen and (min-width: 450px){
  .logout-link, .button {
    width: 200px;
  }
}

</style>
