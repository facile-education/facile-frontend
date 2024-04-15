<template>
  <div class="first-line">
    <WeprodeDropdown
      v-if="childList.length > 1"
      v-model="selectedChild"
      :list="childList"
      :sort="false"
      display-field="firstName"
    />
    <WeprodeTagsInput
      v-if="isTeacher || isDirector || isSecretariat"
      v-model="tagsList"
      :placeholder="$t('Logbook.entriesFilters.searchStudentPlaceholder')"
      data-test="searchStudent"
      :close-on-select="true"
      :max-size="1"
      :completion-only="true"
      :list="autocompleteUserList"
      display-field="text"
      id-field="id"
      @input-change="searchTimeOut"
      @update:model-value="onSelectUser(tagsList)"
    />
  </div>
</template>

<script>
import { addContactFieldsToContactList } from '@utils/contacts.utils'

import { getSchoolStudents, getTeacherStudents } from '@/api/userSearch.service'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeTagsInput from '@/components/Base/Weprode/WeprodeTagsInput.vue'

export default {
  name: 'EntryFilter',
  components: {
    WeprodeDropdown,
    WeprodeTagsInput
  },
  data () {
    return {
      selectedUser: undefined,
      tagsList: [],
      autocompleteUserList: []
    }
  },
  computed: {
    childList () {
      return this.$store.state.user.children
    },
    isLoadAuthorLogbook () {
      return this.$store.state.logbook.isLoadAuthorEntries
    },
    selectedChild: {
      get () {
        return this.$store.state.user.selectedChild ? this.$store.state.user.selectedChild : this.$store.state.user.children
      },
      set (child) {
        this.$store.dispatch('logbook/addFilter', undefined)
        this.$store.commit('user/setSelectedChild', child)
        this.selectedUser = child
      }
    },
    currentUser () {
      return this.$store.state.user
    },
    isTeacher () {
      return this.$store.state.user.isTeacher
    },
    isDirector () {
      return this.$store.state.user.isDirectionMember
    },
    isSecretariat () {
      return this.$store.state.user.isSecretariat
    },
    selectedSchool () {
      return this.$store.state.user.selectedSchool
    }
  },
  methods: {
    searchTimeOut (inputValue) {
      clearTimeout(this.timeout)
      // Make a new timeout set to go off in 800ms
      if (inputValue.length >= 2) { // nbCharBeforeCompletion
        this.timeout = setTimeout(() => {
          this.getCompletion(inputValue)
        }, 500)
      } else {
        this.autocompleteUserList.length = 0
      }
    },
    getCompletion (query) {
      // Teachers can see only their students
      // Other agents can see all school's students
      if (this.isTeacher) {
        getTeacherStudents(query).then((data) => {
          if (data.success) {
            this.autocompleteUserList = data.students
            addContactFieldsToContactList(data.students)
          } else {
            console.error('Error while getting users', data.error)
          }
        }, (err) => {
          console.error(err)
        })
      } else {
        getSchoolStudents(this.selectedSchool.schoolId, query).then((data) => {
          if (data.success) {
            this.autocompleteUserList = data.students
            addContactFieldsToContactList(data.students)
          } else {
            console.error('Error while getting users', data.error)
          }
        }, (err) => {
          console.error(err)
        })
      }
    },
    onSelectUser (userList) {
      this.$store.dispatch('logbook/addFilter', undefined)
      if (userList.length) {
        this.$store.commit('user/setSelectedStudent', userList[0])
        this.$store.dispatch('logbook/handleLoadAuthorEntries', false)
      } else {
        this.$store.commit('user/setSelectedStudent', undefined)
        this.autocompleteUserList.length = 0
        this.$store.dispatch('logbook/handleLoadAuthorEntries', true)
      }
    },
    loadAuthorEntries () {
      this.$store.dispatch('logbook/addFilter', undefined)
      if (this.isLoadAuthorLogbook === false) {
        this.$store.dispatch('logbook/handleLoadAuthorEntries', true)
        this.tagsList.length = 0
        this.autocompleteUserList.length = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.first-line {
  margin-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;

  button {
    padding: 6px 8px;
    border-radius: 6px;
    border: solid 1px;
    cursor: pointer;

    &.disabled {
      background-color: transparent;
    }
  }
}

.disabled {
  background-color: transparent;
}
</style>
