<template>
  <nav class="side-menu">
    <SideMenuCategory :menu="menu"/>
  </nav>
</template>

<script>
import menu from '@/api/menu'
import SideMenuCategory from '@/components/SideMenuCategory'

export default {
  name: 'SideMenu',
  components: {
    SideMenuCategory
  },
  data () {
    return {
      menu
    }
  }
}
</script>

<style lang="scss" scoped>
.side-menu {
  position: fixed;
  top: 48px;
  bottom: 0;
  overflow-y: auto;
  vertical-align: top;
  width: 205px;
  padding-left: 10px;
  padding-right: 3px;
  box-shadow: 1px 1px 6px #888;
  background-color: white;
  padding-bottom: 40px;
}
</style>
