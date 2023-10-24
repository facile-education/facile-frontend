<template>
  <div
    v-show="loading"
    class="v-spinner"
  >
    <div
      class="spinner"
      :style="{position: 'relative', width: '100%', height:'100%', fontSize: 0}"
    >
      <!-- <div class="v-spinner" v-bind:style="containerStyle"> -->
      <div
        class="v-fade v-fade1 theme-background-color"
        :style="[spinnerStyle,animationStyle1]"
      /><div
        class="v-fade v-fade2 theme-background-color"
        :style="[spinnerStyle,animationStyle2]"
      /><div
        class="v-fade v-fade3 theme-background-color"
        :style="[spinnerStyle,animationStyle3]"
      /><div
        class="v-fade v-fade4 theme-background-color"
        :style="[spinnerStyle,animationStyle4]"
      /><div
        class="v-fade v-fade5 theme-background-color"
        :style="[spinnerStyle,animationStyle5]"
      /><div
        class="v-fade v-fade6 theme-background-color"
        :style="[spinnerStyle,animationStyle6]"
      /><div
        class="v-fade v-fade7 theme-background-color"
        :style="[spinnerStyle,animationStyle7]"
      /><div
        class="v-fade v-fade8 theme-background-color"
        :style="[spinnerStyle,animationStyle8]"
      />
    </div>
  </div>
</template>

<script>
export default {
  // TODO make the spinner appear smoothly, only after o short amount of time (to do here or in a high level place?)
  name: 'FadeLoader',
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: '9px'
    },
    width: {
      type: String,
      default: '3px'
    },
    margin: {
      type: String,
      default: '0'
    },
    radius: {
      type: String,
      default: '10px'
    }
  },
  data () {
    return {
      spinnerStyle: {
        height: this.height,
        width: this.width,
        margin: this.margin,
        borderRadius: this.radius
      }
    }
  },
  computed: {
    radiusValue () {
      return parseFloat(this.radius)
    },
    animationStyle1 () {
      return {
        top: 0,
        left: 0,
        animationDelay: '0.12s',
        transform: 'translate(-50%, -50%) translate(0, ' + this.radiusValue + 'px)'
      }
    },
    animationStyle2 () {
      return {
        top: 0,
        left: 0,
        animationDelay: '0.24s',
        transform: 'translate(-50%, -50%) rotate(-45deg) translate(0, ' + this.radiusValue + 'px)'
      }
    },
    animationStyle3 () {
      return {
        top: 0,
        left: 0,
        animationDelay: '0.36s',
        transform: 'translate(-50%, -50%) rotate(-90deg) translate(0, ' + this.radiusValue + 'px)'
      }
    },
    animationStyle4 () {
      return {
        top: 0,
        left: 0,
        animationDelay: '0.48s',
        transform: 'translate(-50%, -50%) rotate(-135deg) translate(0, ' + this.radiusValue + 'px)'
      }
    },
    animationStyle5 () {
      return {
        top: 0,
        left: 0,
        animationDelay: '0.60s',
        transform: 'translate(-50%, -50%) rotate(-180deg) translate(0, ' + this.radiusValue + 'px)'
      }
    },
    animationStyle6 () {
      return {
        top: 0,
        left: 0,
        animationDelay: '0.72s',
        transform: 'translate(-50%, -50%) rotate(135deg) translate(0, ' + this.radiusValue + 'px)'
      }
    },
    animationStyle7 () {
      return {
        top: 0,
        left: 0,
        animationDelay: '0.84s',
        transform: 'translate(-50%, -50%) rotate(90deg) translate(0, ' + this.radiusValue + 'px)'
      }
    },
    animationStyle8 () {
      return {
        top: 0,
        left: 0,
        animationDelay: '0.96s',
        transform: 'translate(-50%, -50%) rotate(45deg) translate(0, ' + this.radiusValue + 'px)'
      }
    }
  }
}
</script>

<style>
.v-spinner
{
  -webkit-animation: v-fadeStretchDelay 1.2s infinite ease-in-out;
  animation: v-fadeStretchDelay 1.2s infinite ease-in-out;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  position: absolute;
  left: 50%;
  top: 50%;
}

.v-fade {
  -webkit-animation: v-fadeStretchDelay 1.2s infinite ease-in-out;
  animation: v-fadeStretchDelay 1.2s infinite ease-in-out;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  position: absolute;
}

.spinner {
  position: relative;
}

@-webkit-keyframes v-fadeStretchDelay
{
  50%
  {
    -webkit-opacity: 0.3;
    opacity: 0.3;
  }
  100%
  {
    -webkit-opacity: 1;
    opacity: 1;
  }
}
@keyframes v-fadeStretchDelay
{
  50%
  {
    -webkit-opacity: 0.3;
    opacity: 0.3;
  }
  100%
  {
    -webkit-opacity: 1;
    opacity: 1;
  }
}
</style>
