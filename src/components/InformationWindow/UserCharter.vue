<template>
  <div>
    <br>
    <h3 align="center">
      <a
        href="http://www.pentilanero.com/?page_id=533"
        target="_blank"
      >{{ $t('InformationWindow.UserCharter.confidentialityRulesLinkText') }}
      </a>
    </h3>
    <div class="bodyCharter">
      <p v-t="'InformationWindow.UserCharter.charterText'" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserCharter'
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.bodyCharter {
  /* TODO change that horrible style */
  background-color: $text-color-menu;
  margin-top: 30px;
}

</style>
