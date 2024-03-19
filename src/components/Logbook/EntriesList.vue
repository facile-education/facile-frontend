<template>
  <div
    v-if="dataToDisplay"
    class="list-entries"
  >
    <EntriesListItem
      v-for="(data, index) in dataToDisplay"
      :key="index"
      :data="data"
      @signed="getChildLogbook(childSelected.userId)"
      @delete-entry="refresh"
      @entry-edited="refresh"
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
    v-if="!dataToDisplay && !error"
    class="placeholder"
  >
    {{ $t('Logbook.noEntryPlaceholder') }}
  </p>
</template>

<script>
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

import { getClassLogbook, getLogbookBroadcastPopulations, getStudentLogbook } from '../../api/logbook.service'
import EntriesListItem from './EntriesListItem.vue'

export default {
  name: 'StudentParentListEntries',
  components: {
    EntriesListItem,
    WeprodeSpinner
  },
  props: {
    isEntryCreated: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      childEntries: [],
      classEntries: [],
      studentEntries: [],
      firstClass: undefined,
      isLoading: true,
      error: false
    }
  },
  computed: {
    childSelected () {
      return this.$store.state.user.selectedChild
    },
    classSelected () {
      return this.$store.state.user.selectedClass
    },
    studentSelected () {
      return this.$store.state.user.selectedStudent
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
    dataToDisplay () {
      if (this.childEntries.length > 0) {
        return this.childEntries
      } else if (this.classEntries.length > 0) {
        return this.classEntries
      } else if (this.studentEntries.length > 0) {
        return this.studentEntries
      } else {
        return undefined
      }
    }
  },
  watch: {
    childSelected (newChild) {
      this.classEntries = []
      this.studentEntries = []
      this.getChildLogbook(newChild.userId)
    },
    classSelected (newClass) {
      this.childEntries = []
      this.studentEntries = []
      this.getClassLogbook(newClass.orgId)
    },
    studentSelected (newStudent) {
      this.childEntries = []
      this.classEntries = []
      if (newStudent) {
        this.getStudentLogbook(newStudent.userId)
      } else {
        this.getClassLogbook(this.firstClass.orgId)
      }
    },
    isEntryCreated () {
      this.refresh()
    }
  },
  created () {
    if (this.isParent) {
      console.log(this.currentUser)
      this.getChildLogbook(this.currentUser.children[0].userId)
    } else if (this.isTeacher || this.isDirector || this.isSecretariat) {
      getLogbookBroadcastPopulations().then(data => {
        this.firstClass = data.populations.classes[0]
        this.getClassLogbook(this.firstClass.orgId)
      }, err => {
        console.log(err)
      })
    } else if (this.isStudent) {
      this.getStudentLogbook(this.currentUser.userId)
    }
  },
  methods: {
    getChildLogbook (childId) {
      getStudentLogbook(childId).then(data => {
        if (data.success) {
          this.isLoading = false
          this.error = false
          this.childEntries = data.entries
        } else {
          this.error = true
        }
      }, (err) => {
        this.error = true
        console.error(err)
      })
    },
    getStudentLogbook (userId) {
      getStudentLogbook(userId).then(data => {
        if (data.success) {
          this.isLoading = false
          this.error = false
          this.studentEntries = data.entries
        } else {
          this.error = true
        }
      }, (err) => {
        this.error = true
        console.error(err)
      })
    },
    getClassLogbook (orgId) {
      getClassLogbook(orgId).then(data => {
        if (data.success) {
          this.isLoading = false
          this.error = false
          this.classEntries = data.entries
        } else {
          this.error = true
        }
      }, (err) => {
        this.error = true
        console.error(err)
      })
    },
    refresh () {
      if (this.childEntries.length > 0) {
        this.getChildLogbook(this.childSelected.userId)
      } else if (this.classEntries.length > 0) {
        this.getClassLogbook(this.classSelected ? this.classSelected.orgId : this.firstClass.orgId)
      } else if (this.studentEntries.length > 0) {
        this.getStudentLogbook(this.studentSelected.userId)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@design";
  .list-entries{
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px
  }
  .placeholder{
    @extend %content-placeholder;
  }
</style>
