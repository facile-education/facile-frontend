<template>
  <div
    class="switch"
  >
    <div
      class="previous-name"
    >
      <!-- Previous button-->
      <img
        src="/assets/img/previous.png"
        title="Revenir à la liste des progressions"
        class="previous"
        @click="toggleListMode()"
      >

      <!-- Progression name-->
      <div
        class="progression-infos"
      >
        <p
          class="progression-subject"
        >
          {{ progression.subjectName }} - {{ progression.volee }}
        </p>
        <p
          class="progression-name"
        >
          {{ progression.name }}
        </p>
      </div>
    </div>

    <!-- Switch buttons-->
    <div
      class="switch-buttons"
    >
      <div
        class="switch-button"
      >
        <img
          src="@assets/switch-edit.png"
          title="edit"
          class="toggle-button"
          @click="toggleEditMode()"
        >
        <p>Editer la progression</p>
      </div>
      <div
        class="switch-button"
      >
        <img
          src="@assets/switch-assignment.png"
          title="assignment"
          class="toggle-button"
          @click="toggleAssignmentMode()"
        >
        <p>Affecter aux horaires</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProgressionSwitchMode',
  components: { },
  data () {
    return {
    }
  },
  computed: {
    progression () {
      return this.$store.state.progression.currentProgression
    }
  },
  created () {
  },
  methods: {
    toggleListMode () {
      this.$store.dispatch('progression/setListMode', true)
    },
    toggleEditMode () {
      this.$store.dispatch('progression/setEditMode', true)
    },
    toggleAssignmentMode () {
      this.$store.dispatch('progression/setEditMode', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.switch {
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  vertical-align: middle;

  .previous-name {
    display: flex;

    .previous {
      align-content: center;
      width: 20px;
      height: 20px;
      margin: auto;
    }
    .progression-infos {
      margin-left: 20px;
      text-align: center;
    }
  }

  .switch-buttons {
    padding: 5px;
    display: flex;

    .switch-button {
      align-content: center;
      text-align: center;
      padding-left: 20px;
      .toggle-button {
        width: 50px;
        height: 50px;
        padding: 5px;
      }
      p {
        margin: 0;
      }
    }
  }

}
</style>

<i18n locale="fr">
{
  "add": "Créer",
}
</i18n>
