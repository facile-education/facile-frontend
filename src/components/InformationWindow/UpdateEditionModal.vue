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
            v-model="form.versionNumber"
            :error-type="formErrorList.versionNumber"
            @blur="$v.form.versionNumber.$touch()"
          >
          <div
            v-if="formErrorList.versionNumber"
            class="error"
          >
            {{ formErrorList.versionNumber }}
          </div>
        </div>
        <div>
          {{ $t('InformationWindow.UpdateEditionModal.jsonContent') }} :
          <NeroInput
            v-model="form.versionDetails"
            :error-type="formErrorList.versionDetails"
            @blur="$v.form.versionDetails.$touch()"
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
import NeroUtils from '@/utils/nero.utils'
import NeroWindow from '@/components/Nero/NeroWindow'
import NeroInput from '@/components/Nero/NeroInput'
import NeroButton from '@/components/Nero/NeroButton'
import informationService from '@/api/information.service'
import { required } from 'vuelidate/lib/validators'
const isValidJson = (value) => NeroUtils.JSON.isValidJson(value)
const isJsonContentValid = (value) => informationService.isJsonContentValid(value)

export default {
  name: 'UpdateEditionModal',
  components: {
    NeroWindow,
    NeroInput,
    NeroButton
  },
  data () {
    return {
      form: {
        versionNumber: '',
        versionDetails: ''
      }
    }
  },

  validations: {
    form: {
      versionNumber: {
        required
      },
      versionDetails: {
        required,
        isValidJson,
        isJsonContentValid
      }
    }
  },

  computed: {
    createVersionMessage () {
      return this.$store.state.information.createVersionMessage
    },
    formErrorList () {
      return {
        versionNumber: (this.$v.form.versionNumber.$invalid && this.$v.form.versionNumber.$dirty) ? 'required' : '',
        versionDetails: (this.$v.form.versionDetails.$invalid && this.$v.form.versionDetails.$dirty)
          ? (!this.$v.form.versionDetails.required
            ? 'required'
            : (!this.$v.form.versionDetails.isValidJson
              ? 'invalidJson'
              : 'invalidJsonContent'))
          : ''
      }
    }
  },

  methods: {
    addVersion () {
      if (this.$v.$invalid) { // form checking
        this.$v.$touch()
      } else {
        this.$store.dispatch('information/createVersion', {
          number: this.form.versionNumber,
          details: this.form.versionDetails
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
