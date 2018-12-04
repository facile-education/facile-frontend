<template>
  <div
    class="spinner"
  >
    <div class="bar1 theme-background-color" />
    <div class="bar2 theme-background-color" />
    <div class="bar3 theme-background-color" />
    <div class="bar4 theme-background-color" />
    <div class="bar5 theme-background-color" />
    <div class="bar6 theme-background-color" />
    <div class="bar7 theme-background-color" />
    <div class="bar8 theme-background-color" />
    <div class="bar9 theme-background-color" />
    <div class="bar10 theme-background-color" />
    <div class="bar11 theme-background-color" />
    <div class="bar12 theme-background-color" />
  </div>
</template>

<script>
export default {
  name: 'NeroSpinner'
}
</script>

<style lang="scss" scoped>
.theme-background-color {
  background-color: sandybrown;
}

.spinner {
  position: absolute;
  width: 50px;
  height: 50px;

  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);

  div {
    width: 4%;
    height: 20%;
    position: absolute;
    left: 24px;
    top: 20px;
    opacity: 0;
    -webkit-animation: spinner-anim 0.5s linear infinite;
    -moz-animation: spinner-anim 0.5s linear infinite;
    -ms-animation: spinner-anim 0.5s linear infinite;
    -o-animation: spinner-anim 0.5s linear infinite;
    animation: spinner-anim 0.5s linear infinite;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    -webkit-box-shadow: 0 0 3px rgba(0,0,0,0.2);
    -moz-box-shadow: 0 0 3px rgba(0,0,0,0.2);
    box-shadow: 0 0 3px rgba(0,0,0,0.2);
  }

  .bar1 {
    -webkit-transform: rotate(0deg) translate(0,-100%);
    -moz-transform: rotate(0deg) translate(0,-100%);
    -ms-transform: rotate(0deg) translate(0,-100%);
    -o-transform: rotate(0deg) translate(0,-100%);
    transform: rotate(0deg) translate(0,-100%);
    -webkit-animation-delay: 0s;
    -moz-animation-delay: 0s;
    -ms-animation-delay: 0s;
    -o-animation-delay: 0s;
    animation-delay: 0s;
  }

  .bar2 {
    -webkit-transform: rotate(30deg) translate(0,-100%);
    -moz-transform: rotate(30deg) translate(0,-100%);
    -ms-transform: rotate(30deg) translate(0,-100%);
    -o-transform: rotate(30deg) translate(0,-100%);
    transform: rotate(30deg) translate(0,-100%);
    -webkit-animation-delay: -0.9167s;
    -moz-animation-delay: -0.9167s;
    -ms-animation-delay: -0.9167s;
    -o-animation-delay: -0.9167s;
    animation-delay: -0.9167s;
  }

  .bar3 {
    -webkit-transform: rotate(90deg) translate(0,-100%);
    -moz-transform: rotate(90deg) translate(0,-100%);;
    -ms-transform: rotate(90deg) translate(0,-100%);
    -o-transform: rotate(90deg) translate(0,-100%);
    transform: rotate(60deg) translate(0,-100%);
    -webkit-animation-delay: -0.833s;
    -moz-animation-delay: -0.833s;
    -ms-animation-delay: -0.833s;
    -o-animation-delay: -0.833s;
    animation-delay: -0.833s;
  }

  .bar4 {
    -webkit-transform: rotate(90deg) translate(0,-100%);
    -moz-transform: rotate(90deg) translate(0,-100%);;
    -ms-transform: rotate(90deg) translate(0,-100%);
    -o-transform: rotate(90deg) translate(0,-100%);
    transform: rotate(90deg) translate(0,-100%);
    -webkit-animation-delay: -0.75s;
    -moz-animation-delay: -0.75s;
    -ms-animation-delay: -0.75s;
    -o-animation-delay: -0.75s;
    animation-delay: -0.75s;
  }

  .bar5 {
    -webkit-transform: rotate(120deg) translate(0,-100%);
    -moz-transform: rotate(120deg) translate(0,-100%);
    -ms-transform: rotate(120deg) translate(0,-100%);
    -o-transform: rotate(120deg) translate(0,-100%);
    transform: rotate(120deg) translate(0,-100%);
    -webkit-animation-delay: -0.667s;
    -moz-animation-delay: -0.667s;
    -ms-animation-delay: -0.667s;
    -o-animation-delay: -0.667s;
    animation-delay: -0.667s;
  }

  .bar6 {
    -webkit-transform: rotate(150deg) translate(0,-100%);
    -moz-transform: rotate(150deg) translate(0,-100%);
    -ms-transform: rotate(150deg) translate(0,-100%);
    -o-transform: rotate(150deg) translate(0,-100%);
    transform: rotate(150deg) translate(0,-100%);
    -webkit-animation-delay: -0.5833s;
    -moz-animation-delay: -0.5833s;
    -ms-animation-delay: -0.5833s;
    -o-animation-delay: -0.5833s;
    animation-delay: -0.5833s;
  }

  .bar7 {
    -webkit-transform: rotate(180deg) translate(0,-100%);
    -moz-transform: rotate(180deg) translate(0,-100%);
    -ms-transform: rotate(180deg) translate(0,-100%);
    -o-transform: rotate(180deg) translate(0,-100%);
    transform: rotate(180deg) translate(0,-100%);
    -webkit-animation-delay: -0.5s;
    -moz-animation-delay: -0.5s;
    -ms-animation-delay: -0.5s;
    -o-animation-delay: -0.5s;
    animation-delay: -0.5s;
  }

  .bar8 {
    -webkit-transform: rotate(210deg) translate(0,-100%);
    -moz-transform: rotate(210deg) translate(0,-100%);
    -ms-transform: rotate(210deg) translate(0,-100%);
    -o-transform: rotate(210deg) translate(0,-100%);
    transform: rotate(210deg) translate(0,-100%);
    -webkit-animation-delay: -0.41667s;
    -moz-animation-delay: -0.41667s;
    -ms-animation-delay: -0.41667s;
    -o-animation-delay: -0.41667s;
    animation-delay: -0.41667s;
  }

  .bar9 {
    -webkit-transform: rotate(240deg) translate(0,-100%);
    -moz-transform: rotate(240deg) translate(0,-100%);
    -ms-transform: rotate(240deg) translate(0,-100%);
    -o-transform: rotate(240deg) translate(0,-100%);
    transform: rotate(240deg) translate(0,-100%);
    -webkit-animation-delay: -0.333s;
    -moz-animation-delay: -0.333s;
    -ms-animation-delay: -0.333s;
    -o-animation-delay: -0.333s;
    animation-delay: -0.333s;
  }

  .bar10 {
    -webkit-transform: rotate(270deg) translate(0,-100%);
    -moz-transform: rotate(270deg) translate(0,-100%);
    -ms-transform: rotate(270deg) translate(0,-100%);
    -o-transform: rotate(270deg) translate(0,-100%);
    transform: rotate(270deg) translate(0,-100%);
    -webkit-animation-delay: -0.25s;
    -moz-animation-delay: -0.25s;
    -ms-animation-delay: -0.25s;
    -o-animation-delay: -0.25s;
    animation-delay: -0.25s;
  }

  .bar11 {
    -webkit-transform: rotate(300deg) translate(0,-100%);
    -moz-transform: rotate(300deg) translate(0,-100%);
    -ms-transform: rotate(300deg) translate(0,-100%);
    -o-transform: rotate(300deg) translate(0,-100%);
    transform: rotate(300deg) translate(0,-100%);
    -webkit-animation-delay: -0.1667s;
    -moz-animation-delay: -0.1667s;
    -ms-animation-delay: -0.1667s;
    -o-animation-delay: -0.1667s;
    animation-delay: -0.1667s;
  }

  .bar12 {
    -webkit-transform: rotate(330deg) translate(0,-100%);
    -moz-transform: rotate(330deg) translate(0,-100%);
    -ms-transform: rotate(330deg) translate(0,-100%);
    -o-transform: rotate(330deg) translate(0,-100%);
    transform: rotate(330deg) translate(0,-100%);
    -webkit-animation-delay: -0.0833s;
    -moz-animation-delay: -0.0833s;
    -ms-animation-delay: -0.0833s;
    -o-animation-delay: -0.0833s;
    animation-delay: -0.0833s;
  }
}

@-webkit-keyframes spinner-anim {
  from {opacity: 1;}
  to {opacity: 0.25;}
}

@-moz-keyframes spinner-anim {
  from {opacity: 1;}
  to {opacity: 0.25;}
}

@keyframes spinner-anim {
  from {opacity: 1;}
  to {opacity: 0.25;}
}
</style>
