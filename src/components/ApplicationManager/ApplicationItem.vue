<template>
  <div class="wrapper">
    <div
      class="application"
      @click="showDetails"
    >
      <ApplicationDetails
        v-if="isSelected"
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
      <div
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

export default {
  name: 'ApplicationItem',
  components: {
    ApplicationDetails
  },
  props: {
    application: {
      type: Object,
      required: true
    }
  },
  computed: {
    isSelected () {
      return (this.$store.state.applicationManager.selectedApplication === this.application)
    }
  },
  methods: {
    hideDetails () {
      this.$store.commit('applicationManager/setSelectedApplication', undefined)
    },
    showDetails () {
      if (!this.isDetailsDisplayed) {
        this.$store.dispatch('applicationManager/selectApplication', this.application)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

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
  background-color: $color-valid-bg;
  color: $color-light-text;
  text-align: center;
  position: absolute;
  top: -10px;
  right: -10px;
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
  background-color: red;
}

.name {
  margin-top: 5px;
  text-align: center;
}
</style>
