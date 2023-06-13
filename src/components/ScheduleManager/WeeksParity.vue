<template>
  <section>
    <h2 v-t="'weekParity'" />
    <PentilaInput
      class="week-input"
      :model-value="h1Weeks"
      :placeholder="$t('h1WeeksPlaceholder')"
      @update:model-value="$emit('update:h1Weeks', $event)"
    />
    <PentilaInput
      class="week-input"
      :model-value="h2Weeks"
      :placeholder="$t('h2WeeksPlaceholder')"
      @update:model-value="$emit('update:h2Weeks', $event)"
    />
  </section>
</template>

<script>
export default {
  name: 'WeeksParity',
  props: {
    h1Weeks: {
      type: String,
      required: true
    },
    h2Weeks: {
      type: String,
      required: true
    }
  },
  emits: ['update:h1Weeks', 'update:h2Weeks']
}
</script>

<style lang="scss" scoped>
.week-input {
  margin-bottom: 1rem;
}
</style>

<i18n locale="fr">
{
  "weekParity": "Parité des semaines",
  "h1WeeksPlaceholder": "Semaines catégorisées \"H1\"",
  "h2WeeksPlaceholder": "Semaines catégorisées \"H2\""
}
</i18n>
