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
            :error-type="formErrorList.versionDetails"
            @blur="$v.versionDetails.$touch()"
          >
          <div
            v-if="formErrorList.versionDetails"
            class="error"
          >
            {{ formErrorList.versionDetails }}
          </div>
        </div>
        <div>
          {{ $t('InformationWindow.UpdateEditionModal.jsonContent') }} :
          <NeroInput
            v-model="versionDetails"
            :error-type="formErrorList.versionDetails"
            @blur="$v.versionDetails.$touch()"
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

import { required } from 'vuelidate/lib/validators'

export default {
  name: 'UpdateEditionModal',
  components: {
    NeroWindow,
    NeroInput,
    NeroButton
  },
  data () {
    return {
      versionNumber: undefined,
      versionDetails: undefined
    }
  },
  validations: {
    versionNumber: {
      required
    },
    versionDetails: {
      required
    }
  },
  computed: {
    createVersionMessage () {
      return this.$store.state.information.createVersionMessage
    },
    formErrorList () {
      var form = this.$v
      return {
        versionNumber: (form.versionNumber.$invalid && form.versionNumber.$dirty) ? 'required' : '',
        versionDetails: (form.versionDetails.$invalid && form.versionDetails.$dirty) ? 'required' : ''
      }
    }
  },
  methods: {
    addVersion () {
      if (this.$v.$invalid) { // form checking
        this.$v.$touch()
        console.log('ERROR')
      } else {
        this.$store.dispatch('information/createVersion', {
          number: this.application.versionNumber,
          details: this.application.versionDetails
        })
      }
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
