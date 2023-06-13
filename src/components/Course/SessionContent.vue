<template>
  <div class="main">
    <p>Détails de la séance</p>
  </div>
</template>

<script>

import dayjs from 'dayjs'

export default {
  name: 'SessionContent',
  components: {
  },
  inject: ['mq'],
  props: {
    session: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      pan: 0,
      selectedDate: dayjs(),
      selectedEvent: undefined,
      updatedSession: undefined
    }
  },
  computed: {
  },
  created () {
    if (!this.isConfigurationLoaded) {
      this.$store.dispatch('horaires/getConfiguration').then((res) => {
        this.$store.dispatch('course/getSessionList')
      })
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

  .main-label {
    margin-top: 10em;
    text-align: center;
  }

</style>

<i18n locale="fr">
{
  "action": "Editer"
}
</i18n>
