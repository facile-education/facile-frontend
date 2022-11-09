<template>
  <div class="delegations">
    <!-- Header -->
    <div class="header">
      <PentilaButton
        class="add-delegation"
        :label="$t('add-delegation')"
        @click="openAddDelegationModal()"
      />
    </div>

    <!-- Results -->
    <div
      v-if="selectedSchool === undefined"
      class="main-label"
    >
      <p>{{ $t('please-select-school') }}</p>
    </div>
    <div
      v-else-if="schoolAdmins.length === 0"
      class="main-label"
    >
      <p>{{ $t('no-delegation') }}</p>
    </div>
    <div
      v-else
      class="admin-list"
    >
      <UserFields
        :fields="fields"
      />
      <div class="user-list">
        <UserRow
          v-for="user in sortedSchoolAdminList"
          :key="user.userId"
          :fields="fields"
          :is-hoverable="false"
          :user="user"
          @toggleSchoolAdmin="toggleSchoolAdmin(user)"
          @toggleNewsDelegate="toggleNewsDelegate(user)"
        />
      </div>
    </div>
    <teleport to="body">
      <AddDelegationModal
        v-if="isAddDelegationModalDisplayed"
        height="30em"
        @close="isAddDelegationModalDisplayed = false"
        @added-delegates="addedDelegates"
      />
    </teleport>
  </div>
</template>

<script>
import PentilaUtils from 'pentila-utils'
import { addSchoolAdmin, removeSchoolAdmin, getSchoolDelegates } from '@/api/userManagement.service'
import { addNewsDelegate, removeNewsDelegate } from '@/api/news.service'
import AddDelegationModal from '@/components/UserManagement/AddDelegationModal'
import UserFields from '@components/UserManagement/UserFields'
import UserRow from '@components/UserManagement/UserRow'

export default {
  name: 'Delegations',
  components: {
    UserRow,
    UserFields,
    AddDelegationModal
  },
  data () {
    return {
      schoolAdmins: [],
      isAddDelegationModalDisplayed: false,
      fields: [
        'firstName',
        'lastName',
        'isSchoolAdmin',
        'isNewsDelegate'
      ]
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user
    },
    selectedSchool () {
      return this.$store.state.user.selectedSchool
    },
    sortedSchoolAdminList () {
      return PentilaUtils.Array.sortWithString(this.schoolAdmins, false, 'lastName')
    }
  },
  watch: {
    selectedSchool (value, oldValue) {
      this.refreshDelegateList()
    }
  },
  created () {
    this.refreshDelegateList()
  },
  methods: {
    refreshDelegateList () {
      getSchoolDelegates(this.selectedSchool.schoolId).then(
        (data) => {
          if (data.success) {
            this.schoolAdmins = data.admins
          }
        }
      )
    },
    openAddDelegationModal () {
      this.isAddDelegationModalDisplayed = true
    },
    toggleSchoolAdmin (user) {
      if (!user.isSchoolAdmin) {
        addSchoolAdmin(user.userId, this.selectedSchool.schoolId).then(
          (data) => {
            if (data.success) {
              user.isSchoolAdmin = !user.isSchoolAdmin
            } else {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
            }
          }
        )
      } else {
        removeSchoolAdmin(user.userId, this.selectedSchool.schoolId).then(
          (data) => {
            if (data.success) {
              user.isSchoolAdmin = !user.isSchoolAdmin
            } else {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
            }
          }
        )
      }
    },
    toggleNewsDelegate (user) {
      if (!user.isNewsDelegate) {
        addNewsDelegate(user.userId, this.selectedSchool.schoolId).then(
          (data) => {
            if (data.success) {
              user.isNewsDelegate = !user.isNewsDelegate
            } else {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
            }
          }
        )
      } else {
        removeNewsDelegate(user.userId, this.selectedSchool.schoolId).then(
          (data) => {
            if (data.success) {
              user.isNewsDelegate = !user.isNewsDelegate
            } else {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
            }
          }
        )
      }
    },
    addedDelegates (newDelegates) {
      this.schoolAdmins = this.schoolAdmins.concat(newDelegates)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.delegations {
  height: 100%;
}

.header {
  height: $um-user-header-height;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.main-label {
  margin-top: 10em;
  text-align: center;
}

.admin-list {
  height: calc(100% - #{$um-user-header-height});

  .user-list {
    height: calc(100% - #{$um-fields-height});
    overflow: auto;
  }
}
</style>

<i18n locale="fr">
{
  "add-delegation": "Ajouter une délégation",
  "no-delegation": "Aucune délégation pour cet établissement",
  "please-select-school": "Veuillez sélectionner un établissement",
  "warning": "La suppression de cet administrateur est définitive.",
  "Popup": {
    "error": "Erreur lors de l'enregistrement de la délégation"
  }
}
</i18n>
