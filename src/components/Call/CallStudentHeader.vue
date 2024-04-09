<template>
  <div>
    {{ student.lastName + ' ' + student.firstName }}
  </div>
</template>

<script>
export default {
  name: 'CallStudentHeader',
  props: {
    student: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
