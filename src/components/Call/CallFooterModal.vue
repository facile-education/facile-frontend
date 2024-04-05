<template>
  <div
    class="footer"
  >
    <div class="recap">
      <h2>Récapitulatif</h2>
      <ul class="recapItems">
        <li>0<span>A</span></li>
        <li>0<span>R</span></li>
        <li>0<span>I</span></li>
        <li>0<span>E</span></li>
      </ul>
    </div>
    <div class="optionsButtonFooter">
      <WeprodeButton
        data-test="submitButton"
        label="Enregistrer"
      />
    </div>
  </div>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'

export default {
  name: 'CallFooterModal',
  components: {
    WeprodeButton
  },
  props: {
    session: {
      type: Object,
      required: true
    }
  }
}
</script>

  <style scoped lang="scss">
  @import "@design";
  .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 30px;
      .recap{
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
          h2{
              @extend %font-medium-s;
              font-size: 1em;
          }
          ul{
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 10px;
              padding-left: 0;
              li{
                  list-style: none;
              }
          }
      }
      .optionsButtonFooter{
          display: flex;
          gap: 10px;
      }
  }
  </style>
