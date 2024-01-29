<template>
  <div class="container">
    <UserCardMain
      v-if="userDetails"
      :userDetails="userDetails"
    />
  </div>
</template>

<script>
import { getUserCard } from '@/api/contact.service'
import UserCardMain from '@/components/UserCard/UserCardMain.vue'
export default {
  name: 'UserCard',
  components: { UserCardMain },
  data () {
    return {
      userDetails: undefined,
      isLoading: false,
      error: false
    }
  },
  computed: {
    userToDisplay () {
      return this.$store.state.userCard.userToDisplay
    }
  },
  created () {
    getUserCard(this.userToDisplay.id).then((data) => {
      this.isLoading = false
      if (data.success) {
        this.error = false
        this.userDetails = data.contactDetails
        console.log(data.contactDetails)
      } else {
        this.error = true
        console.error('Failed to user details')
      }
    }, (err) => {
      this.isLoading = false
      this.error = true
      console.error(err)
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  overflow: visible;
}
</style>
