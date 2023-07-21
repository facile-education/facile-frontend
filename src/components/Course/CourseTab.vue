<template>
  <div class="course-tab">
    <div
      v-if="isLoading"
      class="placeholder"
    >
      <PentilaSpinner />
    </div>
    <div
      v-if="error === true"
      v-t="'errorPlaceholder'"
      class="placeholder"
    />
    <div
      v-else-if="courses.length === 0"
      v-t="'emptyPlaceholder'"
      class="placeholder"
    />
    <ul
      v-else-if="!selectedCourse"
      class="courses"
    >
      <li
        v-for="course in courses"
        :key="course.courseId"
      >
        <CourseItem :course="course" />
      </li>
    </ul>
    <CourseDetails
      v-else
      :course="selectedCourse"
    />
  </div>
</template>

<script>
import CourseDetails from '@components/Course/CourseDetails.vue'
import CourseItem from '@components/Course/CourseItem.vue'

import { getCourses } from '@/api/course.service'

export default {
  name: 'CourseTab',
  components: { CourseDetails, CourseItem },
  inject: ['mq'],
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      courses: [],
      isLoading: false,
      error: false
    }
  },
  computed: {
    selectedCourse () {
      return this.$store.state.course.selectedCourse
    }
  },
  created () {
    this.isLoading = true
    getCourses(this.userId).then((data) => {
      this.isLoading = false
      if (data.success) {
        this.error = false
        this.courses = data.courses
      } else {
        this.error = true
        console.error('Cannot retrieve courses')
      }
    }, (err) => {
      this.isLoading = false
      this.error = true
      console.error(err)
    })
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.placeholder {
  @extend %content-placeholder;
}

.courses {
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, 268px);
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  height: 100%; // todo: find the good value
  overflow: auto;
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucun cours à afficher"
}
</i18n>
