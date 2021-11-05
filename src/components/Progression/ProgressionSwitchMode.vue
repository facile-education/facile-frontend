<template>
  <div
    class="switch"
  >
    <div
      class="previous-name"
      @click="toggleListMode"
    >
      <!-- Previous button-->
      <img
        src="@assets/arrow-left.svg"
        title="Revenir à la liste des progressions"
        class="previous"
        alt=""
      >

      <!-- Progression name-->
      <div
        class="progression-infos"
      >
        <span
          class="progression-subject"
        >
          {{ progression.subjectName }} - {{ progression.volee }}
        </span>
        <span
          class="progression-name"
        >
          {{ progression.name }}
        </span>
      </div>
    </div>

    <!-- Switch buttons-->
    <div
      class="switch-buttons"
    >
      <div
        class="switch-button"
        @click="toggleEditMode()"
      >
        <img
          src="@assets/icon_edit-progression.svg"
          title="edit"
          class="toggle-button"
          alt=""
        >
        <p>Editer la progression</p>
        <div
          v-if="isEditMode"
          class="active-line"
        />
      </div>
      <div
        class="switch-button"
        @click="toggleAssignmentMode()"
      >
        <img
          src="@assets/calendar.svg"
          title="assignment"
          class="toggle-button"
          alt=""
        >
        <p>Affecter aux horaires</p>
        <div
          v-if="!isEditMode"
          class="active-line"
        />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProgressionSwitchMode',
  computed: {
    progression () {
      return this.$store.state.progression.currentProgression
    },
    isEditMode () {
      return this.$store.state.progression.isEditMode
    }
  },
  created () {
  },
  methods: {
    toggleListMode () {
      this.$router.push({ name: 'Progression' })
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
    cursor: pointer;

    .previous {
      align-content: center;
      width: 20px;
      height: 20px;
      margin: auto;
    }
    .progression-infos {
      height: 55px;
      margin: auto auto auto 20px;
      display: grid;
      .progression-subject {
        height: 15px;
        font-weight: lighter;
        color: #838383;
        font-size: 0.875rem;
      }
      .progression-name {
        height: 25px;
        font-weight: bold;
        color: #000000;
        font-size: 1.25rem;
      }
    }
  }

  .switch-buttons {
    padding: 5px;
    display: flex;

    .switch-button {
      align-content: center;
      text-align: center;
      padding-left: 20px;
      &:hover {
        cursor: pointer;
      }
      .toggle-button {
        width: 50px;
        height: 43px;
        padding: 5px;
      }
      p {
        margin: 0;
        padding-bottom: 5px;
        font-size: 0.875rem;
      }
      .active-line {
        float: bottom;
        height: 3px;
        width: 140px;
        background-color: #306CD3;
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
