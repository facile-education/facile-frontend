<template>
  <EmptyLayout>
    <div class="center">
      <p v-t="'you-should-accept'" />
      <div
        data-test="terms-of-use"
        class="chart"
        v-html="template"
      />
      <div class="buttons">
        <PentilaButton
          v-t="'accept'"
          @click="acceptTermsOfUse()"
        />
        <PentilaButton
          v-t="'decline'"
          @click="declineTermsOfUse()"
        />
      </div>
    </div>
  </EmptyLayout>
</template>

<script>
import EmptyLayout from '@router/layouts/EmptyLayout'
import axios from 'axios'

import constants from '@/api/constants'
import userService from '@/api/user.service'

export default {
  name: 'AgreeTermsOfUse',
  components: { EmptyLayout },
  data () {
    return {
      template: ''
    }
  },
  created () {
    axios.get('chart.html').then(response => {
      this.template = response.data
    })
  },
  methods: {
    acceptTermsOfUse () {
      userService.acceptTermsOfUse().then((data) => {
        if (data.success) {
          this.$store.commit('user/setAgreedTermsOfUse')
        }
      })
    },
    declineTermsOfUse () {
      window.location = constants.LOGOUT_URL
    }
  }
}
</script>

<style lang="scss" scoped>
.center {
  max-width: 1200px;
  margin: auto;
}

.chart {
  overflow: auto;
  max-height: 500px;
  h1 {
    margin: 0.67em;
  }
}

.buttons {
  margin-top: 30px;
  display: flex;
  button {
    margin: auto;
  }
}
</style>

<i18n locale="fr">
{
  "you-should-accept": "Vous devez accepter les conditions générales d'utilisation pour accéder à l'ENTA",
  "accept": "Accepter",
  "decline": "Refuser"
}
</i18n>
