<template>
  <div class="course-tab">
    <WeprodeSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <div
      v-if="error === true"
      v-t="'Course.CourseTab.errorPlaceholder'"
      class="placeholder"
    />
    <div
      v-else-if="courses && courses.length === 0"
      v-t="'Course.CourseTab.emptyPlaceholder'"
      class="placeholder"
    />
    <ul
      v-else-if="courses && !selectedCourse"
      class="courses"
    >
      <li
        v-for="course in sortedCourses"
        :key="course.courseId"
      >
        <CourseItem :course="course" />
      </li>
    </ul>
    <CourseDetails
      v-else-if="selectedCourse"
      :course="selectedCourse"
    />
  </div>
</template>

<script>
import WeprodeUtils from '@utils/weprode.utils'
import { defineAsyncComponent } from 'vue'

import { getCourses } from '@/api/course.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
const CourseItem = defineAsyncComponent(() => import('@components/Course/CourseItem.vue'))
const CourseDetails = defineAsyncComponent(() => import('@components/Course/CourseDetails.vue'))

export default {
  name: 'CourseTab',
  components: { CourseDetails, CourseItem, WeprodeSpinner },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      courses: undefined,
      isLoading: false,
      error: false
    }
  },
  computed: {
    selectedCourse () {
      return this.$store.state.course.selectedCourse
    },
    sortedCourses () {
      return WeprodeUtils.sortArrayWithString(this.courses, false, 'groupName')
    }
  },
  watch: {
    userId () {
      this.getCourses()
    }
  },
  created () {
    this.getCourses()
  },
  methods: {
    getCourses () {
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.course-tab {
  min-height: 200px;
  height: 100%;
  position: relative;
}

.placeholder {
  @extend %content-placeholder;
}

.courses {
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(268px, 1fr));
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  overflow: auto;
}
</style>
