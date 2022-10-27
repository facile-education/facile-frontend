<template>
  <PentilaWindow
    :modal="true"
    :is-full-screen="mq.phone"
    data-test="edit-group-modal"
    class="editWindow"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'group'" />
    </template>

    <template #body>
      <div class="group-name">
        <PentilaInput
          ref="name"
          v-model="group.groupName"
          :placeholder="$t('name')"
          :maxlength="75"
          @blur="v$.group.groupName.$touch()"
        />
        <PentilaErrorMessage :error-message="formErrorList.formErrorList" />
      </div>

      <PentilaTextArea
        v-model="group.description"
        :placeholder="$t('description')"
        maxlength="75"
        style="height: 120px;"
        class="description"
      />

      <!--      <div class="group-is-educationnal">-->
      <!--        <span v-t="'isPedagogical'" />-->
      <!--        <PentilaToggleSwitch-->
      <!--          v-model="group.isPedagogical"-->
      <!--          class="partial"-->
      <!--          :title="$t('isPedagogical')"-->
      <!--        />-->
      <!--        <span>{{ $t(group.isPedagogical) }}</span>-->
      <!--      </div>-->
    </template>

    <template #footer>
      <PentilaButton
        form="groupform"
        :label="buttonLabel"
        class="confirm-button"
        :disabled="v$.$invalid"
        @click="onConfirm"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { nextTick } from 'vue'
// import ColorPicker from '@/components/Nero/ColorPicker'

export default {
  name: 'EditGroupModal',
  // components: { ColorPicker },
  inject: ['mq'],
  props: {
    editedGroup: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    group: {
      groupName: { required }
    }
  },
  data () {
    return {
      group: {
        groupName: '',
        color: '',
        subject: undefined,
        subjectId: 0,
        volee: undefined,
        description: '',
        isPedagogical: false
      }
    }
  },
  computed: {
    formErrorList () {
      const form = this.v$.group.groupName
      if (form.$invalid && form.$dirty) {
        if (form.$errors[0].$validator === 'required') {
          return this.$t('Commons.required')
        } else {
          console.error('Unknown validation error')
          return ''
        }
      } else {
        return ''
      }
    },
    buttonLabel () {
      return this.editedGroup ? this.$t('edit') : this.$t('create')
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')

    if (this.editedGroup !== undefined) {
      this.group = { ...this.editedGroup }
    }
    nextTick(() => this.$refs.name.$el.childNodes[0].focus())
  },
  methods: {
    onConfirm (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.submitChanges()
      }
    },
    submitChanges () {
      if (this.group.groupId > 0) {
        // Update
        this.$store.dispatch('groups/updateGroup', this.group)
      } else {
        // Creation
        this.$store.dispatch('groups/createGroup', this.group)
      }
      this.closeModal()
    },
    closeModal () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
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
  "description": "Description",
  "edit": "Modifier",
  "false": "Non",
  "group": "Groupe",
  "isPedagogical": "Espace à vocation pédagogique",
  "name": "Nom du groupe",
  "true": "Oui"
}
</i18n>
