<template>
  <div class="banner-search">
    <input
      v-if="$device.desktop"
      :placeholder="$t('Banner.BannerSearch.searchLabel')"
      class="search-input"
    >
    <span
      :title="$t('Banner.BannerSearch.searchLabel')"
      class="advanced-search"
    >
      <i class="fa fa-search" />
    </span>
  </div>
</template>

<script>
export default {
  name: 'AppBannerSearch'
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

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
</style>
