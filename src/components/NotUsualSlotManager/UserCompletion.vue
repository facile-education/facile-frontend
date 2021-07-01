<template>
  <PentilaTagsInput
    v-model="tagsList"
    :placeholder="$t('NotUsualSlots.studentNamePlaceHolder')"
    :close-on-select="true"
    :max-size="1"
    :completion-only="true"
    :list="autocompleteUserList"
    :sort="false"
    display-field="displayName"
    id-field="studentId"
    @inputChange="searchTimeOut"
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
      tagsList: [],
      autocompleteUserList: []
    }
  },
  computed: {
    selectedSchool () {
      return this.$store.state.notUsualSlots.selectedSchool
    },
    queriedUser () {
      return this.tagsList[0]
    }
  },
  watch: {
    'queriedUser' () {
      if (this.queriedUser === undefined) {
        this.autocompleteUserList = []
        this.$store.dispatch('resetUserSlots')
      } else {
        this.$emit('selectUser', this.queriedUser)
      }
    }
  },
  methods: {
    searchTimeOut (inputValue) {
      clearTimeout(timeout)
      // Make a new timeout set to go off in 800ms
      timeout = setTimeout(() => {
        if (inputValue.length >= nbCharBeforeCompletion) {
          this.getCompletion(inputValue)
        }
      }, 500)
    },
    getCompletion (inputValue) {
      schoolLifeService.getSchoolStudents(this.selectedSchool.schoolId, inputValue).then((data) => {
        if (data.success) {
          if (data.students.length > 0) {
            this.autocompleteUserList = data.students
            this.autocompleteUserList.forEach((user) => { user.displayName = this.getUserDisplayName(user) })
          }
        } else {
          console.error('Error while getting user completion', data.error) // TODO: better error gesture
        }
      })
    },
    getUserDisplayName (user) {
      return user.firstName + ' ' + user.lastName + (user.className ? ' (' + user.className + ')' : '')
    }
  }
}
</script>

<style scoped>

</style>
