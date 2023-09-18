<template>
  <div class="course-tab">
    <PentilaSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <div
      v-if="error === true"
      v-t="'errorPlaceholder'"
      class="placeholder"
    />
    <div
      v-else-if="courses && courses.length === 0"
      v-t="'emptyPlaceholder'"
      class="placeholder"
    />
    <ul
      v-else-if="courses && !selectedCourse"
      class="courses"
      :class="{'phone': mq.phone}"
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
import PentilaUtils from 'pentila-utils'
import { defineAsyncComponent } from 'vue'

import { getCourses } from '@/api/course.service'
const CourseItem = defineAsyncComponent(() => import('@components/Course/CourseItem.vue'))
const CourseDetails = defineAsyncComponent(() => import('@components/Course/CourseDetails.vue'))

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
      return PentilaUtils.Array.sortWithString(this.courses, false, 'groupName')
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
}

.placeholder {
  @extend %content-placeholder;
}

.courses {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &:not(.phone) {
    display: grid;
    grid-gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, 268px);
  }
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  overflow: auto;
}

.course-tab {
  position: relative;
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucun cours à afficher"
}
</i18n>
