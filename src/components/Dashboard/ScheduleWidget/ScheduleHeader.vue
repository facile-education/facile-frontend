<template>
  <header>
    <h2 v-t="'schedule'" />
    <div class="date-selector">
      <button
        :title="$t('goBefore')"
        @click="$emit('goBefore')"
      >
        <img
          class="arrow before"
          src="@assets/arrow-right.svg"
          :alt="$t('goBefore')"
        >
      </button>

      <strong class="date-label">
        {{ formattedDate }}
      </strong>

      <button
        :title="$t('goAfter')"
        @click="$emit('goAfter')"
      >
        <img
          class="arrow after"
          src="@assets/arrow-right.svg"
          :alt="$t('goAfter')"
        >
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'ScheduleHeader',
  props: {
    currentDate: {
      type: Object,
      required: true
    }
  },
  emits: ['goBefore', 'goAfter'],
  computed: {
    formattedDate () {
      return this.currentDate.format('ddd DD/MM')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

header {
  display: flex;
  align-items: center;
  @extend %widget-header;
}

h2 {
  @extend %widget-h2;
}

button {
  cursor: pointer;
  width: 1rem;
  background-color: #FFFFFFDD;
  border-radius: 0;
  padding: 0;
  margin: 0;
  border: none;
}

.date-selector {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}

.date-label {
  margin: 0 1rem;
  height: 100%;
  padding: 0.2rem 1rem;
  border: 1px solid $color-border;
  border-radius: 6px;
  text-transform: capitalize;
}

.arrow {
  height: 1rem;
}

.arrow.before {
  transform: rotate(180deg);
}

</style>

<i18n locale="fr">
{
  "goAfter": "Jour suivant",
  "goBefore": "Jour précédent",
  "schedule": "Horaires"
}
</i18n>
