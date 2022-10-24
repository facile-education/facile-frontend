<template>
  <PentilaWindow
    :modal="true"
    data-test="edit-group-modal"
    class="editWindow"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'group'" />
    </template>

    <template #body>
      <form id="groupform">
        <div class="group-name">
          <PentilaInput
            ref="name"
            v-model="group.name"
            :placeholder="$t('title')"
            maxlength="75"
            @blur="v$.group.name.$touch()"
          />
          <PentilaErrorMessage :error-message="formErrorList.groupName" />
          <ColorPicker v-model="progression.color" />
        </div>
        <PentilaTextArea
          v-model="group.description"
          :placeholder="$t('description')"
          maxlength="75"
          style="height: 120px;"
          class="description"
        />
      </form>
    </template>

    <template #footer>
      <PentilaButton
        form="groupform"
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

export default {
  name: 'EditGroupModal',
  components: { ColorPicker },
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
      name: { required }
    }
  },
  data () {
    return {
      group: {
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
        name: (form.name.$invalid && form.name.$dirty) ? this.$t('Commons.required') : ''
      }
    },
    buttonLabel () {
      if (this.editedGroup !== undefined) {
        return this.$t('edit')
      } else {
        return this.$t('create')
      }
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')

    if (this.editedGroup !== undefined) {
      this.group = PentilaUtils.JSON.deepCopy(this.editedGroup)
    }
    nextTick(() => this.$refs.title.$el.childNodes[0].focus())
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
  "edit": "Modifier",
  "description": "Description",
  "name": "Nom du groupe"
}
</i18n>
