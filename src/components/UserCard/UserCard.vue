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
      v-if="userDetails && (userDetails.isParent || userDetails.isStudent)"
      :user-details="userDetails"
    />
    <UserCardClasses
      v-if="userDetails && (userDetails.isTeacher || (userDetails.isPersonal && userDetails.classes))"
      :user-details="userDetails"
    />
    <UserCardCurrentSchedule
      v-if="userDetails && (userDetails.isTeacher || userDetails.isStudent)"
      :user-details="userDetails"
    />
    <div
      v-if="error === true"
      v-t="'errorPlaceholder'"
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

export default {
  name: 'UserCard',
  components: { UserCardMain, WeprodeSpinner, UserCardResponsibility, UserCardCurrentSchedule, UserCardClasses },
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

<i18n locale="fr">
  {
    "errorPlaceholder": "Oups, une erreur est survenue...",
  }
  </i18n>
