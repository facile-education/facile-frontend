<template>
  <section class="cookie-agreement theme-background-color">
    <div class="text">
      <div
        v-t="'Facile.CookiesAgreement.cookiesPolicy'"
        class="cookie-policy"
      />
      <button
        v-t="'Facile.CookiesAgreement.moreDetails'"
        class="more-details"
        @click="openTermsOfUse"
      />
    </div>

    <button
      v-t="'Facile.CookiesAgreement.IAgree'"
      class="agree-button"
      @click="agreeToCookies"
    />

    <teleport to="body">
      <InformationModal
        v-if="isInfoModalDisplayed"
        tab="termOfUse"
        @close="isInfoModalDisplayed=false"
      />
    </teleport>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'
const InformationModal = defineAsyncComponent(() => import('@/components/Informations/InformationModal.vue'))

export default {
  name: 'CookiesAgreement',
  components: { InformationModal },
  emits: ['close'],
  data () {
    return {
      isInfoModalDisplayed: false
    }
  },
  methods: {
    openTermsOfUse () {
      this.isInfoModalDisplayed = true
    },
    agreeToCookies () {
      const expirationCookie = dayjs().add(1, 'year').toDate().toUTCString()
      document.cookie = 'cookiesAgreement=true; expires=' + expirationCookie + ';'
      this.$emit('close') // Because cookies value are not reactive
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.cookie-agreement {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100vw;
  z-index: $cookies-banner-z-index;
  padding: 1.5rem 2rem;
}

button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.cookie-policy {
  @extend %font-heading-xs;
}

.more-details {
  margin-top: 8px;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  text-decoration-line: underline;
  color: inherit;
}

.agree-button {
  display: flex;
  width: 200px;
  height: 48px;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background-color: $neutral-20;
  margin: 8px auto 0 auto;
}

@media screen and (min-width: 700px) {
  .cookie-agreement {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .agree-button {
    margin: 0;
  }
}

</style>
