<template>
  <div data-test="editVersion">
    <PentilaWindow
      :modal="true"
      @close="onClose"
    >
      <span
        slot="header"
        v-t="'InformationWindow.VersionEditionModal.modalHeaderLabel'"
      />
      <div slot="body">
        <div>
          <PentilaInput
            v-model="form.versionNumber"
            data-test="versionNumber-input"
            :error-message="formErrorList.versionNumber"
            :placeholder="$t('InformationWindow.VersionEditionModal.versionNumber') + '*'"
            @blur="$v.form.versionNumber.$touch()"
          />
        </div>
        <div>
          <PentilaInput
            v-model="form.versionDetails"
            data-test="versionDetails-input"
            :error-message="formErrorList.versionDetails"
            :placeholder="$t('InformationWindow.VersionEditionModal.jsonContent') + '*'"
            @blur="$v.form.versionDetails.$touch()"
          />
        </div>
      </div>
      <div slot="footer">
        <PentilaButton
          data-test="addVersion"
          :label="$t('InformationWindow.VersionEditionModal.submitButtonLabel')"
          @click="addVersion"
        />
      </div>
    </PentilaWindow>
  </div>
</template>

<script>
import NeroUtils from '@/utils/nero.utils'
import informationService from '@/api/information.service'
import { required } from 'vuelidate/lib/validators'

const isValidJson = (value) => NeroUtils.JSON.isValidJson(value)
const isJsonContentValid = (value) => informationService.isJsonContentValid(value)
const isVersionNameValid = (value) => informationService.isVersionNameValid(value)

export default {
  name: 'VersionEditionModal',
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
        required,
        isVersionNameValid
      },
      versionDetails: {
        required,
        isValidJson,
        isJsonContentValid // /!\ doesn't check if "news" field is an array and if "other" is a string
      }
    }
  },

  computed: {
    createVersionMessage () {
      return this.$store.state.information.createVersionMessage
    },
    formErrorList () {
      return {
        // Ugly
        versionNumber: (this.$v.form.versionNumber.$invalid && this.$v.form.versionNumber.$dirty)
          ? (!this.$v.form.versionNumber.required
            ? this.$t('Nero.formErrorMessage.required')
            : (!this.$v.form.versionNumber.isVersionNameValid
              ? this.$t('Nero.formErrorMessage.invalidVersionName')
              : ''))
          : '',
        versionDetails: (this.$v.form.versionDetails.$invalid && this.$v.form.versionDetails.$dirty)
          ? (!this.$v.form.versionDetails.required
            ? this.$t('Nero.formErrorMessage.required')
            : (!this.$v.form.versionDetails.isValidJson
              ? this.$t('Nero.formErrorMessage.invalidJson')
              : this.$t('Nero.formErrorMessage.VersionEditionInvalidJsonContent')))
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
      this.$store.dispatch('nero/closeVersionEditionModal')
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
