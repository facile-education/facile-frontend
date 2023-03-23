<template>
  <div class="menu-panel">
    <!-- Loop over schools -->
    <div
      v-for="school in schools"
      :key="school.schoolId"
      class="school"
    >
      <div
        class="school-header"
      >
        <!-- <div class="address-book-icon">
          <img src="@assets/school.svg">
        </div> -->
        {{ school.schoolName }}
      </div>
      <div class="school-categories">
        <SchoolPersonals
          v-if="school.Personnels"
          :populations="school.Personnels"
        />
        <!-- Students and parents have student and parents lists -->
        <div
          v-if="isStudent || isRelative"
          class="population"
          @click="getMyStudents()"
        >
          <span v-if="isStudent">{{ $t('students') }}</span>
          <span v-if="isRelative">{{ $t('my-students') }}</span>
        </div>
        <div
          v-if="isStudent || isRelative"
          class="population"
          @click="getMyRelatives()"
        >
          <span>{{ $t('relatives') }}</span>
        </div>

        <SchoolClasses
          v-if="school.classes"
          :classes="school.classes"
        />
        <SchoolCours
          v-if="school.cours"
          :cours="school.cours"
        />
        <SchoolSubjects
          v-if="school.subjects"
          :subjects="school.subjects"
        />
      </div>
    </div>
    <!-- Communities -->
    <Communities
      :communities="communities"
    />
  </div>
</template>

<script>

import contactService from '@/api/contact.service'
import SchoolPersonals from './SchoolPersonals.vue'
import SchoolClasses from './SchoolClasses.vue'
import SchoolCours from './SchoolCours.vue'
import SchoolSubjects from './SchoolSubjects.vue'
import Communities from './AddressBookCommunities.vue'

export default {
  name: 'AddressBook',
  components: {
    SchoolPersonals,
    SchoolClasses,
    SchoolCours,
    SchoolSubjects,
    Communities
  },
  inject: ['mq'],
  props: {
  },
  data: function () {
    return {
    }
  },
  computed: {
    schools () {
      return this.$store.state.contact.schools
    },
    communities () {
      return this.$store.state.contact.communities
    },
    isStudent () {
      return this.$store.state.user.isStudent
    },
    isRelative () {
      return this.$store.state.user.isParent
    }
  },
  created () {
    this.getContactTree()
  },
  methods: {
    getContactTree () {
      contactService.getContactTree().then((data) => {
        if (data.success) {
          console.log('categories=', data.categories)
          this.$store.dispatch('contact/setContactTree', data.categories)
        }
      })
    },
    getMyStudents () {
      this.$store.dispatch('contact/getMyStudents')
    },
    getMyRelatives () {
      this.$store.dispatch('contact/getMyRelatives')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.menu-panel {
  max-height: 800px;
  overflow-y: auto;
}
.school-header {
  display: flex;
  justify-content: space-between;
}
.school-categories {
  margin-left: 10px;
}
.population {
  &:hover {
    cursor: pointer;
    background-color: lightgray;
  }
}
</style>

<i18n locale="fr">
  {
    "students": "Elèves",
    "my-students": "Elèves en responsabilité",
    "relatives": "Responsables légaux"
  }
</i18n>
