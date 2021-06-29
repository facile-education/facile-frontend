<template>
  <PentilaInput
    v-model="queriedUser"
    :max-lenght="75"
    :placeholder="$t('NotUsualSlots.studentNamePlaceHolder')"
    @input="searchTimeOut"
  />
  <PentilaAutocomplete
    v-if="isCompletionDisplayed"
    :list="autocompleteUserList"
    display-field="name"
    :input="queriedUser"
    @select="selectCompletionItem"
    @close="hideCompletion"
  />
</template>

<script>

import schoolLifeService from '@/api/schoolLife-portlet.service'
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
        // if (this.inputText.length >= 3) {
        this.getCompletion()
        // }
      }, 500)
    },
    getCompletion () {
      schoolLifeService.getSchoolStudents(this.selectedSchool.schoolId, this.queriedUser).then((data) => {
        if (data.success) {
          this.autocompleteUserList = data.users
          this.showCompletion()
        } else {
          console.error('Error while getting user completion', data.error) // TODO: better error gesture
        }
      })
    },
    selectCompletionItem (selectedValue) {
      this.$emit('selectUser', selectedValue)
      this.hideCompletion()
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
