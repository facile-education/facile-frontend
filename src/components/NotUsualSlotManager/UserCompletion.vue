<template>
  <WeprodeTagsInput
    v-if="hasDisplayName"
    :model-value="modelValue"
    data-test="user-completion-input"
    :placeholder="placeholder"
    :close-on-select="true"
    :max-size="maxSize"
    :completion-only="true"
    :list="autocompleteUserList"
    :sort="false"
    display-field="displayName"
    id-field="userId"
    @inputChange="searchTimeOut"
    @update:modelValue="update"
  />
</template>

<script>
import WeprodeUtils from '@utils/weprode.utils'

import { getSchoollifeAgents, getSchoolStudents } from '@/api/userSearch.service'
import WeprodeTagsInput from '@/components/Base/Weprode/WeprodeTagsInput.vue'
import { nbCharBeforeCompletion } from '@/constants/appConstants'
let timeout

export default {
  name: 'UserCompletion',
  components: { WeprodeTagsInput },
  props: {
    maxSize: {
      type: Number,
      default: 1
    },
    modelValue: {
      type: Array,
      default: () => {
        return []
      }
    },
    userType: {
      type: String,
      default: 'any'
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      autocompleteUserList: []
    }
  },
  computed: {
    hasDisplayName () {
      return (this.modelValue.length === 0 || this.modelValue[0].displayName !== undefined)
    },
    selectedSchool () {
      return this.$store.state.user.selectedSchool
    }
  },
  created () {
    if (this.modelValue.length > 0 && this.modelValue.length <= this.maxSize) {
      const array = WeprodeUtils.deepCopy(this.modelValue)
      array.forEach((user) => {
        user.displayName = this.getUserDisplayName(user)
      })
      this.update(array)
    } else if (this.maxSize !== -1 && this.modelValue.length > this.maxSize) {
      console.error('modelValue as too many elements for the tagsInput max size')
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
          getSchoolStudents(this.selectedSchool.schoolId, inputValue).then((data) => {
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
          getSchoollifeAgents(this.selectedSchool.schoolId, inputValue).then((data) => {
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
          break
        default:
          console.error('Unknown usertype ' + this.userType)
      }
    },
    getUserDisplayName (user) {
      return user.lastName + ' ' + user.firstName + (user.className ? ' (' + user.className + ')' : '')
    },
    update (value) {
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<style scoped>

</style>
