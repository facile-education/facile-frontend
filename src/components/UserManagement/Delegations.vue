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
      <table style="width:100%">
        <tr>
          <th
            v-t="'lastName'"
            style="width:30%"
          />
          <th
            v-t="'firstName'"
            style="width:30%"
          />
          <th
            v-t="'local-admin'"
            style="width:20%"
          />
          <th
            v-t="'news-delegation'"
            style="width:20%"
          />
        </tr>
        <tr
          v-for="admin in sortedSchoolAdminList"
          :key="admin.userId"
        >
          <td>{{ admin.lastName }}</td>
          <td>{{ admin.firstName }}</td>
          <td>
            <PentilaCheckbox
              v-model="admin.isSchoolAdmin"
              class="checkbox"
              :disabled="admin.isDirection || admin.userId === currentUser.userId"
              label=""
              @update:modelValue="toggleSchoolAdmin(admin)"
            />
          </td>
          <td>
            <PentilaCheckbox
              v-model="admin.isNewsDelegate"
              class="checkbox"
              :disabled="admin.isDirection"
              label=""
              @update:modelValue="toggleNewsDelegate(admin)"
            />
          </td>
        </tr>
      </table>
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

export default {
  name: 'Delegations',
  components: {
    AddDelegationModal
  },
  data () {
    return {
      schoolAdmins: [],
      isAddDelegationModalDisplayed: false
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
      if (user.isSchoolAdmin) {
        addSchoolAdmin(user.userId, this.selectedSchool.schoolId).then(
          (data) => {
            if (data.success) {
              // TODO toaster
            }
          }
        )
      } else {
        removeSchoolAdmin(user.userId, this.selectedSchool.schoolId).then(
          (data) => {
            if (data.success) {
              // TODO toaster
            }
          }
        )
      }
    },
    toggleNewsDelegate (user) {
      if (user.isNewsDelegate) {
        addNewsDelegate(user.userId, this.selectedSchool.schoolId).then(
          (data) => {
            if (data.success) {
              // TODO toaster
            }
          }
        )
      } else {
        removeNewsDelegate(user.userId, this.selectedSchool.schoolId).then(
          (data) => {
            if (data.success) {
              // TODO toaster
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
  display: flex;
  flex-direction: column;
  width: 100%;
}

.header {
  margin-bottom: 20px;
  .add-delegation {
    margin-right: 2em;
    float: right;
  }
}

.main-label {
  margin-top: 10em;
  text-align: center;
}

th {
  text-align: left;
}
tr {
  height: 2em;
  border-bottom: 1pt;
  .checkbox {
    margin: auto;
  }
}
</style>

<i18n locale="fr">
{
  "add-delegation": "Ajouter une délégation",
  "firstName": "Prénom",
  "lastName": "Nom",
  "local-admin" : "Administrateur local",
  "news-delegation": "Rédacteur annonces",
  "no-delegation" : "Aucune délégation pour cet établissement",
  "please-select-school": "Veuillez sélectionner un établissement",
  "warning": "La suppression de cet administrateur est définitive."
}
</i18n>
