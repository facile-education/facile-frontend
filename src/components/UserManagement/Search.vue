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
      <PentilaButton
        class="run-search"
        label="Rechercher"
        @click="runSearch"
      />
    </div>
    <div
      class="results"
    >
      <p v-if="noResult">
        {{ $t('no-result') }}
      </p>
      <table v-else>
        <tr>
          <th class="result-lastname">
            {{ $t('lastName') }}
          </th>
          <th class="result-firstname">
            {{ $t('firstName') }}
          </th>
          <th class="result-email">
            {{ $t('email') }}
          </th>
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
      selectedUser: undefined,
      isEditUserModalDisplayed: false
    }
  },
  computed: {
    selectedSchool () {
      return this.$store.state.user.selectedSchool
    },
    resultUsers () {
      return _.orderBy(this.$store.state.userManagement.resultUsers, 'lastName', 'asc')
    },
    noResult () {
      return this.resultUsers === undefined || this.resultUsers.length === 0
    }
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
    margin-top: 20px;
    margin-bottom: 20px;
    width: 100%;
    .result-lastname,.result-firstname {
      width: 40%;
    }
    .result-email {
      width: 20%;
    }
  }
}
</style>

<i18n locale="fr">
{
  "search": "Recherche",
  "searchPlaceHolder": "Saisir le nom et/ou le prénom",
  "lastName": "Nom",
  "firstName": "Prénom",
  "email": "Courriel",
  "create": "Créer un nouvel utilisateur",
  "no-result": "Aucun résultat"
}
</i18n>
