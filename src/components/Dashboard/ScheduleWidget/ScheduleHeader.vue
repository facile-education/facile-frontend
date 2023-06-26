<template>
  <header>
    <h2 :aria-label="$t('schedule')" />

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

      <strong class="date-label theme-text-color">
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

    <button
      class="redirect-button"
      @click="$emit('redirect')"
    >
      <img
        src="@/assets/icons/calendar.svg"
        alt=""
      >
      <span v-t="'redirect'" />
    </button>
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
  emits: ['goBefore', 'goAfter', 'redirect'],
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
  @extend %widget-header;
}

h2 {
  @extend %widget-h2;
}

button:not(.redirect-button){
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FFFFFFDD;
  border-radius: 0;
  padding: 0;
  margin: 0;
  border: none;
}

.date-selector {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.date-label {
  font-size: 1rem;
  font-weight: 700;
  line-height: 24px;
}

.arrow {
  height: 1rem;
}

.arrow.before {
  transform: rotate(180deg);
}

.redirect-button {
  width: 100%;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  padding: 4px 8px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 6px;
  border: 1px solid $color-border;

  img {
    margin-right: 1rem;
  }
}

</style>

<i18n locale="fr">
{
  "goAfter": "Jour suivant",
  "goBefore": "Jour précédent",
  "schedule": "Horaires",
  "redirect": "Accéder au semainier"
}
</i18n>
