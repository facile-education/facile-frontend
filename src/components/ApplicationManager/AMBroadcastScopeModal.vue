<template>
  <NeroWindow
    :modal="true"
    @close="closeModal"
  >
    <span
      slot="header"
      v-t="'ApplicationManager.AMBroadcastScopeModal.modalTitle'"
    />
    <div
      slot="body"
    >
      <NeroButton
        :label="$t('ApplicationManager.AMBroadcastScopeModal.addRuleButton')"
        class="add"
        @click="addScope"
      />

      <div class="current-rules-list">
        <div
          v-if="!hasRules"
          v-t="'ApplicationManager.AMBroadcastScopeModal.defaultLabel'"
          class="fallback"
        />
        <ul v-else>
          <li
            v-for="(rule, index) in rules"
            :key="rule.ruleId"
          >
            <NeroTagsInput
              :placeholder="$t('ApplicationManager.AMBroadcastScopeModal.rolesPlaceholder')"
            />
            TODO send tags
            <p v-t="'ApplicationManager.AMBroadcastScopeModal'" />
            <NeroTagsInput
              :placeholder="$t('ApplicationManager.AMBroadcastScopeModal.classesPlaceholder')"
            />
            <NeroButton
              cls="cancel"
              icon="fa fa-trash"
              @click="removeSope(index)"
            />
          </li>
        </ul>
      </div>
    </div>
    <NeroButton
      slot="footer"
      :label="$t('ApplicationManager.AMBroadcastScopeModal.updateButton')"
    />
  </NeroWindow>
</template>

<script>
import NeroButton from '@/components/Nero/NeroButton'
import NeroTagsInput from '@/components/Nero/NeroTagsInput'
import NeroWindow from '@/components/Nero/NeroWindow'

export default {
  name: 'AMBroadcastScopeModal',
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
