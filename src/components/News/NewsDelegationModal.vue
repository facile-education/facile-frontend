<template>
  <PentilaWindow
    :modal="true"
    @close="closeModal"
  >
    <span
      slot="header"
      v-t="'News.NewsDelegationModal.modalHeaderLabel'"
    />

    <div
      slot="body"
      class="nero-form"
    >
      <div class="delegationList">
        <PentilaTagItem
          v-for="delegate in delegateList"
          :key="delegate.userId"
          :tag="getUserDisplayValue(delegate)"
          @remove="removeDelegate(delegate)"
        />
      </div>
      <hr class="nero-separator">
      <div class="delegationList">
        <PentilaDropdown
          v-if="userSchoolList"
          :list="userSchoolList"
          display-field="schoolName"
          class="school-list"
          @dropdown-select="onSelectSchool"
        />
        <PentilaInput
          v-model="filter"
          :placeholder="$t('News.NewsDelegationModal.searchPlaceholder')"
          class="search-input"
        />
      </div>
      <div class="candidate-list">
        <NewsDelegationCandidate
          v-for="(candidate, index) in filteredDelegationCandidateList"
          :key="candidate.userId"
          :candidate="candidate"
          :class="{'even': (index%2 === 0)}"
        />
      </div>
    </div>

    <PentilaButton
      slot="footer"
      :label="$t('News.NewsDelegationModal.saveButtonLabel')"
      @click="onSave"
    />
  </PentilaWindow>
</template>

<script>
import NeroUtils from '@/utils/nero.utils'
import NewsDelegationCandidate from '@/components/News/NewsDelegationCandidate'

export default {
  name: 'NewsDelegationModal',
  components: {
    NewsDelegationCandidate
  },
  data () {
    return {
      delegationCandidateList: [],
      filter: ''
    }
  },
  computed: {
    delegateList () {
      if (this.$store.state.news.delegateList === undefined) return undefined

      var listCopy = this.$store.state.news.delegateList.slice()

      return listCopy.sort(this.compare)
    },
    filteredDelegationCandidateList () {
      var vm = this
      var filter = NeroUtils.String.normalize(this.filter)

      return this.sortedDelegationCandidateList.filter((item) => {
        if (filter.length === 0) {
          return true
        }
        return (NeroUtils.String.normalize(vm.getUserDisplayValue(item))
          .indexOf(filter) !== -1)
      })
    },
    sortedDelegationCandidateList () {
      var listCopy = this.delegationCandidateList.slice()

      return listCopy.sort(this.compare)
    },
    userSchoolList () {
      return this.$store.state.news.delegationCandidateList
    }
  },
  beforeCreate () {
    this.$store.dispatch('news/getDelegateList')
    this.$store.dispatch('news/getDelegationCandidateList')
  },
  methods: {
    closeModal () {
      this.$store.dispatch('news/closeDelegationModal')
    },
    compare (a, b) {
      a = NeroUtils.String.normalize(a.userLastName)
      b = NeroUtils.String.normalize(b.userLastName)

      if (a < b) return -1
      if (a > b) return 1
      return 0
    },
    getUserDisplayValue (user) {
      return user.userLastName + ' ' + user.userFirstName
    },
    onSelectSchool (school) {
      this.delegationCandidateList = school.usersAuthorized
    },
    removeDelegate (delegate) {
      this.$store.commit('news/removeFromDelegateList', delegate)
    },
    onSave () {
      this.$store.dispatch('news/updateDelegateList')
    }
  }
}
</script>

<style lang="scss" scoped>
.school-list,
.search-input {
  width: 50%;
  height: 30px;
}

.candidate-list {
  max-height: 400px;
  overflow-y: auto;
}

.even {
  background-color: #efefef;
}
</style>
