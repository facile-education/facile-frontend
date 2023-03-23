<template>
  <div>
    {{ userList }}
  </div>
</template>

<script>
export default {
  name: 'ContactUserList',
  props: {
    userList: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
