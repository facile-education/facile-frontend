<template>
  <div class="userCard-list-item">
    <template v-if="items && items.length > 0">
      <h2>
        <slot />
        <span>{{ title }}</span>
      </h2>
      <ul class="list">
        <li
          v-for="(item, index) in items"
          :key="index"
        >
          <span>{{ item }}</span>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
export default {
  name: 'UserCardListClasses',
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
  margin-left: 16px;
  li{
    display: flex;
    list-style: none;
    border-radius: 6px;
    span{
      border-radius: 6px;
      padding: 6px 8px;
      background-color: rgba(210, 1, 19, 0.4); border-color: rgba(210, 1, 19, 0.4)
  }
  }
}

}
</style>
