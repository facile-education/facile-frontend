<template>
  <PentilaWindow
    :modal="true"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'teacherManagement'" />
    </template>

    <template #body>
      <form id="teacherform">
        <div><span>Séance du ../../.. de ..:.. à ..:..</span></div>
        <div>
          <span>Maître(s) : {{ sessionEvent.extendedProps.teachers }}</span>
        </div>
        <span>Ajouter un Remplaçant :</span>
        <PentilaCheckbox
          v-model="replaceSlotOnly"
          :title="$t('NotUsualSlots.StudentListModal.present')"
          :label="`Appliquer le remplacement pour toute les séances de ${sessionEvent.title}`"
        />
        <span>Jusqu'à</span>
        <PentilaDropdown
          v-if="sessionList.length > 0"
          v-model="targetSession"
          :list="sessionList"
        />
      </form>
    </template>

    <template #footer>
      <PentilaButton
        form="teacherform"
        :label="$t('confirm')"
        @click="onConfirm"
      />
    </template>
  </PentilaWindow>
</template>

<script>
// TODO Get teachers details for the selected session + refresh after save
// JSON Struct send to back ?
export default {
  name: 'SessionTeacherModal',
  inject: ['mq'],
  props: {
    sessionEvent: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      replaceSlotOnly: false,
      targetSession: {}
    }
  },
  computed: {
    sessionList () {
      return []
    }
  },
  created () {
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    onConfirm (e) {
      e.preventDefault()

      this.closeModal()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n locale="fr">
{
  "confirm": "Valider",
  "teacherManagement": "Gérer les maîtres du cours"
}
</i18n>
