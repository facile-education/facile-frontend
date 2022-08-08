<template>
  <div class="placeholder">
    <div class="message">
      <BaseIcon name="folder" />
      <p v-t="'noDocumentToDisplay'" />
    </div>
  </div>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon'
export default {
  name: 'DocumentPlaceHolder',
  components: { BaseIcon }
}
</script>

<style lang="scss" scoped>
@import '@design';

.placeholder{
  height: 100%;
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-top: 5em;
  font-size: 1.75em;
}

.message {
  display: flex;
  justify-content: center;
  align-items: center;
}

p{
  padding-left: 20px;
}

</style>

<i18n locale="fr">
{
  "noDocumentToDisplay": "Ajoutez un document avec le bouton + ou bien par glisser-déposer"
}
</i18n>
