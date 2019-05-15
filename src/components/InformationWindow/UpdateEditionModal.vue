<template>
  <div>
    <NeroWindow
      :modal="true"
      @close="onClose"
    >
      <span
        slot="header"
        v-t="'InformationWindow.UpdateEditionModal.modalHeaderLabel'"
      />
      <div slot="body">
        <div>
          <label for="versionNumber">{{ $t('InformationWindow.UpdateEditionModal.versionNumber') }} : </label>
          <input
            v-model="versionNumber"
          >
        </div>
        <div>
          {{ $t('InformationWindow.UpdateEditionModal.jsonContent') }} :
          <NeroInput
            v-model="versionDetails"
          />
        </div>
      </div>
      <div slot="footer">
        <NeroButton
          :label="$t('InformationWindow.UpdateEditionModal.buttonSubmitLabel')"
          @click="addVersion"
        />
        <NeroButton
          :label="$t('InformationWindow.UpdateEditionModal.buttonCancelLabel')"
          @click="onClose"
        />
      </div>
    </NeroWindow>
  </div>
</template>

<script>
import NeroWindow from '@/components/Nero/NeroWindow'
import NeroInput from '@/components/Nero/NeroInput'
import NeroButton from '@/components/Nero/NeroButton'

export default {
  name: 'UpdateEditionModal',
  components: {
    NeroWindow,
    NeroInput,
    NeroButton
  },
  data () {
    return {
      versionNumber: null,
      versionDetails: null
    }
  },
  computed: {
    createVersionMessage () {
      return this.$store.state.updates.createVersionMessage
    }
  },
  methods: {
    addVersion () {
      this.$store.dispatch('updates/createVersion', {
        number: this.versionNumber,
        details: this.versionDetails
      })
    },
    onClose () {
      this.$store.dispatch('nero/closeUpdateEditionModal')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.submitPack {
  float: right;
}

</style>
