<template>
  <h1 :aria-label="$t('Course.serviceTitle')" />
  <WeprodeTabList v-if="isTeacher">
    <WeprodeTabItem
      :title="$t('Course.schedule')"
    >
      <ScheduleTab />
    </WeprodeTabItem>
    <WeprodeTabItem
      :title="$t('Course.course')"
      class="course-tab-content"
    >
      <CourseTab :user-id="selectedUser.userId" />
    </WeprodeTabItem>
    <!--            <WeprodeTabItem-->
    <!--              :title="$t('Course.toCorrect')"-->
    <!--            >-->
    <!--              <TeacherHomeworkTab />-->
  </WeprodeTabList>
  <div
    v-else
    style="height: 100%"
  >
    <div
      v-if="childList.length > 1"
      class="first-line"
    >
      <WeprodeDropdown
        v-model="selectedChild"
        :list="childList"
        :sort="false"
        display-field="firstName"
        class="child-selector"
        @update:model-value="changeStudent"
      />
    </div>

    <WeprodeTabList ref="tabList">
      <WeprodeTabItem
        :title="$t('Course.homework')"
        :nb-notification="nbUndoneHomeworks"
      >
        <HomeworkTab :user-id="selectedUser.userId" />
      </WeprodeTabItem>
      <WeprodeTabItem
        :title="$t('Course.course')"
        class="course-tab-content"
      >
        <CourseTab :user-id="selectedUser.userId" />
      </WeprodeTabItem>
    </WeprodeTabList>
  </div>
</template>

<script>
// import TeacherHomeworkTab from '@/components/Course/TeacherHomeworkTab.vue'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeTabItem from '@/components/Base/Weprode/WeprodeTabItem.vue'
import WeprodeTabList from '@/components/Base/Weprode/WeprodeTabList.vue'
import CourseTab from '@/components/Course/CourseTab.vue' // TODO: async
import HomeworkTab from '@/components/Course/HomeworkTab.vue'
import ScheduleTab from '@/components/Course/ScheduleTab.vue'

export default {
  name: 'Course',
  components: {
    CourseTab,
    HomeworkTab,
    ScheduleTab,
    WeprodeTabList,
    WeprodeTabItem,
    WeprodeDropdown
    // TeacherHomeworkTab
  },
  inject: ['mq'],
  emits: ['update:layout'],
  data () {
    return {
      selectedUser: undefined,
      initHomeworkId: undefined
    }
  },
  computed: {
    nbUndoneHomeworks () {
      return this.$store.state.course.nbUndoneHomeworks
    },
    childList () {
      return this.$store.state.user.children
    },
    selectedChild: {
      get () {
        return this.$store.state.user.selectedChild
      },
      set (child) {
        this.$store.commit('user/setSelectedChild', child)
        this.selectedUser = child
      }
    },
    isTeacher () {
      return this.$store.state.user.isTeacher
    },
    studentId () {
      // TODO if parent
      return this.$store.state.user.userId
    }
  },
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  },
  created () {
    if (this.$store.state.user.isStudent || this.$store.state.user.isParent) {
      this.$store.dispatch('course/getStudentUndoneCount', this.studentId)
    }

    // Assume childList is correctly loaded at this state
    if (this.childList.length > 0) {
      if (!this.selectedChild) {
        this.$store.commit('user/setSelectedChild', this.childList[0])
      }
      this.selectedUser = this.selectedChild
    } else {
      this.selectedUser = this.$store.state.user
    }
  },
  mounted () {
    if (this.$route.query.sessionId) {
      if (this.isTeacher) {
        // Select ScheduleTab and select the correct session
        this.selectTab('sessions')
      }
    } else if (this.$route.query.courseId) {
      if (!this.isTeacher) {
        // Select courseTab and select the correct session
        this.selectTab('courses')
      }
    } else if (this.$route.query.homeworkId) {
      if (this.isTeacher) {
        // Select ScheduleTab and select the correct session
        this.selectTab('sessions')
      } else {
        // Select HomeworkTab and select the correct homework
        this.selectTab('todo')
      }
    }
  },
  beforeUnmount () {
    this.$store.dispatch('course/setSelectedCourse', undefined)
    this.$store.dispatch('course/unselectSession')
  },
  methods: {
    selectTab (tabName) {
      if (tabName === 'todo' || tabName === 'sessions') {
        this.$refs.tabList.selectTab(0)
      } else if (tabName === 'courses') {
        this.$refs.tabList.selectTab(1)
      }
    },
    changeStudent () {
      this.$store.dispatch('course/getStudentUndoneCount', this.studentId)
      this.$store.dispatch('course/setSelectedCourse', undefined)
    }
  }
}
</script>

<style lang="scss">
@import '@design';

.base-tab {
  color: $neutral-100;

  @extend %font-regular-l;

  &.active {
    @extend %font-bold-l;
  }
}
</style>

<style lang="scss" scoped>
.course-tab-content {
  height: calc(100% - calc(33px + 1rem)); // 33px +1rem is tab height
}

.child-selector {
  margin-bottom: 0.5rem;
}
</style>
