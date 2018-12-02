<template>
  <div>
    <span
      class="all-boxes-label"
      @click="toggleAccountListDiplay">
      <i
        :class="{'fa-caret-down': showAccountList, 'fa-caret-right': !showAccountList}"
        class="fa"/>
      TODO label
    </span>
    <div v-if="showAccountList">
      <BoxItem
        v-for="box in boxList"
        :key="box.accountId"
        :box="box"/>
    </div>
  </div>
</template>

<script>
import BoxItem from '@/components/Messaging/BoxItem'

export default {
  name: 'BoxList',
  components: {
    BoxItem
  },
  data () {
    return {
      showAccountList: true
    }
  },
  computed: {
    boxList () {
      return this.$store.state.messaging.boxList
    }
  },
  created () {
    if (this.boxeList === undefined) {
      this.$store.dispatch('initBoxList')
    }
  },
  methods: {
    toggleAccountListDiplay () {
      this.showAccountList = !this.showAccountList
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.all-boxes-label {
  @extend %nero-menu-item;
}
</style>
