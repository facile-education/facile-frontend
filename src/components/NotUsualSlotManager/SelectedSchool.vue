<template>
  <h1 v-if="userSchools.length === 1">
    {{ selectedSchool.schoolName }}
  </h1>
  <PentilaDropdown
    v-else
    v-model="selectedSchool"
    class="dropdown"
    :list="userSchools"
    display-field="schoolName"
  />
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
