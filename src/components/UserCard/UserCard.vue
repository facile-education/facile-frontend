<template>
  <div class="container">
    <WeprodeSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <UserCardMain
      v-if="userDetails"
      :userDetails="userDetails"
    />
    <UserCardResponsability
      v-if="userDetails && (userDetails.isParent || userDetails.isStudent)"
      :userDetails="userDetails"
    />
    <UserCardClasses
      v-if="userDetails && (userDetails.isTeacher || userDetails.roles === 'Psychologue' || userDetails.roles === 'Conseiller•ère social•ale')"
      :userDetails="userDetails"
    />
    <UserCardCurrentSchedule
      v-if="userDetails && (userDetails.isTeacher || userDetails.isStudent)"
      :userDetails="userDetails"
    />
  </div>
</template>

<script>
import { getUserCard } from '@/api/contact.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import UserCardClasses from '@/components/UserCard/Classes/UserCardClasses.vue'
import UserCardMain from '@/components/UserCard/Main/UserCardMain.vue'
import UserCardResponsability from '@/components/UserCard/Responsability/UserCardResponsability.vue'
import UserCardCurrentSchedule from '@/components/UserCard/Schedule/UserCardCurrentSchedule.vue'

export default {
  name: 'UserCard',
  components: { UserCardMain, WeprodeSpinner, UserCardResponsability, UserCardCurrentSchedule, UserCardClasses },
  data () {
    return {
      userDetails: undefined,
      isLoading: true,
      error: false
    }
  },
  computed: {
    userToDisplay () {
      return this.$store.state.userCard.userToDisplay
    }
  },
  watch: {
    userToDisplay: {
      handler () {
        this.isLoading = true
        this.fetchUserCardData()
      }
    }
  },
  created () {
    this.fetchUserCardData()
  },
  methods: {
    fetchUserCardData () {
      getUserCard(this.userToDisplay.userId).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.userDetails = data.contactDetails
          console.log(this.userDetails)
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
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  overflow: visible;
  height: 100%;
  overflow-y: auto;
}
</style>
