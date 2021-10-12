<template>
  <div
    class="item"
  >
    <div class="item-name">
      <img
        v-if="item.isHomework"
        class="item-type-icon"
        src="@assets/devoir.svg"
        :alt="$t('homework')"
        :title="$t('homework')"
      >
      <img
        v-else
        class="item-type-icon"
        src="@assets/seance.svg"
        :alt="$t('session')"
        :title="$t('session')"
      >
      <span>{{ item.name }}</span>
    </div>
    <!-- Calendar icon -->
    <div
      class="affect"
      @click="displayCalendarPicker()"
    >
      <img
        class="calendar"
        src="@assets/calendar.svg"
        :alt="$t('session')"
        :title="$t('session')"
      >
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
  components: {},
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
    displayCalendarPicker () {
      this.$store.dispatch('progression/setAffectedItem', this.item)
      this.$store.dispatch('progression/setCalendarPickerMode', true)
    },
    addedSessions () {
      console.log('addedSessions')
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  .item-name {
    margin: auto;
    display: flex;

    .item-type-icon {
      margin: auto;
      width: 20px;
      height: 20px;
    }
    span {
      margin: auto;
    }
    &:hover .affect {
      display: flex;
    }
  }
  .affect {
    margin: auto;
  }
  .item-sessions {
    width: 70%;
    max-width: 70%;
    display: flex;
    flex-direction: column;
    margin: auto;
  }
}
</style>

<i18n locale="fr">
{
  "session": "Séance",
  "homework": "Devoir"
}
</i18n>
