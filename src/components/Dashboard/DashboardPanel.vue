<template>
  <div class="dashboard-panel">
    <!-- Left column contains 1 widget : the group's activity -->
    <div
      class="dashboard-column-1"
    >
      <GroupNewsWidget
        v-if="hasGroupNewsWidget"
        class="widget"
      />
    </div>

    <!-- Middle column contains all other widgets : school news, homeworks -->
    <div
      class="dashboard-column-2"
    >
      <SchoolNewsWidget
        v-if="hasSchoolNewsWidget"
        class="widget"
      />
      <HomeworkWidget
        v-if="hasHomeworkWidget"
        class="widget"
      />
    </div>

    <!-- Right column contains EDT widget -->
    <div
      class="dashboard-column-3"
    >
      <EDTWidget
        v-if="hasEDTWidget"
        class="widget"
      />
    </div>
  </div>
</template>

<script>
import GroupNewsWidget from '@/components/Dashboard/News/GroupNewsWidget.vue'
import SchoolNewsWidget from '@/components/Dashboard/News/SchoolNewsWidget.vue'
import HomeworkWidget from '@/components/Dashboard/HomeworkWidget.vue'
import EDTWidget from '@/components/Dashboard/EDTWidget.vue'

export default {
  name: 'ProgressionList',
  components: { GroupNewsWidget, SchoolNewsWidget, HomeworkWidget, EDTWidget },
  data () {
    return {
    }
  },
  computed: {
    hasGroupNewsWidget () {
      return this.$store.state.dashboard.hasGroupNewsWidget
    },
    hasSchoolNewsWidget () {
      return this.$store.state.dashboard.hasSchoolNewsWidget
    },
    hasEDTWidget () {
      return this.$store.state.dashboard.hasEDTWidget
    },
    hasHomeworkWidget () {
      return this.$store.state.dashboard.hasHomeworkWidget
    }
  },
  created () {
    // Get user's widget list
    this.$store.dispatch('dashboard/initDashboard')
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

.dashboard-panel {
  display: flex;
  .dashboard-column-1, .dashboard-column-2, .dashboard-column-3 {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin-right: 10px;
  }
  .dashboard-column-1, .dashboard-column-2 {
    width: 42%;
  }
  .dashboard-column-3 {
    width: 15%;
  }
}

</style>

<i18n locale="fr">
{
  "add": "NOUVEAU",
  "filterBy": "Filtrer par :",
  "subject": "Discipline",
  "volee": "Volée",
  "noContentFound": "Aucun contenu existant.",
  "addProgression": "Ajouter votre progression !"
}
</i18n>
