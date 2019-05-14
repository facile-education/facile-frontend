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
            id="versionNumber"
            v-model="versionNumber"
            type="text"
            name="versionNumber"
          >
        </div>
        <div>
          {{ $t('InformationWindow.UpdateEditionModal.jsonContent') }} :
          <NeroInput
            v-model="versionDescription"
            cls="required"
          />
        </div>
      </div>
      <div slot="footer">
        <NeroButton
          class="submitButton"
          :type="submit"
          :label="$t('InformationWindow.UpdateEditionModal.buttonSubmitLabel')"
        />
        <NeroButton
          class="cancelButton"
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
      errors: [],
      versionNumber: null,
      versionDescription: null
    }
  },
  methods: {
    checkForm: function (e) { // TODO: maybe use templates to validate forms
      this.errors = []

      if (!this.versionNumber) {
        this.errors.push('versionNumber required.')
      }

      if (!this.errors.length) {
        // do something
        console.log(this.versionNumber)
        return true
      }

      e.preventDefault()
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

.bodyCharter {
  /* TODO change that horrible style */
  background-color: $text-color-menu;
  margin-top: 30px;
}

</style>
