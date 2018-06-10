<template>
  <NeroWindow
    :modal="true"
    @close="closeModal">
    <span
      v-t="'application-manager.broadcast-modal.modal-title'"
      slot="header"/>
    <div
      slot="body">
      <NeroButton
        :label="$t('application-manager.broadcast-modal.add-rule-button')"
        class="add"
        @click="addScope"/>

      <div class="current-rules-list">
        <div
          v-t="'application-manager.broadcast-modal.default-label'"
          v-if="!hasRules"
          class="fallback"/>
        <ul v-else>
          <li
            v-for="(rule, index) in rules"
            :key="rule.ruleId">
            <NeroTagsInput
              :placeholder="$t('application-manager.broadcast-modal.roles-placeholder')"/>
            TODO send tags
            <p v-t="'application-manager.broadcast-modal'"/>
            <NeroTagsInput
              :placeholder="$t('application-manager.broadcast-modal.classes-placeholder')"/>
            <NeroButton
              cls="cancel"
              icon="fa fa-trash"
              @click="removeSope(index)"/>
          </li>
        </ul>
      </div>
    </div>
    <NeroButton
      slot="footer"
      :label="$t('application-manager.broadcast-modal.update-button')"/>
  </NeroWindow>
</template>

<script>
import NeroButton from '@/components/NeroButton'
import NeroTagsInput from '@/components/NeroTagsInput'
import NeroWindow from '@/components/NeroWindow'

export default {
  name: 'BroadcastScopeModal',
  components: {
    NeroButton,
    NeroTagsInput,
    NeroWindow
  },
  props: {
    rules: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    hasRules () {
      return (this.rules.length > 0)
    }
  },
  methods: {
    closeModal () {
      this.$store.dispatch('closeBroadcastModal')
    },
    addScope () {
      // TODO code
      console.log('Add scope')
    },
    removeScope () {
      // TODO code
      console.log('Remove scope')
    }
  }
}
</script>

<style lang="scss" scoped>
.add {
  margin: auto;
  display: block;
}

.fallback {
  text-align: center;
}
</style>
