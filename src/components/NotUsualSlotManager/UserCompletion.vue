<template>
  <PentilaTagsInput
    v-model="tagsList"
    :placeholder="placeholder"
    :close-on-select="true"
    :max-size="maxSize"
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
    },
    placeholder: {
      type: String,
      default: ''
    },
    initialUserList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  emits: ['selectUser'],
  data () {
    return {
      tagsList: [],
      autocompleteUserList: [],
      maxSize: 1
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
        this.$store.dispatch('notUsualSlots/setQueriedUser', undefined)
        this.$store.dispatch('notUsualSlots/resetUserSlots')
      } else {
        this.$emit('selectUser', this.queriedUser)
      }
    }
  },
  created () {
    if (this.initialUserList && this.initialUserList.length <= this.maxSize) {
      this.initialUserList.forEach((user) => {
        user.displayName = this.getUserDisplayName(user)
      })
      this.tagsList = this.initialUserList
    } else {
      console.error('initialUserList as too many elements for the tagsInput max size')
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
      switch (this.userType) {
        case 'student':
          schoolLifeService.getSchoolStudents(this.selectedSchool.schoolId, inputValue).then((data) => {
            if (data.success) {
              if (data.students.length > 0) {
                this.autocompleteUserList = data.students
                this.autocompleteUserList.forEach((user) => {
                  user.displayName = this.getUserDisplayName(user)
                })
              }
            } else {
              console.error('Error while getting user completion', data.error) // TODO: better error gesture
            }
          })
          break
        case 'teacher':
          schoolLifeService.getSchoolTeachers(this.selectedSchool.schoolId, inputValue).then((data) => {
            if (data.success) {
              if (data.members.length > 0) {
                this.autocompleteUserList = data.members
                this.autocompleteUserList.forEach((user) => {
                  user.displayName = this.getUserDisplayName(user)
                })
              }
            } else {
              console.error('Error while getting user completion', data.error) // TODO: better error gesture
            }
          })
          break
        case 'any':
          console.log('TODO: get teacher list')
          break
        default:
          console.error('Unknown usertype ' + this.userType)
      }
    },
    getUserDisplayName (user) {
      return user.firstName + ' ' + user.lastName + (user.className ? ' (' + user.className + ')' : '')
    }
  }
}
</script>

<style scoped>

</style>
