<template>
  <div
    class="course"
    @click="selectCourse"
  >
    <header :style="`border-color:${course.color};background-color:${course.color}22;`">
      <span class="subject">{{ course.subject }}</span>
      <span class="infos">{{ course.groupName }} - {{ teacherName }}</span>
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
    teacherName () {
      return this.course.teacher.firstName.substring(0, 1) + '. ' + this.course.teacher.lastName
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
    @extend %font-medium-l;
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
