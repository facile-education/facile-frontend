<template>
  <PentilaWindow
    :modal="true"
    :class="{'mobile': mq.phone}"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'progression'" />
    </template>

    <template #body>
      <form>
        <PentilaInput
          v-model="progression.name"
          :placeholder="$t('title')"
          maxlength="100"
        />
        <!-- <PentilaErrorMessage :error-message="formErrorList.capacity" /> -->
        <PentilaDropdown
          v-if="(subjectList && subjectList.length > 1)"
          v-model="progression.subject"
          :list="subjectList"
          display-field="name"
          @update:modelValue="onSelectSubject"
        />
        <PentilaDropdown
          v-if="(voleeList && voleeList.length > 1)"
          v-model="progression.volee"
          :list="voleeList"
        />
        Max length ?
        <PentilaInput
          v-model="progression.description"
          :placeholder="$t('description')"
          maxlength="75"
        />
      </form>
    </template>

    <template #footer>
      <PentilaButton
        :label="$t('confirm')"
        class="button confirm-button"
        @click="onConfirm"
      />
      <!-- :class="{'form-valid' : !v$.$invalid && !isTimeError}" -->
    </template>
  </PentilaWindow>
</template>

<script>
import PentilaUtils from 'pentila-utils'

export default {
  name: 'EditProgressionModal',
  inject: ['mq'],
  props: {
    updatedProgression: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close'],
  data () {
    return {
      progression: {
        name: '',
        subject: undefined,
        subjectId: 0,
        volee: undefined,
        description: ''
      }
    }
  },
  computed: {
    subjectList () {
      return this.$store.state.progression.subjectList
    },
    voleeList () {
      return this.$store.state.progression.voleeList
    }
  },
  created () {
    if (this.updatedProgression !== undefined) {
      this.progression = PentilaUtils.JSON.deepCopy(this.updatedProgression)
    }
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    onConfirm () {
      if (this.progression.progressionId > 0) {
        // Update
        this.$store.dispatch('progression/updateProgression', this.progression)
      } else {
        // Add progression
        this.$store.dispatch('progression/addProgression', this.progression)
      }
      this.closeModal()
    },
    onSelectSubject (subject) {
      this.progression.subjectId = subject.subjectId
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n locale="fr">
{
  "confirm": "Valider",
  "description": "Description",
  "progression": "Progression",
  "title": "Titre"
}
</i18n>
