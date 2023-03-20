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
        @click="toggleNode(school.schoolId)"
      >
        <!-- <div class="address-book-icon">
          <img src="@assets/school.svg">
        </div> -->
        {{ school.schoolName }}
        <div
          class="caret"
        >
          <FontAwesomeIcon
            v-if="school.isExpanded"
            icon="caret-up"
            class="caret"
          />
          <FontAwesomeIcon
            v-else
            icon="caret-down"
            class="caret"
          />
        </div>
      </div>
      <div class="school-categories">
        <SchoolPersonals
          v-if="school.Personnels"
          :populations="school.Personnels"
        />
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SchoolPersonals from './SchoolPersonals.vue'
import SchoolClasses from './SchoolClasses.vue'
import SchoolCours from './SchoolCours.vue'
import SchoolSubjects from './SchoolSubjects.vue'
import Communities from './Communities.vue'

export default {
  name: 'AddressBook',
  components: {
    FontAwesomeIcon,
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
    }
  },
  created () {
    this.getContactTree()
  },
  methods: {
    toggleNode (schoolId) {
      this.$store.dispatch('contact/toggleSchool', schoolId)
    },
    getContactTree () {
      contactService.getContactTree().then((data) => {
        if (data.success) {
          console.log('categories=', data.categories)
          this.$store.dispatch('contact/setContactTree', data.categories)
        }
      })
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
</style>
