<template>
  <h1 :aria-label="$t('AgreeTermsOfUse.title')" />
  <div class="center">
    <div class="chart-container">
      <div
        data-test="terms-of-use"
        class="chart"
        v-html="template"
      />
    </div>
    <div class="buttons">
      <WeprodeButton
        ref="declineButton"
        v-t="'AgreeTermsOfUse.decline'"
        @click="declineTermsOfUse"
      />
      <WeprodeButton
        v-t="'AgreeTermsOfUse.accept'"
        @click="acceptTermsOfUse"
      />
    </div>
  </div>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import axios from 'axios'

import constants from '@/api/constants'
import userService from '@/api/user.service'

export default {
  name: 'AgreeTermsOfUse',
  components: { WeprodeButton },
  emits: ['update:layout'],
  data () {
    return {
      template: ''
    }
  },
  beforeCreate () {
    this.$emit('update:layout', 'PublicLayout')
  },
  created () {
    axios.get('chart.html').then(response => {
      this.template = response.data
    })
  },
  mounted () {
    this.$refs.declineButton.$el.classList.remove('theme-background-color') // TODO: Put an option to WeprodeButtons to get or not the theme color
  },
  methods: {
    acceptTermsOfUse () {
      userService.acceptTermsOfUse().then((data) => {
        if (data.success) {
          this.$store.commit('user/setAgreedTermsOfUse')
          let redirectPath = this.$router.options.history.state.back // The previous route
          if (redirectPath === this.$route.path) { // To avoid infinite redirect loop
            redirectPath = undefined
          }
          this.$router.push({ path: '/', query: { redirect: redirectPath } })
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
@import "@design";

.center {
  height: calc(100% - 2*$gve-layout-banner-height); /* Idk why 100% doesn't takes in account the layout banners height... */
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
}

.chart-container {
  overflow: auto;
  flex: 1;
  padding: 0 1rem;
  display: flex;
  justify-content: center;

  .chart {
    max-width: 1000px;
  }
}

.buttons {
  height: 7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  .button {
    width: 125px;
  }
}

@media screen and (min-width: 450px){
  .center {
    padding: 3rem 0 4rem 0;
  }

  .buttons .button {
    width: 200px;
  }
}
</style>
