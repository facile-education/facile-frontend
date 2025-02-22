<template>
  <h1 :aria-label="$t('Authentication.title')" />
  <div class="wrapper">
    <img
      src="@assets/images/gva/logo_eel.png"
      :alt="$t('Authentication.eelImg')"
      class="eel-img"
    >
    <span
      v-if="isIdpAuthenticated"
      v-t="'Authentication.sessionErrorMessage'"
      class="errorMessage idp-session"
    />
    <a
      id="academic"
      v-t="'Authentication.studentTeacher'"
      :href="ssoUrl"
      :title="$t('Authentication.entLogin')"
      class="btn"
    />
    <div
      class="guest"
    >
      <span
        v-t="'Authentication.parentOther'"
        tabindex="0"
        @click="toggleGuestForm"
        @keyup.enter="toggleGuestForm"
      />

      <Transition name="expand">
        <div v-if="isGuestFormDisplayed">
          <!-- Password recovery -->
          <form
            v-if="showPasswordRecoveryForm"
            data-test="passwordRecoveryForm"
            @submit.prevent="sendRecoveryEmail"
          >
            <div class="login-label">
              <p
                v-t="'Authentication.loginLabel'"
              />
            </div>
            <input
              v-model="recoveryLogin"
              :placeholder="$t('Authentication.loginPlaceholder')"
              class="input"
              autocapitalize="none"
              @keypress="handleKeyPressed"
            >
            <button
              v-t="'Authentication.send-recovery'"
              class="btn"
              :title="$t('Authentication.send-recovery')"
              type="submit"
            />
            <div
              v-if="checkEmail"
              class="check-email"
            >
              <span
                v-t="'Authentication.check-email'"
              />
            </div>
            <div>
              <a
                v-t="'Authentication.main-form'"
                href="#"
                @click="showPasswordRecoveryForm = false"
              />
            </div>
          </form>

          <!-- Classic login form -->
          <form
            v-else
            data-test="classicForm"
            @submit.prevent="doLogin"
          >
            <input
              v-model="login"
              :placeholder="$t('Authentication.login')"
              class="input"
              name="unsername"
              data-test="inputUsername"
              autocapitalize="none"
              @keypress="handleKeyPressed"
            >
            <div class="input-container">
              <input
                v-model="password"
                :type="passwordInputType"
                :placeholder="$t('Authentication.password')"
                class="input"
                name="password"
                data-test="inputPassword"
                autocomplete="on"
                @keypress="handleKeyPressed"
              >
              <button
                class="toggle-password-type"
                type="button"
                :aria-label="$t('Authentication.showPassword')"
                :title="$t('Authentication.showPassword')"
                @click.stop="togglePasswordType"
              >
                <img
                  src="@assets/icons/eye_off.svg"
                  alt=""
                >
              </button>
            </div>
            <div
              data-test="loginError"
            >
              <!-- Login error -->
              <span
                v-show="isError && !isLocked"
                v-t="'Authentication.loginError'"
                class="errorMessage"
              />
              <!-- Nb remaining tries -->
              <span
                v-if="isError && !isLocked && nbRemainingTries <= 2"
                class="errorMessage"
              >
                {{ $t('Authentication.nbRemainingTries', {nbRemainingTries: nbRemainingTries}) }}
              </span>
              <span
                v-if="isError && isLocked"
                class="errorMessage"
              >
                {{ $t('Authentication.accountLocked', {lockoutDuration: lockoutDuration}) }}
              </span>
            </div>
            <button
              v-t="authenticateButtonLabel"
              class="btn"
              :class="{'running': isLoading, 'disabled': areEmptyFields}"
              :disabled="isLoading || areEmptyFields"
              :title="$t('Authentication.authenticate')"
              type="submit"
            />
            <div>
              <a
                v-t="'Authentication.forgot-password'"
                href="#"
                @click="showPasswordRecoveryForm = true"
              />
            </div>
          </form>
        </div>
      </Transition>
    </div>
    <img
      src="@assets/images/gva/geneve-logo.png"
      :alt="$t('Authentication.gvaImg')"
      width="140"
      height="108"
      class="gva-img"
    >
  </div>
</template>

<script>
import { ref } from 'vue'

import authComponent from '@/components/Renderless/AuthenticationSetup'

export default {
  name: 'GVAAuthentication',
  props: {
    redirect: {
      type: String,
      default: ''
    }
  },
  emits: ['update:layout'],
  setup (_props, { emit }) {
    emit('update:layout', 'PublicLayout')

    const authSetup = authComponent()

    const ssoUrl = ref('/Shibboleth.sso/Login?entityID=https://ssoeel.geneveid.ch/ginasso/gina/fed/ent&target=' + encodeURIComponent(window.location.origin + '/login' + (authSetup.isMobileApp.value ? '?mobile_app=true' : '')))

    return {
      ...authSetup,
      ssoUrl
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

$eel-blue: #2c7bb8;

.wrapper {
  position: relative;
  background-color: $color-body-bg;
  padding: 1rem 3rem;
  width: 450px;
  max-width: 90vw;
  margin: auto;
  display: flex;
  flex-direction: column;
}

.eel-img {
  margin-bottom: 1.5rem;
  width: 100%;
}

.idp-session {
  text-align: center;
  background-color: rgba($error-color, .07);
  padding: 1rem;
}

.gva-img {
  margin: 1.5rem auto 0 auto;
}

.guest {
  color: $eel-blue;
  border: 2px solid $eel-blue;
  background: $color-body-bg;
  width: 100%;

  span {
    cursor: pointer;
    display: inline-block;
    width: 100%;
    margin: -10px;
    padding: 10px;
  }
}

.btn {
  background: $eel-blue;
  color: $color-body-bg;
  border-radius: 0;
  width: 100%;
  margin: 10px 0;
  border: 1px solid transparent;
  text-decoration: none;
  cursor: pointer;
  &.disabled {
    opacity: 50;
    background-color: grey;
  }
  &.running {
    opacity: 50;
    background-color: grey;
    cursor: wait;
  }
}

.guest, .btn {
  display: inline-block;
  font-weight: normal;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: .5rem .75rem;
  font-size: 1rem;
  line-height: 1.25;
  overflow: hidden;
}

.input-container {
  position: relative;
  width: 100%;

  .toggle-password-type {
    @extend %toggle-password-type;
  }
}

.input {
  height: 46px;
  padding: 10px 16px;
  font-size: 18px;
  line-height: 1.3333333;
  display: block;
  width: 100%;
  color: #555;
  background-color: $color-body-bg;
  border: 1px solid $color-border;
  border-radius: 0;
  margin: .3rem 0;
}

.errorMessage {
  color: $error-color;
}

.expand-enter-active, .expand-leave-active {
  transition: max-height .4s ease;
}

.expand-enter-from, .expand-leave-to {
  max-height: 0;
}

.expand-enter-to, .expand-leave-from {
  max-height: 200px;
}
</style>
