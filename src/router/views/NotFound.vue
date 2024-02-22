<template>
  <ServicesWrapper
    :is-title-visible="false"
    :title="$t('NotFound.serviceTitle')"
  >
    <WeprodeSpinner v-if="menu === undefined" />
    <h2
      v-else-if="showMessage"
      v-t="'NotFound.message'"
    />
  </ServicesWrapper>
</template>

<script>

import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

import ServicesWrapper from '../../components/ServicesWrapper/ServicesWrapper.vue'
export default {
  name: 'NotFound',
  components: { WeprodeSpinner, ServicesWrapper },
  emits: ['update:layout'],
  data () {
    return {
      showMessage: false
    }
  },
  computed: {
    menu () {
      return this.$store.state.menu.menu
    }
  },
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  },
  mounted () {
    setTimeout(() => {
      this.showMessage = true
    }, 500)
  }
}
</script>

<style lang="scss" scoped>

</style>
