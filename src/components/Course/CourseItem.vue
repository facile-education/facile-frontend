<template>
  <div
    class="course"
    @click="selectCourse"
  >
    <header :style="`border-color:${course.color};background-color:${course.color}22;`">
      <span class="subject">{{ course.groupName }}</span>
      <span class="infos">{{ formattedTeachersLabel }}</span>
    </header>
  </div>
</template>

<script>
export default {
  name: 'CourseItem',
  inject: ['mq'],
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user
    },
    formattedTeachersLabel () {
      let label = ''
      this.course.teachers.forEach(teacher => {
        if (this.currentUser && this.currentUser.userId !== teacher.userId) {
          const name = teacher.firstName.substring(0, 1) + '. ' + teacher.lastName
          label += (label === '') ? name : ', ' + name
        }
      })
      return label
    }
  },
  methods: {
    selectCourse () {
      // Display selected course progression and details
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.course {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
}

header {
  display: flex;
  padding: 1rem 1.5rem;
  flex-direction: column;
  align-self: stretch;
  border-radius: 6px;
  border-left: 8px solid;

  .subject {
    @extend %font-bold-l;
  }

  .infos {
    @extend %font-regular-xs;
  }
}
</style>

<i18n locale="fr">
{
}
</i18n>
