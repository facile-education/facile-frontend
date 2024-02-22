<template>
  <ServicesWrapper :is-title-visible="false">
    <div class="authentication-required">
      <div class="error">
        <img
          src="@/assets/icons/alert.svg"
          alt=""
        >
        <h1 v-t="'NotAllowed.notAllowed'" />
        <div v-t="'NotAllowed.useOthersServicesPlease'" />
      </div>
    </div>
  </ServicesWrapper>
</template>

<script>
import ServicesWrapper from '../../components/ServicesWrapper/ServicesWrapper.vue'

export default {
  name: 'NotAllowed',
  components: { ServicesWrapper }
}
</script>

<style lang="scss" scoped>
@import "@design";

.authentication-required {
  padding-top: 30%;
}

.error {
  position: relative;
  text-align: center;
}

h1 {
  @extend %font-heading-s;
}

div {
  @extend %font-regular-l;
}

img {
  height: 24px;
}
</style>
