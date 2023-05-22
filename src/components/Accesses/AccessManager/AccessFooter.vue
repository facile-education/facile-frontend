<template>
  <footer>
    <div class="buttons">
      <PentilaButton
        data-test="resetButton"
        class="button"
        cls="cancel"
        :label="$t('reset')"
        :disabled="!haveChanges"
        @click="confirmReset"
      />
      <PentilaButton
        data-test="submitButton"
        class="button theme-background-color"
        cls="submit"
        :label="$t('submit')"
        @click="$emit('submit')"
      />
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AccessFooter',
  emits: ['submit', 'reset'],
  computed: {
    initialCategoryList () {
      return this.$store.state.accessManager.initialCategoryList
    },
    categoryList () {
      return this.$store.state.accessManager.categoryList
    },
    haveChanges () {
      return this.$store.getters['accessManager/haveChanges']
    }
  },
  methods: {
    confirmReset () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('confirmReset'),
        lastAction: { fct: this.reset, params: [] }
      })
    },
    reset () {
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss" scoped>

footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.buttons {
  display: flex;
}

.button {
  margin-left: 1rem;
}

</style>

<i18n locale="fr">
{
  "confirmReset": "En effectuant cette action vous allez perdre vos modifications",
  "reset": "Annuler",
  "submit": "Publier"
}
</i18n>
