<template>
  <header :style="`background-color: ${course.color}24; border-color: ${course.color};`">
    <button
      class="back-button"
      @click="unselectCourse"
    >
      <img
        src="@/assets/icons/chevron-right.svg"
        alt=""
      >
      <span v-t="'back'" />
    </button>
    <h2>{{ course.groupName + ' - ' + course.subject }}</h2>
    <div class="teachers">
      <div>
        {{ course.teachers[0].firstName + ' ' + course.teachers[0].lastName }}
      </div>
      <div v-if="course.teachers.length > 1">
        {{ formattedRemainingTeachers }}
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'CourseDetails',
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedRemainingTeachers () {
      if (this.course.teachers.length === 2) {
        return this.course.teachers[1].firstName + ' ' + this.course.teachers[1].lastName
      } else {
        return this.$t('andOthers', { nbRemaining: this.course.teachers.length - 1 })
      }
    }
  },
  methods: {
    unselectCourse () {
      this.$store.dispatch('course/setSelectedCourse', undefined)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

header {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  justify-content: space-between;
  align-self: stretch;
  border-radius: 6px;
  border-left: 8px solid;
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

h2 {
  margin: 0;
  @extend %font-heading-xs;
}

.teachers {
  @extend %font-regular-l;
  div {
    line-height: 1.5rem;
  }
}
</style>

<i18n locale="fr">
{
  "back": "Revenir aux cours",
  "andOthers": "et {nbRemaining} autres"
}
</i18n>
