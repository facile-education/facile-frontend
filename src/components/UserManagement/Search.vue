<template>
  <div
    class="search-results"
  >
    <div class="search">
      <PentilaInput
        v-model="searchText"
        :maxlength="75"
        :placeholder="$t('searchPlaceHolder')"
        class="input-search"
      />
      <PentilaDropdown
        v-if="(schools && schools.length > 1)"
        v-model="selectedSchool"
        class="schools"
        :list="schools"
        :sort="true"
        display-field="schoolName"
      />
      <PentilaButton
        class="run-search"
        label="Rechercher"
        @click="runSearch"
      />
    </div>
    <div
      class="results"
    >
      <table>
        <tr>
          <th>{{ $t('lastName') }}</th>
          <th>{{ $t('firstName') }}</th>
          <th>{{ $t('email') }}</th>
        </tr>
        <tr
          v-for="user in resultUsers"
          :key="user.userId"
          class="result"
          @dblclick="selectUser(user)"
        >
          <td>{{ user.lastName }}</td>
          <td>{{ user.firstName }}</td>
          <td>{{ user.email }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Search',
  props: {
    isManualUsers: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['selectUser'],
  data () {
    return {
      searchText: '',
      selectedSchool: {},
      selectedUser: undefined,
      isEditUserModalDisplayed: false
    }
  },
  computed: {
    schools () {
      return this.$store.state.userManagement.schools
    },
    resultUsers () {
      return _.orderBy(this.$store.state.userManagement.resultUsers, 'lastName', 'asc')
    }
  },
  created () {
    this.$store.dispatch('userManagement/getSchools')
  },
  methods: {
    runSearch () {
      if (this.isManualUsers) {
        this.$store.dispatch('userManagement/getManualUsers', { schoolId: this.selectedSchool.schoolId, query: this.searchText })
      } else {
        this.$store.dispatch('userManagement/getSchoolUsers', { schoolId: this.selectedSchool.schoolId, query: this.searchText })
      }
    },
    selectUser (user) {
      this.selectedUser = user
      this.isEditUserModalDisplayed = true
      this.$emit('selectUser', this.selectedUser)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.search-results {

  .search {
    margin-left: 20px;
    width: 300px;
    display: flex;
    flex-direction: column;
    .input-search {
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .schools {
      margin-bottom: 10px;
    }
  }
  .results {
    margin-left: 20px;
    margin-bottom: 20px;
    width: 80%;
    .result {
    }
  }
}
</style>

<i18n locale="fr">
{
  "search": "Recherche",
  "searchPlaceHolder": "Taper le nom et/ou le prénom",
  "lastName": "Nom",
  "firstName": "Prénom",
  "email": "Courriel",
  "create": "Créer un nouvel utilisateur"
}
</i18n>
