<template>
  <div class="progression-list">
    <div
      v-for="progression in progressionList"
      :key="progression.progressionId"
      class="progression"
    >
      <h4>
        {{ progression.name }}
        <NeroIcon
          name="fa-trash"
          @click="confirmProgressionDeletion(progression)"
        />
      </h4>
      <div>
        {{ progression.imageId }}
        {{ progression.volee }}
        {{ progression.description }}
        {{ progression.subjectId }}
        {{ progression.modifiedDate }}
      </div>
    </div>
  </div>
</template>

<script>
import NeroIcon from '@/components/Nero/NeroIcon'

export default {
  name: 'ProgressionList',
  components: { NeroIcon },
  computed: {
    progressionList () {
      return this.$store.state.progression.progressionList
    }
  },
  created () {
    if (this.progressionList === undefined) {
      this.$store.dispatch('progression/initProgressionList')
    }
  },
  methods: {
    confirmProgressionDeletion (progression) {
      // TODO translation in component
      this.$store.dispatch('warningModal/addWarning', {
        text: 'TODO Text',
        lastAction: { fct: this.deleteProgression, params: [progression] }
      })
    },
    deleteProgression (progression) {
      this.$store.dispatch('progression/deleteProgression', progression)
    }
  }
}
</script>

<style lang="scss" scoped>
.progression-list {
  margin: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  grid-gap: 1rem;
}

.progression {
  border: 1px solid black;

  h4 {
    margin: 0;
    color: white;
    background: darkslategray;
  }

  div {
    padding: 10px;
  }
}
</style>
