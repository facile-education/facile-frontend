<template>
  <PentilaDropdown
    v-if="userSchools.length > 1"
    v-model="selectedSchool"
    class="dropdown"
    :list="userSchools"
    display-field="schoolName"
  />
<!--  In fact, we don't need to display this kind of data when there is only one school -->
<!--  <h1 v-else>-->
<!--    {{ selectedSchool.schoolName }}-->
<!--  </h1>-->
</template>

<script>
export default {
  name: 'SelectedSchool',
  data () {
    return {
      selectedSchool: undefined
    }
  },
  computed: {
    userSchools () {
      // return [...this.$store.state.user.schoolList, ...this.$store.state.user.schoolList, ...this.$store.state.user.schoolList] // to test with many etab
      return this.$store.state.user.schoolList
    }
  },
  watch: {
    'selectedSchool' () {
      this.$store.dispatch('setSelectedSchool', this.selectedSchool)
    }
  },
  created () {
    this.selectedSchool = this.userSchools[0]
  }
}
</script>

<style scoped>
h1 {
  font-size: 1.25em;
}

.dropdown {
  margin: 15px 0;
}
</style>
