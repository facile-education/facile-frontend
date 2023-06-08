<template>
  <div
    class="information-icon"
    :style="'width: ' + size + '; height: ' + size"
    :aria-label="text"
    tabindex="0"
    @focus="isHovering=true"
    @blur="isHovering=false"
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <span v-t="'info-letter'" />
    <div
      v-if="isHovering"
      class="text"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'InformationIcon',
  props: {
    text: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: '20px'
    }
  },
  data () {
    return {
      isHovering: false
    }
  }
}
</script>

<style lang="scss" scoped>

.information-icon {
  position: relative;
  border-radius: 50%;
  border: 2px solid black;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  .text {
    cursor: default;
    position: absolute;
    top: 0;
    left: 100%;
    width: 300px;
    padding: 5px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  }
}

</style>

<i18n locale="fr" >
{
  "info-letter": "i"
}
</i18n>
