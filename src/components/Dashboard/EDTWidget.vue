<template>
  <div
    class="group-widget"
  >
    <div
      class="header"
    >
      <span>{{ $t('edt') }}</span>
    </div>
    <div class="body">
      <h3>EDT widget</h3>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EDTWidget',
  props: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.group-widget {
  display: flex;
  flex-direction: column;
  height: 600px;
  max-height: 600px;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  .header {
    margin: 0;
    padding: 10px 10px;
  }

.body {
    padding: 10px 15px;
  }
}
</style>

<i18n locale="fr">
{
  "edt": "EDT"
}
</i18n>
