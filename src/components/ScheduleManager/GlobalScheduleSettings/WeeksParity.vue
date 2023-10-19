<template>
  <section>
    <header>
      <h2 v-t="'weekParity'" />
      <InformationIcon
        class="info"
        :text="$t('weekParityInfos')"
      />
    </header>
    <WeprodeInput
      class="week-input"
      :model-value="h1Weeks"
      :placeholder="$t('h1WeeksPlaceholder')"
      @update:model-value="$emit('update:h1Weeks', $event)"
    />
    <WeprodeInput
      class="week-input"
      :model-value="h2Weeks"
      :placeholder="$t('h2WeeksPlaceholder')"
      @update:model-value="$emit('update:h2Weeks', $event)"
    />
  </section>
</template>

<script>
import InformationIcon from '@components/Base/InformationIcon.vue'

export default {
  name: 'WeeksParity',
  components: { InformationIcon },
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
header {
  display: flex;
  align-items: center;

  .info {
    margin-left: 1rem;
  }
}

.week-input {
  margin-bottom: 1rem;
}
</style>

<i18n locale="fr">
{
  "weekParity": "Parité des semaines",
  "weekParityInfos": "Le formattage des champs est sous la forme: \"[Numérosemaine],[Numérosemaine], [...], [Numérosemaine]\", par exemple: \"1,3,5\"",
  "h1WeeksPlaceholder": "Semaines catégorisées \"H1\"",
  "h2WeeksPlaceholder": "Semaines catégorisées \"H2\""
}
</i18n>
