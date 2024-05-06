<template>
  <div
    v-if="sortedEntriesList"
    class="list-entries"
    :class="mq.phone && (isSecretariat || isTeacher || isDirector) && 'mobile'"
  >
    <EntriesListItem
      v-for="(data, index) in sortedEntriesList"
      :key="index"
      :data="data"
      :is-student-entries="isStudentEntries"
      @signed="getChildLogbook(childSelected.userId)"
      @refresh="refresh"
    />
  </div>
  <WeprodeSpinner
    v-if="isLoading"
    style="z-index: 1"
  />
  <div
    v-if="error"
    v-t="'Logbook.errorPlaceholder'"
    class="placeholder"
  />
  <p
    v-if="sortedEntriesList.length === 0 && !error && !isLoading"
    class="placeholder"
  >
    {{ $t('Logbook.noEntryPlaceholder') }}
  </p>
</template>

<script>
import WeprodeUtils from '@utils/weprode.utils'

import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import EntriesListItem from '@/components/Logbook/EntriesListItem.vue'
import logbookConstants from '@/constants/logbookConstants'

import { getAuthorLogbook, getStudentLogbook } from '../../api/logbook.service'

export default {
  name: 'StudentParentListEntries',
  components: {
    EntriesListItem,
    WeprodeSpinner
  },
  inject: ['mq'],
  props: {
    isEntryCreated: {
      type: Boolean,
      default: false
    }
  },
  emits: ['isRefreshed'],
  data () {
    return {
      entriesList: [],
      firstClass: undefined,
      isLoading: true,
      error: false,
      isStudentEntries: false,
      isChildEntries: false,
      isAuthorEntries: false
    }
  },
  computed: {
    childSelected () {
      return this.$store.state.user.selectedChild
    },
    studentSelected () {
      return this.$store.state.user.selectedStudent
    },
    isLoadAuthorLogbook () {
      return this.$store.state.logbook.isLoadAuthorEntries
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
    isParent () {
      return this.$store.state.user.isParent
    },
    isStudent () {
      return this.$store.state.user.isStudent
    },
    currentUser () {
      return this.$store.state.user
    },
    selectedFilterType () {
      return this.$store.state.logbook.filterTypeSelected
    },
    sortedEntriesList () {
      if (this.selectedFilterType === logbookConstants.ENTRY_TYPE_INFORMATION) {
        return WeprodeUtils.sortArrayWithString(this.informationEntriesList, true, 'modificationDate')
      } else if (this.selectedFilterType === logbookConstants.ENTRY_TYPE_AUTHORIZATION) {
        return WeprodeUtils.sortArrayWithString(this.authorizationEntriesList, true, 'modificationDate')
      } else if (this.selectedFilterType === logbookConstants.ENTRY_TYPE_OBSERVATION) {
        return WeprodeUtils.sortArrayWithString(this.observationEntriesList, true, 'modificationDate')
      } else {
        return WeprodeUtils.sortArrayWithString(this.entriesList, true, 'modificationDate')
      }
    },
    informationEntriesList () {
      return this.entriesList.filter(entry => entry.type === logbookConstants.ENTRY_TYPE_INFORMATION)
    },
    authorizationEntriesList () {
      return this.entriesList.filter(entry => entry.type === logbookConstants.ENTRY_TYPE_AUTHORIZATION)
    },
    observationEntriesList () {
      return this.entriesList.filter(entry => entry.type === logbookConstants.ENTRY_TYPE_OBSERVATION)
    }
  },
  watch: {
    childSelected (newChild) {
      this.getChildLogbook(newChild.userId)
    },
    studentSelected (newStudent) {
      if (newStudent) {
        this.isStudentEntries = true
        this.getStudentLogbook(newStudent.userId)
      } else {
        this.isStudentEntries = false
        this.getAuthorLogbook(this.currentUser.userId)
      }
    },
    isEntryCreated () {
      this.refresh()
    },
    isLoadAuthorLogbook (value) {
      if (value === true) {
        this.getAuthorLogbook(this.currentUser.userId)
      }
    }
  },
  created () {
    if (this.isParent) {
      this.getChildLogbook(this.currentUser.children[0].userId)
    } else if (this.isTeacher || this.isDirector || this.isSecretariat) {
      this.getAuthorLogbook(this.currentUser.userId)
    } else if (this.isStudent) {
      this.getStudentLogbook(this.currentUser.userId)
    }
  },
  methods: {
    getChildLogbook (childId) {
      this.isLoading = true
      getStudentLogbook(childId).then(data => {
        if (data.success) {
          this.isLoading = false
          this.error = false
          this.isChildEntries = true
          this.isStudentEntries = false
          this.isAuthorEntries = false
          this.entriesList = data.entries
        } else {
          this.error = true
        }
      }, (err) => {
        this.error = true
        console.error(err)
      })
    },
    getStudentLogbook (userId, type = undefined) {
      this.isLoading = true
      getStudentLogbook(userId).then(data => {
        if (data.success) {
          this.isLoading = false
          this.error = false
          this.isChildEntries = false
          this.isStudentEntries = true
          this.isAuthorEntries = false
          if (type) {
            this.entriesList = data.entries.filter(entry => entry.type === type)
          } else {
            this.entriesList = data.entries
          }
        } else {
          this.error = true
        }
      }, (err) => {
        this.error = true
        console.error(err)
      })
    },
    getAuthorLogbook (authorId, type = undefined) {
      this.isLoading = true
      getAuthorLogbook(authorId).then(data => {
        if (data.success) {
          this.isLoading = false
          this.error = false
          this.isChildEntries = false
          this.isStudentEntries = false
          this.isAuthorEntries = true
          if (type) {
            this.entriesList = data.entries.filter(entry => entry.type === type)
          } else {
            this.entriesList = data.entries
          }
        } else {
          this.error = true
        }
      }, (err) => {
        this.error = true
        console.error(err)
      })
    },
    refresh () {
      if (this.isChildEntries) {
        this.$emit('isRefreshed')
        this.getChildLogbook(this.childSelected.userId)
      } else if (this.isStudentEntries) {
        this.$emit('isRefreshed')
        this.getStudentLogbook(this.studentSelected.userId)
      } else if (this.isAuthorEntries) {
        this.$emit('isRefreshed')
        this.getAuthorLogbook(this.currentUser.userId)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.list-entries {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  padding-bottom: 20px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;

  &.mobile {
    padding-bottom: 100px
  }
}

.placeholder {
  @extend %content-placeholder;
}
</style>
