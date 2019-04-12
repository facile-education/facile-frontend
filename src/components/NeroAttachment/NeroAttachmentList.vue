<template>
  <div v-if="displayAttachmentFieldSet">
    <!-- Fieldset header -->
    <div
      class="header"
      @click="toggleBodyDisplay"
    >
      <i
        :class="{'fa fa-caret-right': !unfolded, 'fa fa-caret-down': unfolded}"
        class="theme-text-color"
      />
      <p v-t="'NeroAttachment.NeroAttachmentList.attachmentTitle'" />
      <span class="badge theme-background-color">
        {{ resourceList.length }}
      </span>

      <div
        v-if="!readOnly"
        class="actions"
      >
        <p v-t="'NeroAttachment.NeroAttachmentList.addResourceLabel'" />

        <NeroButton
          :title="$t('NeroAttachment.NeroAttachmentList.addAttachmentButtonTooltip')"
          type="circle"
          icon="fa fa-paperclip"
          @click="openFilePickerWindow"
        />

        <!-- NeroButton
          :title="$t('NeroAttachment.NeroAttachmentList.addAudioRecordingButtonTooltip')"
          type="circle"
          icon="fa fa-microphone"
          @click="openAudioRecorderWindow"
        /-->

        <!-- TODO EDX Icon -->
        <NeroButton
          v-if="displayEdx"
          :title="$t('NeroAttachment.NeroAttachmentList.addEdxAssignmentButtonTooltip')"
          type="circle"
          icon="fa fa-book"
          @click="openEdxWindow"
        />
      </div>
    </div>

    <!-- Fieldset body -->
    <div
      v-show="unfolded"
      class="list"
    >
      <NeroAttachmentItem
        v-for="resource in resourceList"
        :key="resource.id"
        :attachment="resource"
        :all-actions-on-edit="allActionsOnEdit"
        :id-properties="idProperties"
        :read-only="readOnly"
        @remove="removeAttachment"
      />
    </div>
  </div>
</template>

<script>
import NeroAttachmentItem from '@/components/NeroAttachment/NeroAttachmentItem'
import NeroButton from '@/components/Nero/NeroButton'

export default {
  name: 'NeroAttachmentList',
  components: {
    NeroAttachmentItem,
    NeroButton
  },
  props: {
    allActionsOnEdit: {
      type: Boolean,
      default: false
    },
    attachmentList: {
      type: Array,
      required: true
    },
    displayEdx: {
      type: Boolean,
      default: false
    },
    edxAssignementList: {
      type: Array,
      default: () => []
    },
    idProperties: {
      type: Object,
      default: () => {}
    },
    readOnly: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      unfolded: true
    }
  },
  computed: {
    displayAttachmentFieldSet () {
      return (this.resourceList.length > 0 || !this.readOnly)
    },
    resourceList () {
      return this.attachmentList.concat(this.edxAssignementList)
    }
  },
  methods: {
    addAttachment () {
      this.$emit('add')
    },
    openEdxWindow () {
      console.log('open edx window')
    },
    openFilePickerWindow () {
      console.log('open file picker')
    },
    removeAttachment () {
      console.log('remove attachment')
      this.$emit('remove')
    },
    toggleBodyDisplay () {
      this.unfolded = !this.unfolded
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
}

.fa-caret-down,
.fa-caret-right {
  margin-right: 5px;
}

.badge {
  margin-left: 5px;
  padding: 3px 7px;
  border-radius: 10px;
}

.actions {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.list {
  display: flex;
  flex-wrap: wrap;
}
</style>
