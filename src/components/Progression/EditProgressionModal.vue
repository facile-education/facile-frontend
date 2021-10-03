<template>
  <PentilaWindow
    :modal="true"
    class="editWindow"
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
        <div
          class="subject-volee"
        >
          <PentilaDropdown
            v-if="(subjectList && subjectList.length > 1)"
            v-model="progression.subject"
            :list="subjectList"
            class="subject"
            display-field="name"
            @update:modelValue="onSelectSubject"
          />
          <PentilaDropdown
            v-if="(voleeList && voleeList.length > 1)"
            v-model="progression.volee"
            class="volee"
            :list="voleeList"
          />
        </div>
        <PentilaInput
          v-model="progression.description"
          :placeholder="$t('description')"
          maxlength="75"
        />
      </form>
    </template>

    <template #footer>
      <div
        class="footer"
      >
        <PentilaButton
          :label="$t('cancel')"
          class="button cancel-button"
          @click="closeModal"
        />
        <PentilaButton
          :label="$t('confirm')"
          class="button confirm-button"
          @click="onConfirm"
        />
      </div>
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
.editWindow {
  width: 600px;
}
.subject-volee {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 20px;
  .subject {
    width: 300px;
  }
  .volee {
    width: 200px;
  }
}

.footer {
  display: flex;
  justify-content: space-around;
  .button {
    width: 150px;
  }
}
</style>

<i18n locale="fr">
{
  "cancel": "Annuler",
  "confirm": "Créer",
  "description": "Description",
  "progression": "Progression",
  "subject": "Discipline",
  "volee": "Volée",
  "title": "Titre"
}
</i18n>
