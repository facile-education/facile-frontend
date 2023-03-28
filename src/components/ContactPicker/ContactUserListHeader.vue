<template>
  <div class="user-list-header">
    <button
      v-if="mq.phone"
      @click="closeMobileUserPanel"
    >
      <img
        class="back-arrow"
        src="@assets/arrow_right.svg"
        alt="back"
      >
    </button>

    <PentilaInput
      v-model="filter"
      class="filter-input"
      :placeholder="$t('searchPlaceHolder')"
      @update:modelValue="updateFilter"
    />

    <div class="nb-users">
      <img
        src="@assets/icons/user_2.svg"
        alt="user"
      >
      <div>{{ userListLength }}</div>
    </div>

    <button @click="toggleAll">
      <img
        v-if="!isAllListSelected"
        src="@assets/icons/add_list.svg"
        alt="toggle list"
      >
      <img
        v-show="isAllListSelected"
        src="@assets/icons/remove-list.svg"
        alt="toggle list"
      >
    </button>
  </div>
</template>

<script>
export default {
  name: 'ContactUserListHeader',
  inject: ['mq'],
  props: {
    userListLength: {
      type: Number,
      required: true
    },
    isAllListSelected: {
      type: Boolean,
      required: true
    }
  },
  emits: ['updateFilter', 'toggleAll'],
  data () {
    return {
      filter: ''
    }
  },
  methods: {
    closeMobileUserPanel () {
      this.$store.dispatch('contact/closeMobileUserList')
    },
    updateFilter () {
      this.$emit('updateFilter', this.filter)
    },
    toggleAll () {
      this.$emit('toggleAll', this.filter)
    }
  }
}
</script>

<style lang="scss" scoped>
.user-list-header {
  height: 32px;
  display: flex;
  justify-content: space-between;
}

.back-arrow {
  transform: rotate(180deg);
}
</style>

<i18n locale="fr">
{
  "searchPlaceHolder": "Rechercher"
}
</i18n>
