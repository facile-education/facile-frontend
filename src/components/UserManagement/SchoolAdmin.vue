<template>
  <div
    class="school-admin"
  >
    <div class="school-picker">
      <PentilaDropdown
        v-if="schools && schools.length > 1"
        v-model="selectedSchool"
        class="schools"
        :list="schools"
        :sort="true"
        display-field="schoolName"
      />
    </div>
    <div class="main">
      <div class="search">
        <Search
          @selectUser="selectUser"
        />
      </div>
      <div class="school-admins">
        <div
          v-if="selectedSchool === undefined"
        >
          <p>{{ $t('please-select-school') }}</p>
        </div>
        <div
          v-else
        >
          <div
            v-if="schoolAdmins.length === 0"
          >
            <p>{{ $t('no-admin') }}</p>
          </div>
          <div
            v-else
            class="admin-list"
          >
            <p>{{ $t('admins-for-school') }} {{ selectedSchool.schoolName }} {{ $t('are') }}</p>
            <PentilaTagItem
              v-for="(schoolAdmin, index) in schoolAdmins"
              :key="index"
              :tag="schoolAdmin.fullName"
              @remove="removeSchoolAdmin(schoolAdmin)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Search from '@/components/UserManagement/Search.vue'
import { addSchoolAdmin, removeSchoolAdmin, getSchoolAdmins } from '@/api/userManagement.service'
export default {
  name: 'SchoolAdmin',
  components: {
    Search
  },
  data () {
    return {
      selectedSchool: this.$store.state.userManagement.schools[0],
      schoolAdmins: []
    }
  },
  computed: {
    schools () {
      return this.$store.state.userManagement.schools
    }
  },
  created () {
    getSchoolAdmins(this.selectedSchool.schoolId).then(
      (data) => {
        if (data.success) {
          this.schoolAdmins = data.admins
        }
      }
    )
  },
  methods: {
    selectUser () {
      addSchoolAdmin(this.selectedSchool.schoolId, this.$store.state.user.userId).then(
        (data) => {
          if (data.success) {
            this.schoolAdmins.push(data.admin)
          }
        }
      )
    },
    removeSchoolAdmin () {
      removeSchoolAdmin(this.selectedSchool.schoolId, this.$store.state.user.userId).then(
        (data) => {
          if (data.success) {
            // TODO
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.school-admin {
  display: flex;
  flex-direction: column;

  .main {
    display: flex;

    .search {
      width: 50%;
      height: 100%;
    }
    .school-admins {
      width: 50%;
      height: 100%;
      border-left: 1px solid black;

      .admin-list {
      }
    }
  }
}
</style>

<i18n locale="fr">
{
  "please-select-school": "Veuillez sélectionner un établissement",
  "no-admin" : "Aucun administrateur",
  "admins-for-school": "Les administrateurs de ",
  "are": "sont:"
}
</i18n>
