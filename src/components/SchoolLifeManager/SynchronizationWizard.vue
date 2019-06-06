<template>
  <div>
    <h3 v-t="'SchoolLifeManager.SynchronizationWizard.title'" />
    <p v-t="'SchoolLifeManager.SynchronizationWizard.informationsLabel'" />
    <p v-t="'SchoolLifeManager.SynchronizationWizard.supportLabel'" />
    <PentilaRadioButton
      v-model="choosenType"
      :name="'type'"
      :label="$t('SchoolLifeManager.SynchronizationWizard.aafRadioButton')"
      rb-value="AAF"
      class="radio"
    />
    <PentilaRadioButton
      v-model="choosenType"
      :name="'type'"
      :label="$t('SchoolLifeManager.SynchronizationWizard.edtRadioButton')"
      rb-value="EDT"
      class="radio"
    />
    <PentilaButton
      :label="$t('SchoolLifeManager.SynchronizationWizard.saveButton')"
      @click="onSave"
    />
  </div>
</template>

<script>
export default {
  name: 'SynchronizationWizard',
  data () {
    return {
      choosenType: ''
    }
  },
  methods: {
    onSave () {
      if (this.choosenType === '') {
        console.log('TODO warn user.')
      } else {
        this.$store.dispatch('schoolLifeManager/updateSynchronizationType', this.choosenType)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.radio {
  display: block;
}
</style>
