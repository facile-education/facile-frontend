<template>
  <div
    class="communities-header"
    @click="isExpanded = !isExpanded"
  >
    {{ $t('communities') }}
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
    class="communities"
  >
    <div
      v-for="community in communities"
      :key="community.groupName"
      class="community"
      @click="getMembers(community.groupId)"
    >
      <span>{{ community.groupName }}</span>
    </div>
  </div>
</template>

<script>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'SchoolSubjects',
  components: {
    FontAwesomeIcon
  },
  inject: ['mq'],
  props: {
    communities: {
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
  },
  methods: {
    getMembers (groupId) {
      this.$store.dispatch('contact/getCommunityMembers', groupId)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';
.communities-header {
  display: flex;
  justify-content: space-between;
}
.community {
  margin-left: 10px;
  &:hover {
    cursor: pointer;
    background-color: lightgray;
  }
}
</style>

<i18n locale="fr">
  {
    "communities": "Communautés"
  }
</i18n>
