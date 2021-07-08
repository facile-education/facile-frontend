<template>
  <div class="student">
    {{ student.firstName + ' ' + student.lastName }}
  </div>
</template>

<script>
export default {
  name: 'StudentListItem',
  props: {
    student: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
