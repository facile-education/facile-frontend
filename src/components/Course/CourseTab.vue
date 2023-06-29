<template>
  <div>
    <div class="courses">
      <CourseItem
        v-for="course in courses"
        :key="course.courseId"
        :course="course"
      />
    </div>
  </div>
</template>

<script>
import CourseItem from '@components/Course/CourseItem.vue'

import { getCourses } from '@/api/course.service'

export default {
  name: 'CourseTab',
  components: { CourseItem },
  inject: ['mq'],
  data () {
    return {
      courses: []
    }
  },
  computed: {
  },
  created () {
    getCourses().then(
      (data) => {
        if (data.success) {
          this.courses = data.courses
        }
      }
    )
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.courses {
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, 200px);
}
</style>

<i18n locale="fr">
{
}
</i18n>
