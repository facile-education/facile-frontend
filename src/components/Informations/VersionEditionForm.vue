<template>
  <div data-test="editVersion">
    <div>
      <WeprodeInput
        v-model="form.versionNumber"
        data-test="versionNumber-input"
        :placeholder="$t('Informations.VersionEditionForm.versionNumber') + '*'"
        @blur="v$.form.versionNumber.$touch()"
      />
      <WeprodeErrorMessage :error-message="formErrorList.versionNumber" />
    </div>
    <div>
      <WeprodeInput
        v-model="form.versionDetails"
        data-test="versionDetails-input"
        :placeholder="$t('Informations.VersionEditionForm.jsonContent') + '*'"
        @blur="v$.form.versionDetails.$touch()"
      />
      <WeprodeErrorMessage :error-message="formErrorList.versionDetails" />
    </div>
    <WeprodeButton
      data-test="addVersion"
      :label="$t('Informations.VersionEditionForm.addVersionButtonLabel')"
      :title="$t('Informations.VersionEditionForm.addVersionButtonLabel')"
      @click="addVersion"
    />
  </div>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import WeprodeUtils from '@utils/weprode.utils'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'

const isValidJson = (value) => WeprodeUtils.isValidJson(value)
const isVersionNameValid = (str) => {
  try {
    const regex = /[0-9]+.[0-9]+.[0-9]+/gm

    const found = str.match(regex)
    return (found.length === 1 && str === found[0])
  } catch (e) {
    return false
  }
}

const isJsonContentValid = (str) => {
  try {
    const json = JSON.parse(str)
    if (json.news === undefined || json.others === undefined) {
      return false
    }
  } catch (e) {
    return false
  }
  return true
}

export default {
  name: 'VersionEditionForm',
  components: { WeprodeButton, WeprodeErrorMessage, WeprodeInput },
  setup: () => ({ v$: useVuelidate() }),
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
      return this.$store.state.versionNotes.createVersionMessage
    },
    formErrorList () {
      return {
        // Ugly
        versionNumber: (this.v$.form.versionNumber.$invalid && this.v$.form.versionNumber.$dirty)
          ? (this.v$.form.versionNumber.required.$invalid
              ? this.$t('Commons.required')
              : (this.v$.form.versionNumber.isVersionNameValid.$invalid
                  ? this.$t('Informations.VersionEditionForm.invalidVersionName')
                  : ''))
          : '',
        versionDetails: (this.v$.form.versionDetails.$invalid && this.v$.form.versionDetails.$dirty)
          ? (this.v$.form.versionDetails.required.$invalid
              ? this.$t('Commons.required')
              : (this.v$.form.versionDetails.isValidJson.$invalid
                  ? this.$t('Informations.VersionEditionForm.invalidJson')
                  : this.$t('Informations.VersionEditionForm.invalidJsonContent')))
          : ''
      }
    }
  },
  methods: {
    addVersion () {
      if (this.v$.$invalid) { // form checking
        this.v$.$touch()
      } else {
        this.$store.dispatch('versionNotes/createVersion', {
          number: this.form.versionNumber,
          details: this.form.versionDetails
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.submitPack {
  float: right;
}
</style>
