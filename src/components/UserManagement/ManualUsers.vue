<template>
  <div
    class="manual-users"
  >
    <PentilaButton
      class="create-user"
      :label="$t('create')"
      @click="createUser"
    />

    <Search
      :is-manual-users="true"
      @selectUser="editUser"
    />
    <teleport to="body">
      <EditUserModal
        v-if="isEditUserModalDisplayed"
        height="30em"
        :edited-user="selectedUser"
        @close="isEditUserModalDisplayed = false"
      />
    </teleport>
  </div>
</template>

<script>
import EditUserModal from '@/components/UserManagement/EditUserModal.vue'
import Search from '@/components/UserManagement/Search.vue'
export default {
  name: 'ManualUsers',
  components: {
    EditUserModal, Search
  },
  data () {
    return {
      isEditUserModalDisplayed: false
    }
  },
  computed: {
  },
  methods: {
    runSearch () {
      this.$store.dispatch('userManagement/getManualUsers', { schoolId: this.selectedSchool.schoolId, query: this.searchText })
    },
    createUser (user) {
      this.selectedUser = {}
      this.isEditUserModalDisplayed = true
    },
    editUser (user) {
      this.selectedUser = user
      this.isEditUserModalDisplayed = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.manual-users {
  margin: 10px;
  border-top: 1px solid black;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .create-user {
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 250px;
  }

}
</style>

<i18n locale="fr">
{
  "search": "Recherche",
  "searchPlaceHolder": "Taper le nom et/ou le prénom",
  "lastName": "Nom",
  "firstName": "Prénom",
  "action": "Editer",
  "create": "Créer un nouvel utilisateur"
}
</i18n>
