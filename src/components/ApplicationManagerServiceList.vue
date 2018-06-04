<template>
  <div>
    <div
      v-for="service in services"
      :key="service.serviceId"
      class="application">
      <i
        v-if="service.isAvailable"
        class="check fa fa-check"/>
      <img
        :src="service.image"
        class="logo">
      <p class="name">
        {{ service.serviceName }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApplicationManagerServiceList',
  props: {
    category: {
      type: String,
      default: ''
    }
  },
  computed: {
    services () {
      var allServices = this.$store.state.applicationManager.services
      var services = []
      for (var index = 0; index < allServices.length; ++index) {
        var app = allServices[index].app
        if (app.serviceCategory === this.category) {
          services.push(app)
        }
      }
      return services
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.application {
  margin: 25px;
  position: relative;
  display: inline-block;
  max-width: 100px;
  max-height: 128px;
  vertical-align: top;
  cursor: pointer;
}

.check {
  background-color: $valid-background-color;
  color: $text-color-light;
  text-align: center;
  position: absolute;
  right: 0;
  border-radius: 50%;
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
