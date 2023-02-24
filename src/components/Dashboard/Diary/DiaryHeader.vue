<template>
  <div class="header">
    <div class="left">
      <h2 v-t="'diary'" />
      <Pellet
        v-if="nbNewEvents > 0"
        :count="nbNewEvents"
        :show-count="true"
      />
    </div>
    <DashboardCreateButton
      v-if="canCreateDiaryEvent"
      @click="createDiaryEvent"
    />
  </div>
</template>

<script>
import Pellet from '@components/Base/Pellet.vue'
import DashboardCreateButton from '@components/Dashboard/DashboardCreateButton.vue'

export default {
  name: 'DiaryHeader',
  components: { DashboardCreateButton, Pellet },
  props: {
    nbNewEvents: {
      type: Number,
      default: 0
    }
  },
  computed: {
    canCreateDiaryEvent () { // TODO: match correct roles specified in specification
      // return this.$store.state.user.isAdministrator
      return true
    }
  },
  methods: {
    createDiaryEvent () {
      // TODO
      console.log('open creation modal')
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
}
</style>

<i18n locale="fr">
{
  "diary": "Agenda"
}
</i18n>
