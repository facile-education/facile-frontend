<template>
  <div
    class="subjects-header"
    @click="isExpanded = !isExpanded"
  >
    {{ $t('subjects') }}
    <div
      class="caret"
    >
      <FontAwesomeIcon
        v-if="isExpanded"
        icon="caret-up"
        class="caret"
      />
      <FontAwesomeIcon
        v-else
        icon="caret-down"
        class="caret"
      />
    </div>
  </div>
  <div
    v-if="isExpanded"
    class="subjects"
  >
    <div
      v-for="subject in sortedSubjects"
      :key="subject.orgId"
      class="subject"
      @click="getMembers(subject)"
    >
      <span>{{ subject.groupName }}</span>
    </div>
  </div>
</template>

<script>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import PentilaUtils from 'pentila-utils'

export default {
  name: 'SchoolSubjects',
  components: {
    FontAwesomeIcon
  },
  inject: ['mq'],
  props: {
    subjects: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      isExpanded: false
    }
  },
  computed: {
    sortedSubjects () {
      return PentilaUtils.Array.sortWithString(this.subjects, false, 'groupName')
    }
  },
  methods: {
    getMembers (subject) {
      this.$store.dispatch('contact/getMembers', subject)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';
.subjects-header {
  display: flex;
  justify-content: space-between;
  &:hover {
    background-color: lightgray;
  }
}
.subject {
  margin-left: 10px;
  &:hover {
    cursor: pointer;
    background-color: lightgray;
  }
}
</style>

<i18n locale="fr">
  {
    "subjects": "Disciplines"
  }
</i18n>
