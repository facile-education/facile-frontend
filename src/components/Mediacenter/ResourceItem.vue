<template>
  <div class="resource-wrapper">
    <div class="resource">
      <div
        class="flip-container"
        :class="{flipped}"
      >
        <div
          class="logo"
          tabindex="0"
          @click="openResource"
          @keydown.enter="openResource"
        >
          <img
            :src="resource.image.url"
            :alt="resource.name"
            :title="resource.name"
          >
        </div>
        <div class="details theme-background-color">
          <h4>{{ resource.name }}</h4>
          <p>{{ resource.editor }}</p>
        </div>
      </div>

      <div class="links">
        <!--a v-t="'resourceAccessLabel'" :href="resource.url" class="nero-text" target="_blank" /-->
        <a
          v-t="'Mediacenter.ResourceItem.details'"
          href="javascript:void(0);"
          class="nero-text"
          @click="toggleDetails"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResourceItem',
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      flipped: false
    }
  },
  methods: {
    openResource () {
      window.open(this.resource.url)
    },
    toggleDetails () {
      this.flipped = !this.flipped
    }
  }
}
</script>

<style lang="scss" scoped>
.resource-wrapper {
  position: relative;
  margin: 10px;
}

.resource {
  max-width: 330px;
  max-height: 330px;
  padding: 10px;
  position: relative;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.19);
  border-radius: 5px;
  perspective: 1000px;
}

.flip-container {
  position: relative;
  width: 310px;
  height: 250px;
  perspective: 1000px;
  transition: transform 0.5s;
  transform-style: preserve-3d;

  &.flipped {
    transform: rotatey(180deg);
    transition-duration: 0.5s;
  }
}

.logo {
  cursor: pointer;
}

.logo, .details {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.details {
  color: white;
  border-radius: 5px;
  transform: rotateY(180deg);
  padding: 10px 20px;

  p {
    margin-top: 20px;
    font-size: 13px;
  }
}

.links {
  margin-top: 10px;
  display: flex;
  font-size: 13px;

  a {
    margin-left: auto;
  }
}
</style>
