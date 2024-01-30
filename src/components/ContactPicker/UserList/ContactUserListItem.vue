<template>
  <div data-test="UserListItem">
    <button @click="toggleUser">
      <span>
        {{ getFullName(user) }}
      </span>
      <div class="optionsContainer">
        <button
          @click.stop="openUserCardModal"
        >
          UserCard
        </button>
        <img
          v-if="!isSelected"
          src="@/assets/icons/add.svg"
          :alt="$t('add')"
          :title="$t('add')"
        >
        <img
          v-else
          src="@/assets/icons/remove.svg"
          :alt="$t('remove')"
          :title="$t('remove')"
        >
      </div>
    </button>
  </div>
</template>

<script>
import { getFullName } from '@utils/commons.util'

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
  data () {
    return {
      timeout: 0,
      clickDelayPassed: true
    }
  },
  computed: {
    isSelected () {
      return this.selectedUsers.map(user => user.userId).indexOf(this.user.userId) !== -1
    }
  },
  methods: {
    getFullName (user) {
      return getFullName(user)
    },
    toggleUser () {
      if (this.clickDelayPassed) {
        if (this.isSelected) {
          this.$emit('removeContact', this.user)
        } else {
          this.$emit('addContact', this.user)
        }
      }
      // Code to prevent double clicks to trigger two times the selection
      this.clickDelayPassed = false
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.clickDelayPassed = true
      }, 300)
    },
    openUserCardModal () {
      this.$store.dispatch('userCard/initUserCard', this.user)
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

  .optionsContainer{
    display: flex;
    align-items: center;
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

<i18n locale="fr">
  {
    "add": "Ajouter",
    "remove": "Supprimer"
  }
</i18n>
