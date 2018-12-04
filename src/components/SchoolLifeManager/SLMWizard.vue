<template>
  <div>
    <h3 v-t="'SchoolLifeManager.SLMWizard.title'" />
    <p v-t="'SchoolLifeManager.SLMWizard.informationsLabel'" />
    <p v-t="'SchoolLifeManager.SLMWizard.supportLabel'" />
    <NeroRadioButton
      v-model="choosenType"
      :name="'type'"
      :label="$t('SchoolLifeManager.SLMWizard.aafRadioButton')"
      rb-value="AAF"
      class="radio"
    />
    <NeroRadioButton
      v-model="choosenType"
      :name="'type'"
      :label="$t('SchoolLifeManager.SLMWizard.edtRadioButton')"
      rb-value="EDT"
      class="radio"
    />
    <NeroButton
      :label="$t('SchoolLifeManager.SLMWizard.saveButton')"
      @click="onSave"
    />
  </div>
</template>

<script>
import NeroButton from '@/components/NeroButton'
import NeroRadioButton from '@/components/NeroRadioButton'

export default {
  name: 'SLMWizard',
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
