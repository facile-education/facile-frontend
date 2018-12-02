<template>
  <div class="menu">
    <BoxList/>
  </div>
</template>

<script>
import BoxList from '@/components/Messaging/BoxList'

export default {
  name: 'MessagingMenu',
  components: {
    BoxList
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.menu {
  @extend %nero-menu;
  z-index: $service-menu-z-index;
  flex: 0 0 20%;
  width: 20%;
  height: 87.7vh;
  box-shadow: 1px 0 1px rgba(0,0,0,0.13);
  overflow-y: auto;
  margin-left: 0;
  transition: margin-left .3s;
  transition-timing-function: ease-in-out;
}
</style>
