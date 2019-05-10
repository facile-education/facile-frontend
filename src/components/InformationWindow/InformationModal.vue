<template>
  <NeroWindow
    :modal="true"
    @close="closeModal"
  />
</template>

<script>

import NeroWindow from '@/components/Nero/NeroWindow'

export default {
  name: 'InformationModal',
  components: {
    NeroWindow
  },
  computed: {
  },
  created () {
  },
  methods: {
    closeModal () {
      this.$store.dispatch('nero/closeInformationModal')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

</style>
