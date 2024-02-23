<template>
  <ServicesWrapper :is-title-visible="false">
    <div class="authentication-required">
      <div class="error">
        <CustomIcon icon-name="icon-alert" />
        <h1 v-t="'NotAllowed.notAllowed'" />
        <div v-t="'NotAllowed.useOthersServicesPlease'" />
      </div>
    </div>
  </ServicesWrapper>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'

import ServicesWrapper from '../../components/ServicesWrapper/ServicesWrapper.vue'

export default {
  name: 'NotAllowed',
  components: { CustomIcon, ServicesWrapper }
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

.icon-alert {
  font-size: 1.5rem;
}
</style>
