<template>
  <tr
    class="group-user-item"
    :class="{'selected' : isSelected}"
    @click.stop="toggleUserSelection"
  >
    <td>
      <WeprodeCheckbox
        :model-value="isSelected"
        label=""
        class="checkbox"
        @click.stop
        @update:model-value="toggleUserSelection"
      />
    </td>
    <td>
      <a
        href="#"
        style="color: black;"
        class="toggle-user-card"
        @click.stop="openUserCardModal"
      >
        {{ fullName }}
      </a>
    </td>
    <td>{{ user.roles }}</td>
    <td>{{ user.schoolName }}</td>
  </tr>
</template>

<script>
import WeprodeCheckbox from '@/components/Base/Weprode/WeprodeCheckbox.vue'
export default {
  name: 'GroupUserItem',
  components: { WeprodeCheckbox },
  props: {
    user: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      required: true
    }
  },
  emits: ['toggleUserSelection'],
  computed: {
    fullName () {
      return `${this.user.lastName} ${this.user.firstName}`
    }
  },
  methods: {
    toggleUserSelection () {
      this.$emit('toggleUserSelection')
    },
    openUserCardModal () {
      this.$store.dispatch('userCard/initUserCard', this.user)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.group-user-item {
  border-top: 1px solid #d4d4d4;
  height: 50px;
  min-height: 50px;
  cursor: pointer;

  &.selected {
    background-color: #F3F6F8;
  }

  .checkbox {
    margin-top: -20px;
  }
}
</style>
