<template>
  <div data-test="editVersion">
    <div>
      <PentilaInput
        v-model="form.versionNumber"
        data-test="versionNumber-input"
        :placeholder="$t('versionNumber') + '*'"
        @blur="v$.form.versionNumber.$touch()"
      />
      <PentilaErrorMessage :error-message="formErrorList.versionNumber" />
    </div>
    <div>
      <PentilaInput
        v-model="form.versionDetails"
        data-test="versionDetails-input"
        :placeholder="$t('jsonContent') + '*'"
        @blur="v$.form.versionDetails.$touch()"
      />
      <PentilaErrorMessage :error-message="formErrorList.versionDetails" />
    </div>
    <PentilaButton
      data-test="addVersion"
      :label="$t('addVersionButtonLabel')"
      :title="$t('addVersionButtonLabel')"
      @click="addVersion"
    />
  </div>
</template>

<script>
import PentilaUtils from 'pentila-utils'
// import informationService from '@/api/information.service'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const isValidJson = (value) => PentilaUtils.JSON.isValidJson(value)
// const isJsonContentValid = (value) => informationService.isJsonContentValid(value)
// const isVersionNameValid = (value) => informationService.isVersionNameValid(value)
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
    console.log(json)
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
      return this.$store.state.information.createVersionMessage
    },
    formErrorList () {
      console.log(this.v$.form.versionNumber.$invalid, this.v$.form.versionNumber.$dirty, this.v$.form.versionNumber.isVersionNameValid.$invalid)
      return {
        // Ugly
        versionNumber: (this.v$.form.versionNumber.$invalid && this.v$.form.versionNumber.$dirty)
          ? (this.v$.form.versionNumber.required.$invalid
              ? this.$t('Commons.required')
              : (this.v$.form.versionNumber.isVersionNameValid.$invalid
                  ? this.$t('invalidVersionName')
                  : ''))
          : '',
        versionDetails: (this.v$.form.versionDetails.$invalid && this.v$.form.versionDetails.$dirty)
          ? (this.v$.form.versionDetails.required.$invalid
              ? this.$t('Commons.required')
              : (this.v$.form.versionDetails.isValidJson.$invalid
                  ? this.$t('invalidJson')
                  : this.$t('invalidJsonContent')))
          : ''
      }
    }
  },
  methods: {
    addVersion () {
      if (this.v$.$invalid) { // form checking
        this.v$.$touch()
      } else {
        this.$store.dispatch('information/createVersion', {
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

<i18n locale="fr">
{
  "addVersionButtonLabel": "Ajouter une version",
  "jsonContent": "Contenu JSON",
  "versionNumber": "Numéro de version",
  "invalidJson": "La structure du json spécifié n'est pas valide",
  "invalidVersionName": "Le numéro de version doit avoir le format suivant X.X.X avec X un nombre",
  "invalidJsonContent": "L'objet Json doit contenir les champs \"news\" et \"others\""
}
</i18n>