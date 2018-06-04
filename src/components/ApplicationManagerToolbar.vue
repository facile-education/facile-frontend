<template>
  <AppToolbar>
    <AppButton icon="fa fa-plus"/>
    <AppDropdown/>
  </AppToolbar>
</template>

<script>
import AppToolbar from '@/components/AppToolbar'
import AppButton from '@/components/AppButton'
import AppDropdown from '@/components/AppDropdown'

export default {
  name: 'ApplicationManagerToolbar',
  components: {
    AppButton,
    AppToolbar,
    AppDropdown
  },
  computed: {
    schools () {
      return this.$store.state.administration.schools
    }
  },
  created () {
    console.log(this.schools)
    if (this.schools === undefined) {
      this.$store.dispatch('getAdministrationSchools')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
