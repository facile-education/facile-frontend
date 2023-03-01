<template>
  <div class="header">
    <div class="left">
      <h2 v-t="'diary'" />
      <Pellet
        v-if="nbNewEvents > 0"
        class="pellet"
        :count="nbNewEvents"
        :show-count="true"
      />
    </div>
    <DashboardCreateButton
      v-if="canCreateDiaryEvent"
      @click="isCreateModalDisplayed = true"
    />
  </div>

  <teleport
    v-if="isCreateModalDisplayed"
    to="body"
  >
    <SaveDiaryEventModal
      @createEvent="createEvent"
      @close="isCreateModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import Pellet from '@components/Base/Pellet.vue'
import DashboardCreateButton from '@components/Dashboard/DashboardCreateButton.vue'
import SaveDiaryEventModal from '@components/Dashboard/Diary/SaveDiaryEventModal.vue'

export default {
  name: 'DiaryHeader',
  components: { SaveDiaryEventModal, DashboardCreateButton, Pellet },
  props: {
    nbNewEvents: {
      type: Number,
      default: 0
    }
  },
  emits: ['createEvent'],
  data () {
    return {
      isCreateModalDisplayed: false
    }
  },
  computed: {
    canCreateDiaryEvent () { // TODO: match correct roles specified in specification
      // return this.$store.state.user.isAdministrator
      return true
    }
  },
  methods: {
    createEvent () {
      this.$emit('createEvent')
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    display: flex;
    align-items: center;
  }

  h2{
    font-weight: normal;
    margin: 0.3em 0;
  }
}

.pellet {
  margin-left: 10px;
  height: 19px;
  width: 19px;
}

</style>

<i18n locale="fr">
{
  "diary": "Agenda"
}
</i18n>
