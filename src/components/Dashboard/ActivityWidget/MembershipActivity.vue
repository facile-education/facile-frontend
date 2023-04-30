<template>
  <div
    class="activity"
  >
    <div>
      <span>{{ activity.actionUserName }}</span>
      <span v-t="isAddActivity ? 'add' : 'remove' " />
      <span>{{ activity.shortTargetUserNames !== "" ? activity.shortTargetUserNames : activity.targetUserNames }}</span>
      <span v-t="'toTheGroup' " />
      <span> {{ activity.groupName }}</span>
    </div>
    <div> {{ activity.modificationDate }}</div>
  </div>
</template>

<script>
import activityConstants from '@/constants/activityConstants'

export default {
  name: 'MembershipActivity',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    isAddActivity () {
      return this.activity.type === activityConstants.TYPE_ADD_MEMBERSHIP
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.activity {
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>

<i18n locale="fr">
{
  "add": "a ajouté ",
  "toTheGroup": " au groupe",
  "remove": "a retiré "
}
</i18n>
