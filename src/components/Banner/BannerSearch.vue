<template>
  <div
    class="banner-search"
    data-test="banner-search"
  >
    <input
      v-if="mq.desktop"
      :placeholder="$t('searchLabel') + '...'"
      class="search-input"
    >
    <span
      :title="$t('searchLabel')"
      class="advanced-search"
    >
      <NeroIcon name="search" />
    </span>
  </div>
</template>

<script>
import NeroIcon from '@/components/Nero/NeroIcon'

export default {
  name: 'AppBannerSearch',
  components: { NeroIcon },
  inject: ['mq']
}
</script>

<style lang="scss" scoped>
@import "@design";

.banner-search {
  border: 1px white solid;
  display: flex;
  border-radius: $border-radius;
  height: 35px;
}

.advanced-search {
  width: 35px;
  height: 35px;
  line-height: 35px;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
}

.search-input {
  height: 33px;
  width: 303px;
  padding: 0 0 0 8px;
  margin: 0;
  font-size: 12px;
  border: 0;
  background-image: none;
}

.fa-search {
  font-size: 1.3rem;
}
</style>

<i18n locale="fr">
{
  "searchLabel": "Recherche",
}
</i18n>
