<template>
  <Layout :is-allowed="isTeacher || $store.state.user.isStudent || $store.state.user.isParent">
    <PentilaTabList v-if="isTeacher">
      <PentilaTabItem
        :title="$t('schedule')"
      >
        <ScheduleTab />
      </PentilaTabItem>
      <PentilaTabItem
        :title="$t('course')"
        class="course-tab-content"
      >
        <CourseTab :user-id="selectedUser.userId" />
      </PentilaTabItem>
      <!--            <PentilaTabItem-->
      <!--              :title="$t('toCorrect')"-->
      <!--            >-->
      <!--              <TeacherHomeworkTab />-->
      <!--            </PentilaTabItem>-->
    </PentilaTabList>
    <div v-else>
      <div
        v-if="childList.length > 1"
        class="first-line"
      >
        <PentilaDropdown
          v-model="selectedChild"
          :list="childList"
          :sort="false"
          display-field="fullName"
          class="child-selector"
          @update:model-value="changeStudent"
        />
      </div>

      <PentilaTabList ref="tabList">
        <PentilaTabItem
          :title="$t('homework')"
          :nb-notification="nbUndoneHomeworks"
        >
          <HomeworkTab :user-id="selectedUser.userId" />
        </PentilaTabItem>
        <PentilaTabItem
          :title="$t('course')"
        >
          <CourseTab :user-id="selectedUser.userId" />
        </PentilaTabItem>
      </PentilaTabList>
    </div>
  </Layout>
</template>

<script>
import CourseTab from '@/components/Course/CourseTab.vue' // TODO: async
import HomeworkTab from '@/components/Course/HomeworkTab.vue'
import ScheduleTab from '@/components/Course/ScheduleTab.vue'
// import TeacherHomeworkTab from '@/components/Course/TeacherHomeworkTab.vue'
import Layout from '@/router/layouts/BannerLayout'

export default {
  name: 'Course',
  components: {
    Layout,
    CourseTab,
    HomeworkTab,
    ScheduleTab
    // TeacherHomeworkTab
  },
  inject: ['mq'],
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
  created () {
    if (this.$store.state.user.isStudent || this.$store.state.user.isParent) {
      this.$store.dispatch('course/getStudentUndoneCount', this.studentId)
    }

    // Assume childList is correctly loaded at this state
    if (this.childList.length > 0) {
      this.$store.commit('user/setSelectedChild', this.childList[0])
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
  height: calc(100% - 40px); // 40px is tab height
}
</style>

<i18n locale="fr">
{
  "course": "Cours",
  "serviceTitle": "Cours & Devoirs",
  "schedule": "Séances",
  "homework": "À faire",
  "toCorrect": "À corriger"
}
</i18n>
