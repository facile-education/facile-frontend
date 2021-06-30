<template>
  <div style="display: flex">
    <PentilaInput
      id="user-completion-input"
      v-model="queriedUser"
      :max-lenght="75"
      :placeholder="$t('NotUsualSlots.studentNamePlaceHolder')"
      @input="searchTimeOut"
      @click="selectInput"
    />
    <button @click="cleanUser">
      x
    </button>
  </div>
  <PentilaAutocomplete
    v-if="isCompletionDisplayed"
    :list="autocompleteUserList"
    display-field="displayName"
    :input="queriedUser"
    @select="selectCompletionItem"
    @close="hideCompletion"
  />
</template>

<script>

import schoolLifeService from '@/api/schoolLife-portlet.service'
import { nbCharBeforeCompletion } from '@/constants/appConstants'
let timeout
export default {
  name: 'UserCompletion',
  props: {
    userType: {
      type: String,
      default: 'any'
    }
  },
  emits: ['selectUser'],
  data () {
    return {
      queriedUser: undefined,
      isCompletionDisplayed: false,
      autocompleteUserList: []
    }
  },
  computed: {
    selectedSchool () {
      return this.$store.state.notUsualSlots.selectedSchool
    }
  },
  methods: {
    searchTimeOut () {
      clearTimeout(timeout)
      // Make a new timeout set to go off in 800ms
      timeout = setTimeout(() => {
        if (this.queriedUser.length >= nbCharBeforeCompletion) {
          this.getCompletion()
        }
      }, 500)
    },
    cleanUser () {
      this.queriedUser = ''
      this.$store.dispatch('resetUserSlots')
      this.hideCompletion()
    },
    getCompletion () {
      schoolLifeService.getSchoolStudents(this.selectedSchool.schoolId, this.queriedUser).then((data) => {
        if (data.success) {
          if (data.students.length > 0) {
            this.autocompleteUserList = data.students
            this.autocompleteUserList.forEach((user) => { user.displayName = this.getUserDisplayName(user) })
            this.showCompletion()
          }
        } else {
          console.error('Error while getting user completion', data.error) // TODO: better error gesture
        }
      })
    },
    getUserDisplayName (user) {
      return user.firstName + ' ' + user.lastName + (user.className ? ' (' + user.className + ')' : '')
    },
    selectCompletionItem (selectedValue) {
      this.queriedUser = selectedValue.displayName
      this.$emit('selectUser', selectedValue)
      this.hideCompletion()
    },
    selectInput () {
      const input = document.getElementById('user-completion-input')
      input.select()
    },
    hideCompletion () {
      this.isCompletionDisplayed = false
    },
    showCompletion () {
      this.isCompletionDisplayed = true
    }
  }
}
</script>

<style scoped>

</style>
