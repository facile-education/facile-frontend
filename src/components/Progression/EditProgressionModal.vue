<template>
  <PentilaWindow
    :modal="true"
    class="editWindow"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'progression'" />
    </template>

    <template #body>
      <form id="progressionform">
        <div class="title-color">
          <PentilaInput
            ref="title"
            v-model="progression.name"
            :placeholder="$t('title')"
            maxlength="75"
            @blur="v$.progression.name.$touch()"
          />
          <PentilaErrorMessage :error-message="formErrorList.name" />
          <ColorPicker v-model="progression.color" />
        </div>
        <div class="subject-volee">
          <PentilaDropdown
            v-if="(subjectList && subjectList.length > 1)"
            v-model="progression.subject"
            :list="subjectList"
            :sort="false"
            class="subject"
            display-field="name"
            @update:modelValue="onSelectSubject"
          />
          <PentilaErrorMessage :error-message="formErrorList.subject" />
          <PentilaDropdown
            v-if="(voleeList && voleeList.length > 1)"
            v-model="progression.volee"
            class="volee"
            :list="voleeList"
            :sort="false"
          />
          <PentilaErrorMessage
            class="volee-error"
            :error-message="formErrorList.volee"
          />
        </div>
        <PentilaTextArea
          v-model="progression.description"
          :placeholder="$t('description')"
          maxlength="75"
          style="height: 120px;"
          class="description"
        />
      </form>
    </template>

    <template #footer>
      <PentilaButton
        form="progressionform"
        :label="buttonLabel"
        class="confirm-button"
        :class="{'disabled' : v$.$invalid}"
        @click="onConfirm"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { nextTick } from 'vue'
import PentilaUtils from 'pentila-utils'
import ColorPicker from '@/components/Nero/ColorPicker'

const subjectRequired = (value, vm) => {
  return value.subjectId > 0
}

// vm does not seem to give use access to i18n
let component
const voleeRequired = (value, vm) => {
  return value !== component.$t('volee')
}

export default {
  name: 'EditProgressionModal',
  components: { ColorPicker },
  inject: ['mq'],
  props: {
    updatedProgression: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    progression: {
      name: { required },
      subject: { subjectRequired },
      volee: { voleeRequired }
    }
  },
  data () {
    return {
      progression: {
        name: '',
        color: '',
        subject: undefined,
        subjectId: 0,
        volee: undefined,
        description: ''
      }
    }
  },
  computed: {
    formErrorList () {
      const form = this.v$.progression
      return {
        name: (form.name.$invalid && form.name.$dirty) ? this.$t('Commons.required') : '',
        subject: (form.subject.$invalid && form.subject.$dirty) ? this.$t('Commons.required') : '',
        volee: (form.volee.$invalid && form.volee.$dirty) ? this.$t('Commons.required') : ''
      }
    },
    subjectList () {
      if (this.$store.state.progression.subjectList) {
        const defaultSubject = {
          subjectId: 0,
          name: this.$t('subject')
        }
        return [
          defaultSubject,
          ...PentilaUtils.Array.sortWithString(this.$store.state.progression.subjectList, false, 'name')
        ]
      }
      return []
    },
    voleeList () {
      if (this.$store.state.progression.voleeList) {
        return [this.$t('volee'), ...this.$store.state.progression.voleeList]
      }
      return []
    },
    buttonLabel () {
      if (this.updatedProgression !== undefined) {
        return this.$t('edit')
      } else {
        return this.$t('create')
      }
    }
  },
  created () {
    component = this
    if (this.updatedProgression !== undefined) {
      this.progression = PentilaUtils.JSON.deepCopy(this.updatedProgression)
      this.progression.subject = {
        subjectId: this.updatedProgression.subjectId,
        name: this.updatedProgression.subjectName
      }
    }
    nextTick(() => this.$refs.title.$el.childNodes[0].focus())
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    onConfirm (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.submitChanges()
      }
    },
    onSelectSubject (subject) {
      this.progression.subjectId = subject.subjectId
      this.progression.subjectName = subject.name
    },
    submitChanges () {
      if (this.progression.progressionId > 0) {
        // Update
        this.$store.dispatch('progression/updateProgression', this.progression)
      } else {
        // Add progression
        this.$store.dispatch('progression/addProgression', this.progression)
      }
      this.closeModal()
    }
  }
}
</script>

<style lang="scss" scoped>
.title-color {
  display: flex;
  justify-content: space-between;
  position: relative;

  .group {
    flex-grow: 1;
    margin-right: 10px;
  }

  .error-message {
    position: absolute;
    top: 46px;
  }
}

.subject-volee {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 20px;
  position: relative;

  .subject {
    width: 260px;
  }
  .volee {
    width: 160px;
  }

  .error-message {
    position: absolute;
    top: 46px;
  }
  .volee-error {
    left: 290px;
  }
}

.description {
  width: 100%;
}

.confirm-button {
  width: 130px;
}
</style>

<i18n locale="fr">
{
  "create": "Créer",
  "edit": "Modifier",
  "description": "Description",
  "progression": "Progression",
  "subject": "Discipline",
  "volee": "Volée",
  "title": "Titre"
}
</i18n>
