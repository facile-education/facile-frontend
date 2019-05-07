<template>
  <div>
    <h3 v-t="'SchoolLifeManager.SynchronizationWizard.title'" />
    <p v-t="'SchoolLifeManager.SynchronizationWizard.informationsLabel'" />
    <p v-t="'SchoolLifeManager.SynchronizationWizard.supportLabel'" />
    <NeroRadioButton
      v-model="choosenType"
      :name="'type'"
      :label="$t('SchoolLifeManager.SynchronizationWizard.aafRadioButton')"
      rb-value="AAF"
      class="radio"
    />
    <NeroRadioButton
      v-model="choosenType"
      :name="'type'"
      :label="$t('SchoolLifeManager.SynchronizationWizard.edtRadioButton')"
      rb-value="EDT"
      class="radio"
    />
    <NeroButton
      :label="$t('SchoolLifeManager.SynchronizationWizard.saveButton')"
      @click="onSave"
    />
  </div>
</template>

<script>
import NeroButton from '@/components/Nero/NeroButton'
import NeroRadioButton from '@/components/Nero/NeroRadioButton'

export default {
  name: 'SynchronizationWizard',
  components: {
    NeroButton,
    NeroRadioButton
  },
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
