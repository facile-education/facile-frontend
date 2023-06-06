<template>
  <div
    data-test="progression-item"
    class="progression"
    @click="selectProgression()"
  >
    <div
      class="header"
      :style="`background-color:${progression.color};`"
    >
      <span>{{ progression.subjectName }} {{ progression.volee }}</span>
    </div>
    <div class="body">
      <h3>{{ progression.name }}</h3>
    </div>
    <div class="buttons">
      <img
        class="button"
        src="@assets/edit.svg"
        data-test="edit-progression-icon"
        :alt="$t('edit')"
        :title="$t('edit')"
        @click.stop="editProgression()"
      >
      <!-- <img
        class="button"
        src="@assets/duplicate.svg"
        :alt="$t('duplicate')"
        :title="$t('duplicate')"
        @click="duplicate()"
      >
      <img
        class="button"
        src="@assets/share.svg"
        :alt="$t('share')"
        :title="$t('share')"
        @click="toggleShareModalDisplay()"
      > -->
      <img
        class="button"
        src="@assets/trash.svg"
        data-test="delete-progression-icon"
        :alt="$t('delete')"
        :title="$t('delete')"
        @click.stop="confirmProgressionDeletion()"
      >
    </div>
  </div>
</template>

<script>
import { PROGRESSION } from '@/constants/appConstants'

export default {
  name: 'ProgressionItem',
  props: {
    progression: {
      type: Object,
      required: true
    }
  },
  emits: ['edit'],
  methods: {
    confirmProgressionDeletion () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('warning'),
        lastAction: { fct: this.deleteProgression, params: [this.progression] }
      })
    },
    deleteProgression () {
      this.$store.dispatch('progression/deleteProgression', this.progression)
    },
    editProgression () {
      this.$emit('edit', this.progression)
    },
    selectProgression () {
      this.$router.push({ name: PROGRESSION, params: { progressionId: this.progression.progressionId } })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.progression {
  display: flex;
  flex-direction: column;
  height: 235px;
  max-height: 235px;
  width: 235px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    border: 1px solid grey;
    cursor: pointer;
  }
}

.header {
  margin: 0;
  padding: 20px 15px;
  color: $color-light-text;
}

.body {
  padding: 10px 15px;
}

.buttons {
  margin-top: auto;
  padding: 0 15px;
  text-align: right;

  .button {
    border: 1px solid transparent;
    border-radius: 5px;
    padding: 5px;
    margin: 0 0 5px 5px;

    &:hover {
      border: 1px solid grey;
      cursor: pointer;
    }
  }
}
</style>

<i18n locale="fr">
{
  "warning": "La suppression de cette progression est définitive.",
  "edit": "Modifier",
  "share": "Partager",
  "duplicate": "Dupliquer",
  "delete": "Supprimer"
}
</i18n>
