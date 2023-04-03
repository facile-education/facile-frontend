<template>
  <li>
    <button @click="toggleUser">
      <span>
        {{ user.text }}
      </span>
      <img
        v-if="!isSelected"
        src="@/assets/icons/add.svg"
        alt="remove"
      >
      <img
        v-else
        src="@/assets/icons/remove.svg"
        alt="add"
      >
    </button>
  </li>
</template>

<script>
export default {
  name: 'ContactUserListItem',
  props: {
    user: {
      type: Object,
      required: true
    },
    selectedUsers: {
      type: Array,
      required: true
    }
  },
  emits: ['removeContact', 'addContact'],
  computed: {
    isSelected () {
      return this.selectedUsers.map(user => user.userId).indexOf(this.user.userId) !== -1
    }
  },
  methods: {
    toggleUser () {
      if (this.isSelected) {
        this.$emit('removeContact', this.user)
      } else {
        this.$emit('addContact', this.user)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

button {
  height: 35px;
  padding: 0 0.5em;
  width: 100%;
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid $color-border;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  font-size: 1em;

  &:hover {
    background-color: $color-hover-bg;
  }

  span {
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  img {
    margin-left: 0.5em;
    width: 18px;
  }
}
</style>
