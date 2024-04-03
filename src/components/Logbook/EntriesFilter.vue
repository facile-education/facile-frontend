<template>
  <div
    class="first-line"
  >
    <WeprodeDropdown
      v-if="childList.length > 1"
      v-model="selectedChild"
      :list="childList"
      :sort="false"
      display-field="firstName"
    />
    <WeprodeDropdown
      v-if="isTeacher || isDirector || isSecretariat"
      v-model="selectedClass"
      :list="teacherClasses"
      :sort="false"
      display-field="className"
    />
    <WeprodeTagsInput
      v-if="isTeacher || isDirector || isSecretariat"
      v-model="tagsList"
      :placeholder="$t('Logbook.entriesFilters.searchStudentPlaceholder')"
      :close-on-select="true"
      :max-size="1"
      :completion-only="true"
      :list="autocompleteUserList"
      display-field="text"
      id-field="id"
      @input-change="searchTimeOut"
      @update:model-value="onSelectUser"
    />
  </div>
</template>

<script>
import { addContactFieldsToContactList } from '@utils/contacts.utils'

import messageService from '@/api/messaging/message.service'
import { getTeacherStudents } from '@/api/userSearch.service'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeTagsInput from '@/components/Base/Weprode/WeprodeTagsInput.vue'

import { getLogbookBroadcastPopulations } from '../../api/logbook.service'
export default {
  name: 'EntryFilter',
  components: {
    WeprodeDropdown,
    WeprodeTagsInput
  },
  data () {
    return {
      selectedUser: undefined,
      teacherClasses: [],
      tagsList: [],
      autocompleteUserList: [],
      test: [{
        test: 'test'
      }]
    }
  },
  computed: {
    childList () {
      return this.$store.state.user.children
    },
    selectedChild: {
      get () {
        return this.$store.state.user.selectedChild ? this.$store.state.user.selectedChild : this.$store.state.user.children
      },
      set (child) {
        this.$store.commit('user/setSelectedChild', child)
        this.selectedUser = child
      }
    },
    selectedClass: {
      get () {
        return this.currentUser.selectedClass ? this.currentUser.selectedClass : this.teacherClasses[0]
      },
      set (value) {
        this.$store.commit('user/setSelectedClass', value)
        this.tagsList.length = 0
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
    }
  },
  watch: {
    tagsList (newList) {
      if (newList.length === 0) {
        this.$store.commit('user/setSelectedClass', this.teacherClasses[0])
      }
    }
  },
  created () {
    if (this.isDirector || this.isSecretariat || this.isTeacher) {
      getLogbookBroadcastPopulations().then(data => {
        if (data.populations.classes.length > 1) {
          this.teacherClasses.push({
            className: 'Classes',
            orgId: 0
          })
        }
        data.populations.classes.forEach(classItem => {
          this.teacherClasses.push(classItem)
        })
      }, err => {
        console.log(err)
      })
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
        messageService.getUsersCompletion(query).then((data) => {
          if (data.success) {
            this.autocompleteUserList = data.results
            addContactFieldsToContactList(data.results)
          } else {
            console.error('Error while getting users', data.error)
          }
        }, (err) => {
          console.error(err)
        })
      }
    },
    onSelectUser (userList) {
      if (userList.length) {
        this.$store.commit('user/setSelectedStudent', userList[0])
        this.selectedClass = this.teacherClasses[0]
      } else {
        this.$store.commit('user/setSelectedStudent', undefined)
        this.autocompleteUserList.length = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.first-line{
  margin-bottom: 0.5rem;
  display: flex;
  gap: 10px;
}
</style>
