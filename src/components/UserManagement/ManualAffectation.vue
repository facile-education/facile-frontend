<template>
  <div
    class="manual-affectation"
  >
    <div
      class="search"
    >
      <Search
        @selectUser="selectUser"
      />
    </div>
    <div
      class="right-column"
    >
      <div
        class="user-affectations"
      >
        <div
          v-if="!isUserSelected"
        >
          <p>{{ $t('please-select-user') }}</p>
        </div>
        <div
          v-else
        >
          <p>{{ $t('selected-user') }} {{ selectedUser.lastName }} {{ selectedUser.firstName }}</p>
          <div
            v-if="orgList.length === 0"
          >
            <p>{{ $t('no-affectation') }}</p>
          </div>
          <div
            v-else
            class="affectations"
          >
            <PentilaTagItem
              v-for="(org, index) in orgList"
              :key="index"
              :tag="org.orgName"
              @remove="removeOrg(org)"
            />
          </div>
        </div>
      </div>
      <div
        class="school-classes"
      >
        <div
          v-for="school in schools"
          :key="school.schoolId"
          class="school"
        >
          <div
            class="school-header"
            @click="toggleSchool(school)"
          >
            <img
              v-if="school.isExpanded"
              src="@assets/arrow-right.svg"
              :alt="$t('expand')"
              :title="$t('expand')"
            >
            <img
              v-else
              src="@assets/arrow-down.svg"
              :alt="$t('collapse')"
              :title="$t('collapse')"
            >
            <span>{{ school.schoolName }}</span>
          </div>
          <div
            v-for="org in school.orgs"
            :key="org.orgId"
          >
            <div
              class="org"
              @click="addOrg(org)"
            >
              <span>{{ org.orgName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Search from '@/components/UserManagement/Search.vue'
import { addUserToOrg, removeUserFromOrg, getManuallyAddedOrgs } from '@/api/userManagement.service'

export default {
  name: 'ManualAffectation',
  components: {
    Search
  },
  data () {
    return {
      selectedUser: undefined,
      orgList: []
    }
  },
  computed: {
    schools () {
      return this.$store.state.userManagement.schools
    },
    isUserSelected () {
      return this.selectedUser !== undefined && this.selectedUser.userId !== undefined
    }
  },
  created () {
    if (this.schools.length === 1) {
      this.$store.dispatch('userManagement/getSchoolClasses', this.schools[0].schoolId)
      this.$store.dispatch('userManagement/toggleExpandedSchool', { schoolId: this.schools[0].schoolId })
    }
  },
  methods: {
    selectUser (user) {
      this.selectedUser = user
      this.refreshUserOrgs(this.selectedUser.userId)
    },
    removeOrg (org) {
      console.log('removing class ', org)
      this.orgList.slice().filter(function (_org) {
        return (_org.className !== org.className)
      })
      removeUserFromOrg(this.selectedUser.userId, org.orgId).then(
        (data) => {
          if (data.success) {
            this.refreshUserOrgs(this.selectedUser.userId)
          }
        }
      )
    },
    toggleSchool (school) {
      this.$store.dispatch('userManagement/toggleExpandedSchool', { schoolId: school.schoolId })
      if (!school.isExpanded) {
        this.$store.dispatch('userManagement/getSchoolOrgs', { schoolId: school.schoolId })
      }
    },
    addOrg (org) {
      if (this.isUserSelected) {
        addUserToOrg(this.selectedUser.userId, org.orgId).then(
          (data) => {
            if (data.success) {
              this.refreshUserOrgs(this.selectedUser.userId)
            }
          }
        )
      }
    },
    refreshUserOrgs (userId) {
      getManuallyAddedOrgs(this.selectedUser.userId).then(
        (data) => {
          if (data.success) {
            this.orgList = data.orgs
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.manual-affectation {
  display: flex;
  height: 100%;
  .search {
    width: 50%;
    height: 100%;
  }
  .right-column {
    width: 50%;
    height: 100%;
    border-left: 1px solid black;

    .user-affectations {
      height: 30%;
      border-bottom: 1px solid black;
      p {
        margin-left: 30px;
      }
      .affectations {
        margin-left: 30px;
      }
    }
    .school-classes {
      height: 70%;
      .school {
        margin-top: 5px;
        display: flex;
        flex-direction: column;
        .school-header {
          img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }
        }
        .org {
          margin-left: 30px;
          &:hover {
            cursor: pointer;
          }
          span {
          }
        }
      }
    }
  }
}
</style>

<i18n locale="fr">
{
  "search": "Recherche",
  "searchPlaceHolder": "Taper le nom et/ou le prénom",
  "please-select-user": "Veuillez sélectionner un utilisateur",
  "selected-user": "Utilisateur sélectionné",
  "no-affectation": "N'est affecté manuellement à aucune classe ni aucun cours",
  "lastName": "Nom",
  "firstName": "Prénom",
  "expand": "Déplier",
  "collapse": "Replier"
}
</i18n>
