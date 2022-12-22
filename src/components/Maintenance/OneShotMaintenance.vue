<template>
  <div class="param-header">
    <PentilaButton
      class="round"
      @click="runMessageMigration"
    >
      <span>{{ $t('message-migration') }}</span>
    </PentilaButton>
  </div>
</template>

<script>

import { runMessageMigration } from '@/api/maintenance.service'

export default {
  name: 'OneShotMaintenance',
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    runMessageMigration () {
      runMessageMigration().then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.param-header {
  display: flex;
  flex-direction: column;
  .button {
    margin-left: 10px;
    margin-top: 10px;
    width: 280px;
  }
}
</style>

<i18n locale="fr">
{
  "message-migration": "Migration des messages (3.0.9)"
}
</i18n>
