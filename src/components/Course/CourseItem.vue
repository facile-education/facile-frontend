<template>
  <div
    class="course"
    tabindex="0"
    @keyup.enter="selectCourse"
    @click="selectCourse"
  >
    <header :style="`border-color:${course.color};background-color:${course.color}24;`">
      <span class="subject">{{ course.groupName }}</span>
      <span
        class="infos"
        :title="formattedTeachersLabel"
      >
        {{ formattedTeachersLabel }}
      </span>
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
      this.$store.dispatch('course/setSelectedCourse', this.course)
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
  cursor: pointer;

  &:hover {
    filter: brightness(115%);
    -webkit-transition: .2s filter linear;
    -moz-transition: .2s filter linear;
    -ms-transition: .2s filter linear;
    -o-transition: .2s filter linear;
    transition: .2s filter linear;
  }
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    @extend %font-regular-xs;
  }
}
</style>
