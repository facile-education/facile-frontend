<template>
  <div
    class="item-assignment"
  >
    <div class="item-name">
      <span>{{ item.name }}</span>
    </div>
    <div
      class="item-sessions"
    >
      <div
        v-for="assignment in item.assignments"
        :key="assignment.assignmentId"
        class="session"
      >
        <!-- Color pin -->
        <!-- Session -->
        <span>{{ assignment.session }}</span>
        <!-- Session date -->
        <!-- Session hour from to -->
        <!-- Homework send date -->
        <!-- Modified content -->
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ItemAssignment',
  components: { },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
span {
  margin-top:10px;
  margin-left:10px;
  margin-bottom:10px;
}
</style>

<i18n locale="fr">
{
}
</i18n>
