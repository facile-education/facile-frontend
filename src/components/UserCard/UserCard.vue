<template>
  <div class="container">
    <WeprodeSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <UserCardMain
      v-if="userDetails"
      :user-details="userDetails"
    />
    <UserCardResponsibility
      v-if="userDetails && (userDetails.isParent || userDetails.isStudent) && (userDetails.parents || userDetails.children)"
      :user-details="userDetails"
    />
    <UserCardClasses
      v-if="userDetails && ((userDetails.isTeacher && userDetails.schools) || (userDetails.isPersonal && userDetails.classes))"
      :user-details="userDetails"
    />
    <UserCardCurrentSchedule
      v-if="userDetails && (!currentUser.isParent && !currentUser.isStudent) && (userDetails.isTeacher || userDetails.isStudent)"
      :user-details="userDetails"
    />
    <UserCardHHC
      v-if="userDetails && userDetails.isStudent && userDetails.userSchoollifeStats"
      :user-school-life-stats="userDetails.userSchoollifeStats"
    />
    <div
      v-if="error === true"
      v-t="'UserCard.errorPlaceholder'"
      class="placeholder"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import { getUserCard } from '@/api/contact.service'
const WeprodeSpinner = defineAsyncComponent(() => import('@/components/Base/Weprode/WeprodeSpinner.vue'))
const UserCardClasses = defineAsyncComponent(() => import('@/components/UserCard/Classes/UserCardClasses.vue'))
const UserCardMain = defineAsyncComponent(() => import('@/components/UserCard/Main/UserCardMain.vue'))
const UserCardResponsibility = defineAsyncComponent(() => import('@/components/UserCard/Responsibility/UserCardResponsibility.vue'))
const UserCardCurrentSchedule = defineAsyncComponent(() => import('@/components/UserCard/Schedule/UserCardCurrentSchedule.vue'))
const UserCardHHC = defineAsyncComponent(() => import('@/components/UserCard/UserCardHHC.vue'))

export default {
  name: 'UserCard',
  components: { UserCardMain, WeprodeSpinner, UserCardResponsibility, UserCardCurrentSchedule, UserCardClasses, UserCardHHC },
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
    },
    currentUser () {
      return this.$store.state.user
    }
  },
  watch: {
    userToDisplay: {
      handler () {
        this.fetchUserCardData()
      }
    }
  },
  created () {
    this.fetchUserCardData()
  },
  methods: {
    fetchUserCardData () {
      this.isLoading = true
      getUserCard(this.userToDisplay.userId).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.userDetails = data.contactDetails
          this.userDetails = Object.assign({}, this.userDetails, { userId: this.userToDisplay.userId })
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
}
</style>
