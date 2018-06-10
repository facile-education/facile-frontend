<template>
  <div class="wrapper">
    <ApplicationDetails
      v-if="showDetails"
      :application="application"
      @closeDetails="toggleDetails"/>
    <div
      class="application"
      @click="toggleDetails">
      <i
        v-show="application.isAvailable"
        class="check fa fa-check"/>
      <img
        :src="application.image"
        class="logo">
      <p class="name">
        {{ application.serviceName }}
      </p>
    </div>
  </div>
</template>

<script>
import ApplicationDetails from '@/components/ApplicationManager/ApplicationDetails'

export default {
  name: 'Application',
  components: {
    ApplicationDetails
  },
  props: {
    application: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showDetails: false
    }
  },
  methods: {
    toggleDetails () {
      this.showDetails = !this.showDetails
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
  width: 100px;
  height: 100px;
}

.name {
  margin: 0;
  text-align: center;
}
</style>
