<template>
  <div class="banner-search">
    <input
      :placeholder="$t('banner.search')"
      class="search-input">
    <span
      :title="$t('banner.search')"
      class="advanced-search">
      toto
    </span>
  </div>
</template>

<script>
export default {
  name: 'AppBannerSearch'
}
</script>

<style lang="scss" scoped>
.banner-search {
  border: 1px white solid;
  display: inline-block;
  border-radius: 5px;
  height: 34px;
}

.advanced-search {
  display: inline-block;
  width: 34px;
  height: 34px;
  vertical-align: top;
  cursor: pointer;
}

.search-input {
  height: 34px;
  width: 303px;
  padding: 0 0 0 8px;
  margin: 0;
  font-size: 12px;
  border: 0;
  background-image: none;
}
</style>
