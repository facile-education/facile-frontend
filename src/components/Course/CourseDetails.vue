<template>
  <article class="course-details">
    <header
      :class="{'phone': mq.phone}"
      :style="`background-color: ${course.color}24; border-color: ${course.color};`"
    >
      <button
        class="back-button"
        @click="unselectCourse"
      >
        <img
          src="@assets/icons/chevron_right2.svg"
          alt=""
        >
        <span v-t="'back'" />
      </button>
      <h1>{{ course.groupName + ' - ' + course.subject }}</h1>
      <div
        v-if="!mq.phone"
        class="teachers"
      >
        <div>
          {{ course.teachers[0].firstName + ' ' + course.teachers[0].lastName }}
        </div>
        <div v-if="course.teachers.length > 1">
          {{ formattedRemainingTeachers }}
        </div>
      </div>
    </header>

    <div
      class="sessions"
      :class="{'phone': mq.phone}"
    >
      <WeprodeSpinner
        v-if="isLoading"
        style="z-index: 1"
      />
      <div
        v-else-if="error === true"
        v-t="'errorPlaceholder'"
        class="placeholder"
      />
      <div
        v-else-if="coursesSessions && coursesSessions.length === 0"
        v-t="'emptyCoursePlaceholder'"
        class="placeholder"
      />
      <ul v-else-if="coursesSessions">
        <li
          v-for="session in sortedCourseSessions"
          :key="session.sessionId"
        >
          <SessionDetails
            :session="session"
            :is-in-list="true"
            @update-session="getCourseSessions"
          />
        </li>
      </ul>
    </div>
  </article>
</template>

<script>

import WeprodeUtils from '@utils/weprode.utils'
import { defineAsyncComponent } from 'vue'

import { getCourseContent } from '@/api/course.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import { COURSES } from '@/constants/appConstants'
const SessionDetails = defineAsyncComponent(() => import('@components/Course/SessionDetails.vue'))

export default {
  name: 'CourseDetails',
  components: { SessionDetails, WeprodeSpinner },
  inject: ['mq'],
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      coursesSessions: undefined,
      isLoading: false,
      error: false,
      hideTeachersDrafts: false
    }
  },
  computed: {
    isTeacher () {
      return this.$store.state.user.isTeacher
    },
    formattedRemainingTeachers () {
      if (this.course.teachers.length === 2) {
        return this.course.teachers[1].firstName + ' ' + this.course.teachers[1].lastName
      } else {
        return this.$t('andOthers', { nbRemaining: this.course.teachers.length - 1 })
      }
    },
    sortedCourseSessions () {
      return WeprodeUtils.sortArrayWithString(this.coursesSessions, true, 'startDate')
    }
  },
  created () {
    this.getCourseSessions()
  },
  methods: {
    unselectCourse () {
      this.$router.push({ name: COURSES }).then(() => {
        this.$store.dispatch('course/setSelectedCourse', undefined)
      })
    },
    getCourseSessions () {
      this.isLoading = true
      getCourseContent(this.course.courseId, this.hideTeachersDrafts).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.coursesSessions = data.sessions
        } else {
          this.error = true
          console.error('Error when getting sessions')
        }
      }, (err) => {
        this.isLoading = false
        this.error = err
        console.error(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

article {
  height: 100%;
  --header-height: 80px;
  --mobile-header-height: 100px;
}

header {
  display: flex;
  height: var(--header-height);
  gap: 0.625rem;
  align-items: center;
  padding: 1rem 1.5rem;
  justify-content: space-between;
  align-self: stretch;
  border-radius: 6px;
  border-left: 8px solid;
  margin-bottom: 1rem;
  overflow: hidden;

  &.phone {
    padding-bottom: 0;
    height: var(--mobile-header-height);
    flex-direction: column;
    align-items: flex-start;

    h1 {
      text-align: left;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.back-button {
  white-space: nowrap;
  display: flex;
  height: 32px;
  width: 154px;
  padding: 8px;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-radius: 6px;
  border: 1px solid $neutral-60;
  background: $neutral-10;

  span {
    flex: 1;
    text-align: center;
    @extend %font-regular-m;
  }

  img {
    transform: rotate(180deg);
  }

  &:hover {
    filter: brightness(115%);
    -webkit-transition: .2s filter linear;
    -moz-transition: .2s filter linear;
    -ms-transition: .2s filter linear;
    -o-transition: .2s filter linear;
    transition: .2s filter linear;
  }
}

h1 {
  margin: 0;
  text-align: center;
  @extend %font-heading-xs;
}

.teachers {
  @extend %font-regular-l;
  div {
    line-height: 1.5rem;
  }
}

.sessions {
  position: relative;
  min-height: 200px;
  height: calc(100% - var(--header-height) - 1rem);
  overflow-y: auto;

  &.phone {
    height: calc(100% - var(--mobile-header-height) - 1rem);
  }
}

.placeholder {
  @extend %content-placeholder;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 3rem
}
</style>

<i18n locale="fr">
{
  "andOthers": "et {nbRemaining} autres",
  "back": "Revenir aux cours",
  "emptyCoursePlaceholder": "Aucun contenu à afficher pour ce cours",
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "showDrafts": "Montrer les nons publiés",
  "hideDrafts": "Cacher les nons publiés"
}
</i18n>
