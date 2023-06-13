<template>
  <div class="holiday">
    <h3 :title="holiday.name">
      {{ holiday.name }}
    </h3>
    <span class="start-date">
      {{ $t('startDate') }}
      <strong>{{ holiday.startDate }}</strong>
    </span>
    <span class="end-date">
      {{ $t('endDate') }}
      <strong>{{ holiday.endDate }}</strong>
    </span>

    <PentilaButton
      v-t="'delete'"
      @click="$emit('delete')"
    />
  </div>
</template>

<script>
export default {
  name: 'HolidayItem',
  props: {
    holiday: {
      type: Object,
      required: true
    }
  },
  emits: ['delete']
}
</script>

<style lang="scss" scoped>
.holiday {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h3 {
  width: 250px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>

<i18n locale="fr">
{
  "startDate": "Date de début: ",
  "endDate": "Date de fin: ",
  "delete": "Supprimer"
}
</i18n>
