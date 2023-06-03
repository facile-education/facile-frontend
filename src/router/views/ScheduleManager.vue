<template>
  <Layout
    :is-allowed="$store.state.user.isLocalAdmin || $store.state.user.isDirectionMember || $store.state.user.isAdministrator"
  >
    <GlobalScheduleConfiguration v-if="isAdministrator" />
    <PentilaDropdown
      v-if="managedSchoolList.length > 1"
      v-model="selectedSchool"
      class="school-dropdown"
      :list="managedSchoolList"
      display-field="schoolName"
      :sort="!isGlobalAdmin"
    />
    <SchoolScheduleConfiguration
      v-if="selectedSchool"
      :school-id="selectedSchool.schoolId"
    />
  </Layout>
</template>

<script>

import Layout from '@/router/layouts/BannerLayout'
import GlobalScheduleConfiguration from '@/components/ScheduleManager/GlobalScheduleConfiguration.vue'
import SchoolScheduleConfiguration from '@/components/ScheduleManager/SchoolScheduleConfiguration.vue'

export default {
  name: 'ScheduleManager',
  components: {
    Layout,
    GlobalScheduleConfiguration,
    SchoolScheduleConfiguration
  },
  data () {
    return {
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    managedSchoolList () {
      console.log('admin=', this.$store.state.administration)
      if (this.isGlobalAdmin && this.$store.state.administration.schoolList !== undefined) {
        return this.$store.state.administration.schoolList
      }
      return []
    },
    selectedSchool: {
      get () {
        return this.$store.state.administration.selectedSchool
      },
      set (school) {
        this.$store.commit('administration/setSelectedSchool', school)
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@media screen and (min-width: 700px) {
  .dates {
    display: flex;
  }

  .start-date, .end-date {
    flex: 1;
  }
}

.start-date, .end-date {
  margin-bottom: 15px;
}
</style>

<i18n locale="fr">
{
  "startDateLabel": "Début d'année scolaire",
  "semesterDateLabel": "Limite de semestre",
  "endDateLabel": "Fin d'année scolaire"
}
</i18n>
