<template>
  <div class="wrapper">
    <div
      class="application"
      @click="showDetails"
    >
      <ApplicationDetails
        v-if="isDetailsDisplayed"
        @closeDetails="hideDetails"
      />
      <i
        v-show="application.isAvailable"
        class="check fa fa-check"
      />
      <img
        v-if="application.image"
        :src="application.image"
        class="logo"
      >
      <NeroFallbackThumbnail
        v-else
        class="default"
      />
      <p class="name">
        {{ application.serviceName }}
      </p>
    </div>
  </div>
</template>

<script>
import ApplicationDetails from '@/components/ApplicationManager/ApplicationDetails'
import NeroFallbackThumbnail from '@/components/Nero/NeroFallbackThumbnail'

export default {
  name: 'ApplicationItem',
  components: {
    ApplicationDetails,
    NeroFallbackThumbnail
  },
  props: {
    application: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isDetailsDisplayed: false
    }
  },
  methods: {
    hideDetails () {
      this.isDetailsDisplayed = false
    },
    showDetails () {
      if (!this.isDetailsDisplayed) {
        this.isDetailsDisplayed = true
        this.$store.commit('applicationManager/setSelectedApplication', this.application)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.wrapper {
  position: relative;
  display: inline-block;
  vertical-align: top;
}

.application {
  margin: 25px;
  position: relative;
  max-width: 100px;
  max-height: 128px;
  cursor: pointer;
}

.check {
  background-color: $valid-background-color;
  color: $text-color-light;
  text-align: center;
  position: absolute;
  right: 0;
  border-radius: 50%;
  line-height: 30px;
  width: 30px;
  height: 30px;
}

.logo {
  display: flex;
  width: 100px;
  height: 100px;
}

.default {
  width: 100px;
  height: 100px;
  font-size: 75px;
}

.name {
  margin-top: 5px;
  text-align: center;
}
</style>
