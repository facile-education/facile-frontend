<template>
  <div class="userCard-list-item">
    <template v-if="items && items.length > 0">
      <h2>
        <slot />
        <span>{{ title }}</span>
      </h2>
      <ul class="list">
        <!-- <li class="item" v-for="(item, index) in items" :key="index">{{ item }}<span v-if="index < items.length - 1">,</span></li> -->
        <!-- For items with backgroundColor -->
        <li
          v-for="(item, index) in items"
          :key="index"
          class="item"
        >{{ item }}</li>
      </ul>
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
.userCard-list-item {
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
  padding: 0;
  // For items with backgroundColor
  .item{
    padding: 6px 8px;
    background-color: rgba(25, 118, 210, 0.33333333);
    border-radius: 6px;
    list-style: none;
  }
}

}
</style>
