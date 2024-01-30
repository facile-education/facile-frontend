<template>
  <div class="userCardListItem">
    <template v-if="items && items.length > 0">
      <h2>
        <slot />
        <span>{{ title }}</span>
      </h2>
      <div class="list">
        <span class="item" v-for="(item, index) in items" :key="index">{{ item }}<span v-if="index < items.length - 1">,</span></span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'UserCardListItem',
  props: {
    items: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";
.userCardListItem {
&:not(:last-child) {
    margin-bottom: 14px;
}
h2 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    margin-bottom: 5px;
    @extend %font-regular-l;
}
.list {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    @extend %font-regular-m;
    margin: 0;
}

}
</style>
