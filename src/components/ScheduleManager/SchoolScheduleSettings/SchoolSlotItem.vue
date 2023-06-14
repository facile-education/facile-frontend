<template>
  <div class="school-slot">
    <h3> {{ 'P' + slot.slotNumber }}</h3>
    <span> {{ slot.slotStartHour }}</span>
    <span> {{ slot.slotEndHour }}</span>
    <PentilaButton
      v-t="'delete'"
      @click="$emit('delete')"
    />
  </div>
</template>

<script>
export default {
  name: 'SchoolSlotItem',
  props: {
    slot: {
      type: Object,
      required: true
    }
  },
  emits: ['delete']
}
</script>

<style lang="scss" scoped>
.school-slot{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

<i18n locale="fr">
{
  "delete": "Supprimer"
}
</i18n>
